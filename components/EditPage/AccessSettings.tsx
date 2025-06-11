import Image from 'next/image'
export default function AccessSettings(){
    return(
        <div className='flex flex-col justify-center items-center w-full'>
             <Image className="itmes-center" src="/images/thumbsUp.png" alt="Link" width={300} height={300} />
             <h3 className='text-black text-center text-xl font-semibold mb-2'>You can enjoy full access already</h3>
             <p className='text-gray-400 text-center'>That&apos;s what you get for being an amazing customer</p>
        </div>
    )
}