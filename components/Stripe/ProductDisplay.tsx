// 'use client';
// import { useState } from 'react';
// import Image from "next/image"
// import {plans} from "@/lib/Pricing"
// import { useAuth } from '@/app/context/AuthContext';

// export default function UpgradeToPro() {
//   const [plan, setPlan] = useState<'Athlete' | 'Pay as You Go'>('Athlete');
//   const {profile}= useAuth()

// const handleUpgrade = () => {
//   const url =
//     plan === 'Athlete'
//       ? `${plans[0].link}?prefilled_email=${encodeURIComponent(profile.email)}`
//       : `${plans[1].link}?prefilled_email=${encodeURIComponent(profile.email)}`

//   window.open(url, '_blank');
// };


//   return (
//     <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md font-sans">
//       <h2 className="text-2xl md:text-3xl font-bold text-center">
//         Upgrade to a <span className="text-teal-600">Athlete Plan</span>
//       </h2>

//       {/* Features */}
//       <div className="flex flex-col md:flex-row justify-between gap-4 my-6">
//         {/* Full Analytics */}
//         <div className="bg-gray-50 rounded-xl p-4 shadow flex-1 text-center">
//           <Image
//             src="/images/payment1.png"
//             alt="Profile picture"
//             width={72}
//             height={72}
//             className="object-cover w-full h-35"
//             />
//           <p className="font-semibold text-teal-700  py-2">AI Analytics</p>
//         </div>

//         {/* Team Mode */}
//         <div className="bg-gray-50 rounded-xl p-4 shadow flex-1 text-center">
//             <Image
//               src="/images/payment2.png"
//               alt="Profile picture"
//               width={72}
//               height={72}
//             className="object-cover w-full h-35"
//             />
//           <p className="font-semibold text-teal-700  py-2">Team Mode</p>
//         </div>

//         {/* Unlimited Uploads */}
//         <div className="bg-gray-50 rounded-xl p-4 shadow flex-1 text-center">
//             <Image
//               src="/images/payment3.png"
//               alt="Profile picture"
//               width={72}
//               height={72}
//             className="object-cover w-full h-35"
//             />
//           <p className="font-semibold text-teal-700  py-2">More Uploads</p>
//         </div>

//       </div>

//       {/* Plan selection */}
//       <div className="mb-4">
//         <p className="text-sm font-medium mb-2">Select your Plan</p>
//         <div className="flex gap-4 w-full justify-around py-4 ">
//           <button
//             onClick={() => setPlan('Athlete')}
//             className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
//               plan === 'Athlete'
//                 ? 'border-teal-500 text-teal-700 bg-teal-50'
//                 : 'border-gray-300 text-gray-700'
//             }`}
//           >
//             <div className="w-4 h-4 border rounded-full flex items-center justify-center">
//               {plan === 'Athlete' && <div className="w-2 h-2 bg-teal-600 rounded-full" />}
//             </div>
//             Monthly
//           </button>
//           <button
//             onClick={() => setPlan('Pay as You Go')}
//             className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
//               plan === 'Pay as You Go'
//                 ? 'border-teal-500 text-teal-700 bg-teal-50'
//                 : 'border-gray-300 text-gray-700'
//             }`}
//           >
//             <div className="w-4 h-4 border rounded-full flex items-center justify-center">
//               {plan === 'Pay as You Go' && <div className="w-2 h-2 bg-teal-600 rounded-full" />}
//             </div>
//             Pay as You Go
//           </button>
//         </div>
//       </div>

//       {/* Price and Button */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between border-t pt-4">
//         <div className="text-xl font-bold">
//           {plan == "Athlete"? "12,99" : "2.99"}<span className="text-md font-bold ">{plan == "Athlete"? "€/mo" : "€"}</span>{' '}
//           <span className="text-sm text-gray-500">{plan == "Athlete"? "(Billed Monthly)" : "(Get +100 credits)"}</span>
//         </div>
//         <button
//           onClick={handleUpgrade}
//           className="mt-4 md:mt-0 bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg transition-all"
//         >
//           Upgrade Now
//         </button>
//       </div>
//     </div>
//   );
// }



