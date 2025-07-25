// // pages/api/create-portal-session.js
// import Stripe from 'stripe';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// export async function POST(req, res) {
//   if (req.method !== 'POST') return res.status(405).end();

//   const { session_id } = req.body;
//   const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

//   const portalSession = await stripe.billingPortal.sessions.create({
//     customer: checkoutSession.customer,
//     return_url: req.headers.origin,
//   });

//   res.status(200).json({ url: portalSession.url });
// }
