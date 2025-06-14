import { useEffect, useRef, useState } from "react";

export function useAnimatedNumber(target: number, speed = 100) {
  const [value, setValue] = useState(target);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const diff = target - value;
    if (diff === 0) return;

    const step = () => {
      setValue((prev) => {
        if (prev === target) return prev;

        const delta = Math.sign(diff) * Math.ceil(Math.abs(diff) / speed * 10);
        const next = prev + delta;

        return (Math.sign(diff) === Math.sign(target - next)) ? next : target;
      });
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current!);
  }, [target]);

  return value;
}
