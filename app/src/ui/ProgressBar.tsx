import { useEffect, useRef, useState } from 'react';
import { EMA_K } from '../game/balance';

interface Props {
  ratio: number; // 0..1
  timeScale: number;
}

export default function ProgressBar({ ratio, timeScale }: Props) {
  const [smoothed, setSmoothed] = useState(ratio);
  const rafRef = useRef(0);

  useEffect(() => {
    const update = () => {
      setSmoothed((s) => s + (ratio - s) / EMA_K);
      rafRef.current = requestAnimationFrame(update);
    };
    rafRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafRef.current);
  }, [ratio]);

  const tempo = timeScale > 1 ? 'FAST' : timeScale < 1 ? 'LONG' : 'STANDARD';

  return (
    <div className="w-full bg-gray-800 h-4 relative">
      <div
        className="h-full bg-green-500"
        style={{ width: `${Math.min(smoothed, 1) * 100}%` }}
      />
      <span className="absolute right-0 -top-5 text-xs">{tempo}</span>
    </div>
  );
}
