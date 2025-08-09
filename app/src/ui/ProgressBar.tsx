import { useEffect, useRef, useState } from "react";
import { clamp } from "../game/time";
import { EMA_K } from "../game/balance";

type Props = { startAt: number; endAt: number; clock: number; label?: string };

export default function ProgressBar({ startAt, endAt, clock, label }: Props) {
  const duration = Math.max(1e-6, endAt - startAt);
  const target = clamp((clock - startAt) / duration);

  // internal displayed value
  const [display, setDisplay] = useState(target);

  // keep the latest target & display in refs so the RAF loop never restarts
  const targetRef = useRef(target);
  const displayRef = useRef(display);
  const doneRef = useRef(false);

  // update target every render
  useEffect(() => {
    targetRef.current = target;
    // hard snap when complete (or extremely close)
    if (target >= 1 || (endAt - clock) <= 1e-6) {
      doneRef.current = true;
      displayRef.current = 1;
      setDisplay(1);
    }
  }, [target, endAt, clock]);

  // one continuous RAF loop
  useEffect(() => {
    let raf = 0;
    let last = performance.now();

    const loop = (t: number) => {
      const dt = Math.min(0.1, (t - last) / 1000); // cap big frames
      last = t;

      if (!doneRef.current) {
        const tgt = targetRef.current;
        let d = displayRef.current;
        const gap = tgt - d;

        // adaptive smoothing: speed up catch-up on big jumps (time skips)
        const boost = 1 + Math.min(3, Math.abs(gap) / 0.2 * 2);
        const alpha = 1 - Math.exp(-EMA_K * boost * dt);

        d = d + gap * alpha;

        // within 0.2% of target? snap to it to avoid end jitter
        if (tgt >= 1 && (1 - d) < 0.002) {
          d = 1;
          doneRef.current = true;
        }

        d = clamp(d, 0, 1);
        displayRef.current = d;
        setDisplay(d);
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const pct = Math.round(display * 100);
  const tempo = duration < 0.5 ? "FAST" : duration >= 5 ? "LONG" : "STANDARD";

  return (
    <div className="w-full">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-medium">{label ?? "Progress"}</span>
        <div className="text-xs opacity-70">{tempo} • {pct}%</div>
      </div>
      <div className="h-3 w-full rounded-full bg-gray-200">
        {/* no CSS transition—JS does the easing */}
        <div
          className="h-3 rounded-full bg-indigo-500"
          style={{ width: `${display * 100}%` }}
        />
      </div>
    </div>
  );
}
