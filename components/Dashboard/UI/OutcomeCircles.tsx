import { useMemo, useEffect, useState } from "react";

interface OutcomeCirclesProps {
  winOutcome: any[];
}

const OutcomeCircles = ({ winOutcome }: OutcomeCirclesProps) => {
  const [animate, setAnimate] = useState<boolean>(false); // For the intro animation
  const [isExiting, setIsExiting] = useState<boolean>(false); // For the exit animation

  // Start the animation after the component renders
  useEffect(() => {
    setIsExiting(true); // Start exit animation
    const exitTimeout = setTimeout(() => {
      setIsExiting(false); // After exit animation, trigger entry animation
      setAnimate(true);
    }, 300); // Exit animation duration (300ms)

    return () => clearTimeout(exitTimeout); // Clean up the timeout
  }, [winOutcome]); // Trigger whenever winOutcome changes

  const outcomeElements = useMemo(() => {
    return winOutcome?.map((outcome, index) => (
      <span
        key={outcome.id}
        className={`flex items-center justify-center w-10 lg:w-9 h-9 rounded-full transition-all duration-500 ease-in-out ${
          animate ? "animate-circle" : "opacity-0 filter blur-xl" // Apply intro animation after exit
        } ${isExiting ? "opacity-0 filter blur-xl" : ""} 
          ${outcome.result === "win" ? "bg-[#42B6B1] text-white" : "bg-[#FF4545] text-white"}`}
        style={{
          animationDelay: `${index * 200}ms`, // Stagger animation for each circle
        }}
      >
        {outcome.result === "win" ? "✓" : "✕"}
      </span>
    ));
  }, [winOutcome, animate, isExiting]);

  const remainingCircles = useMemo(() => {
    return [...Array(4 - winOutcome.length)].map((_, index) => (
      <span
        key={`dotted-${index}`}
        className={`flex items-center justify-center w-10 lg:w-9 h-9 rounded-full bg-transparent border-2 border-dashed border-gray-400 transition-all duration-500 ease-in-out ${
          animate ? "animate-circle" : "opacity-0 filter blur-xl" // Apply intro animation after exit
        } ${isExiting ? "opacity-0 filter blur-xl" : ""}`}
        style={{
          animationDelay: `${(winOutcome.length + index) * 200}ms`, // Delay for remaining circles
        }}
      />
    ));
  }, [winOutcome.length, animate, isExiting]);

  return (
    <>
      <span
        className={`flex items-center justify-center text-white bg-[#C6C6C6] w-10 lg:w-9 h-9 rounded-full transition-all duration-500 ease-in-out ${
          animate ? "animate-circle" : "opacity-0 filter blur-xl"
        } ${isExiting ? "opacity-0 filter blur-xl" : ""}`}
      >
        ?
      </span>
      {outcomeElements}
      {remainingCircles}
    </>
  );
};

export default OutcomeCircles;
