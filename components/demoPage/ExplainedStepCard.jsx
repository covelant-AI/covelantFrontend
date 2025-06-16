import Image from "next/image";
import { CircleDot  } from 'lucide-react';

export default function ExplainedStepCard({
  imageSrc,
  stepNumber,
  title,
  description,
  bulletPoints
}) {
  return (
    <section className="flex flex-col md:flex-row items-center justify-center gap-10 px-6 md:px-20 lg:px-40 py-20 my-10 font-Figtree z-10">
      {/* Left Side - Image Card */}
      <div className="relative w-110 h-90 rounded-xl overflow-hidden shadow-lg z-10">
        <Image 
          src={imageSrc} 
          alt={title} 
          layout="fill" 
          objectFit="cover" 
          className="rounded-xl"
        />
      </div>
      
      {/* Right Side - Content */}
      <div className="w-full md:w-1/2 space-y-6">
        <h2 className="text-5xl max-md:text-4xl font-bold text-black">{title}</h2>
        <p className="text-black mt-4">{description}</p>
        
        {/* Bullet Points */}
        <div className="mt-6 space-y-4">
          {bulletPoints.map((point, index) => (
            <div key={index} className="flex flex-row items-center gap-3">
              <CircleDot  className="text-black"/>
              <div>
                <h4 className="text-black font-semibold">{point.heading}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
