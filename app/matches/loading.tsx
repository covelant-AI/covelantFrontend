
import RadialBlurBg from '@/components/UI/RadialBlur';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white max-h-screen pt-10">
      <h1 className="absolute text-3xl font-normal text-center text-gray-600 mb-20">
        please wait while<br />Or our AI will be mad :D
      </h1>
      <RadialBlurBg
        background={
          'radial-gradient(50% 50% at 50% 50%,rgba(8, 113, 151, 0.1) 61%,rgba(0, 180, 174, 0.12) 78%,rgba(176, 198, 255, 0) 100%)'
        }
        width="auto"
        height="700px"
        rotate="0deg"
        top="15vh"
        left="5vh"
      />
    </div>
  )
}
