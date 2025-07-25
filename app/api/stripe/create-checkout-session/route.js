import { headers } from 'next/headers'

import { stripe } from '../../lib/stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); 

export async function POST(req, res) {

  const origin = (await headers()).get('origin')

  // Create Checkout Sessions from body params.
  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    line_items: [
      {
        // Provide the exact Price ID (for example, price_1234) of
        // the product you want to sell
        price: 'price_1Rn5A9C2Mpdb11IrkUox6FKn',
        quantity: 1
      }
    ],
    mode: 'payment',
    return_url: `${origin}/return?session_id={CHECKOUT_SESSION_ID}`,
  })

  return session.client_secret
}