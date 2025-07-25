export const plans = [
  {
    link: process.env.NODE_ENV === 'development' ? process.env.NEXT_PUBLIC_ATHLETE_PLAN_LINK: '',
    priceId: process.env.NODE_ENV === 'development' ? process.env.ATHLETE_PLAN_ID : '',
    price: 12.99,
    currency: 'eur',
    duration: '/month',
  },
  {
    link: process.env.NODE_ENV === 'development' ? process.env.NEXT_PUBLIC_PAY_AS_YOU_GO_LINK : '',
    priceId: process.env.NODE_ENV === 'development' ? process.env.PAY_AS_YOU_GO_ID : '',
    price: 2.99,
    currency: 'eur',
  },
];
