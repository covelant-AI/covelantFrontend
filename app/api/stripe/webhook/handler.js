import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { PrismaClient } from '@/generated/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const prisma = new PrismaClient();

async function getUserInfo(identifier) {
    const isEmail = identifier.includes('@');

   if (isEmail) {
     const coach = await prisma.coach.findFirst({
       where: { email: identifier },
     });

     if (coach) return { ...coach, role: 'coach' };

     const player = await prisma.player.findFirst({
       where: { email: identifier },
     });

     if (player) return { ...player, role: 'player' };

     return null;
   } else {
     const coach = await prisma.coach.findFirst({
       where: { customerId: identifier },
     });

     if (coach) return { ...coach, role: 'coach' };

     const player = await prisma.player.findFirst({
       where: { customerId: identifier },
     });

     if (player) return { ...player, role: 'player' };

     return null;
   }
 }


 export async function POST(req) {
     const body = await req.text();
     const reqHeaders = await headers();
     const signature = reqHeaders.get('stripe-signature');

     let data;
     let eventType;
     let event;

     // verify Stripe event is legit
     try {
         event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
     } catch (err) {
         console.error(`Webhook signature verification failed. ${err.message}`);
         return NextResponse.json({ error: err.message }, { status: 400 });
     }

     data = event.data;
     eventType = event.type;

     try {
         switch (eventType) {
         case 'checkout.session.completed': {
              const session = await stripe.checkout.sessions.retrieve(data.object.id, {
                expand: ['line_items'],
              });
            
              // Get a usable customer id (string) if present
              const customerId =
                typeof session.customer === 'string'
                  ? session.customer
                  : session.customer?.id ?? null;
            
              // Try to get the email either from the customer object or from session.customer_details
              let email = null;
            
              if (customerId) {
                // We have a customer id; fetch to read the email
                const customer = await stripe.customers.retrieve(customerId);
                // @ts-ignore – runtime check
                email = (customer)?.email ?? null;
              } else {
                // No Customer on the session (common for one-time payments)
                email = session.customer_details?.email ?? null;
              }
            
              if (!email) {
                console.error('No customer email found');
                throw new Error('No user found');
              }
            
              const priceId = session?.line_items?.data?.[0]?.price?.id ?? null;
              const unitAmount = session?.line_items?.data?.[0]?.price?.unit_amount ?? null;
            
              const user = await getUserInfo(email);
              if (!user) {
                console.error('No matching user found in DB');
                throw new Error('No user found');
              }
            
              const creditToAdd =
                unitAmount === 129900 ? 500 : // if unit_amount is in cents
                unitAmount === 1299   ? 500 :
                unitAmount === 29900  ? 100 :
                unitAmount === 299    ? 100 : 0;
            
              if (creditToAdd === 0) {
                console.warn('Unknown payment amount, skipping credit update');
                break;
              }
            
              const model = user.role === 'coach' ? prisma.coach : prisma.player;
              await model.update({
                where: { id: user.id },
                data: {
                  priceId: priceId ?? undefined,
                  credits: { increment: creditToAdd },
                },
              });
            
              break;
            }


             case 'customer.subscription.deleted': {
               const subscription = await stripe.subscriptions.retrieve(data.object.id);
            
               const user = await getUserInfo(subscription.customer);
            
               if (!user) {
                 console.error('No matching user found for subscription.customer');
                 throw new Error('No user found');
               }
          
               const model = user.role === 'coach' ? prisma.coach : prisma.player;
          
               await model.update({
                 where: { id: user.id },
                 data: {
                   priceId: 'Free',
                 },
               });
          
               break;
             }

             case 'invoice.paid': {
               const subscription = await stripe.subscriptions.retrieve(data.object.id);

               const user = await getUserInfo(subscription.customer);
            
               if (!user) {
                 console.error('No matching user found for subscription.customer');
                 throw new Error('No user found');
               }
          
               const model = user.role === 'coach' ? prisma.coach : prisma.player;
          
               await model.update({
                 where: { id: user.id },
                 data: {
                   credits: { increment: 500 },
                 },
               });
          
               break;
             }

             default:
             // Unhandled event type
         }
     } catch (e) {
         console.error(
             'stripe error: ' + e.message + ' | EVENT TYPE: ' + eventType
         );
     }

     return NextResponse.json({});
 }