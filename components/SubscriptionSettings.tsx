import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function SubscriptionSettings(){

    return(
        <div className='flex flex-col justify-center items-center pt-6'>
            <h3 className='text-black text-center font-semibold'><span className='text-xl font-bold'>Sorry Mario!</span><br/>The subscription plan is in another castle</h3>
         <DotLottieReact
              src="https://lottie.host/38974e19-2c4c-4f37-98c0-05564a373c02/Hdbn9lNhRT.lottie"
              loop
              autoplay
              className='w-100 h-50 justify-center'
            />
            <h3 className='text-black text-center font-semibold'>You get access to everything for free!</h3>
        </div>
    )
}