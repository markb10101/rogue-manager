import { useEffect, useRef } from 'react';
import ProgressBar from './ui/ProgressBar';
import TopBar from './ui/TopBar';
import { useGameStore } from './game/store';
import { clamp } from './game/time';

export default function App() {
  const advance = useGameStore((s) => s.advance);
  const addMinutes = useGameStore((s) => s.addMinutes);
  const setTimeScale = useGameStore((s) => s.setTimeScale);
  const startDemoMission = useGameStore((s) => s.startDemoMission);
  const demo = useGameStore((s) => s.demoMission);
  const timeScale = useGameStore((s) => s.timeScale);
  const gameMinutes = useGameStore((s) => s.gameMinutes);

  const prev = useRef(performance.now());
  const raf = useRef(0);

  useEffect(() => {
    const step = (now: number) => {
      const dt = now - prev.current;
      prev.current = now;
      advance(dt);
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [advance]);

  const ratio = demo.status === 'idle'
    ? 0
    : clamp((gameMinutes - demo.startAt) / (demo.endAt - demo.startAt), 0, 1);

  return (
    <div className="p-4 space-y-4">
      <TopBar />
      <ProgressBar ratio={ratio} timeScale={timeScale} />
      <div className="space-x-2">
        <button className="px-2 py-1 bg-gray-700" onClick={() => addMinutes(10)}>+10m</button>
        <button className="px-2 py-1 bg-gray-700" onClick={() => addMinutes(30)}>+30m</button>
        <button className="px-2 py-1 bg-gray-700" onClick={() => addMinutes(60)}>+60m</button>
      </div>
      <div className="flex items-center space-x-2">
        <label htmlFor="timeScale">Time Scale</label>
        <input
          id="timeScale"
          type="range"
          min="0.5"
          max="3"
          step="0.5"
          value={timeScale}
          onChange={(e) => setTimeScale(parseFloat(e.target.value))}
        />
      </div>
      <button className="px-2 py-1 bg-blue-600" onClick={startDemoMission}>Start Demo Mission</button>
    </div>
  );
}
