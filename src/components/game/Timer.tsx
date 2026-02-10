import { useEffect, useState, useRef } from "react";

interface TimerProps {
  totalSeconds: number;
  remainingSeconds: number;
  onTick: () => void;
  running: boolean;
}

export function Timer({ totalSeconds, remainingSeconds, onTick, running }: TimerProps) {
  const fraction = remainingSeconds / totalSeconds;
  const angle = fraction * 360;
  const r = 35;
  const cx = 45;
  const cy = 45;
  
  // hand angle (0 = 12 o'clock, clockwise)
  const handAngle = (1 - fraction) * 360;
  const handRad = (handAngle - 90) * (Math.PI / 180);
  const hx = cx + (r - 5) * Math.cos(handRad);
  const hy = cy + (r - 5) * Math.sin(handRad);

  // arc for remaining
  const startRad = -Math.PI / 2;
  const endRad = startRad + (fraction * 2 * Math.PI);
  const largeArc = fraction > 0.5 ? 1 : 0;
  const ax = cx + r * Math.cos(endRad);
  const ay = cy + r * Math.sin(endRad);

  const arcPath = fraction <= 0
    ? ""
    : fraction >= 1
    ? `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r}`
    : `M ${cx} ${cy - r} A ${r} ${r} 0 ${largeArc} 1 ${ax} ${ay}`;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="90" height="90" viewBox="0 0 90 90">
        {/* background circle */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="hsl(0 80% 45%)" strokeWidth="6" opacity="0.3" />
        {/* remaining arc */}
        {arcPath && (
          <path d={arcPath} fill="none" stroke="hsl(145 70% 50%)" strokeWidth="6" strokeLinecap="round" />
        )}
        {/* center dot */}
        <circle cx={cx} cy={cy} r="3" fill="hsl(30 95% 55%)" />
        {/* hand */}
        <line x1={cx} y1={cy} x2={hx} y2={hy} stroke="hsl(30 95% 55%)" strokeWidth="2.5" strokeLinecap="round" />
        {/* ticks */}
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i * 30 - 90) * (Math.PI / 180);
          const inner = r - 4;
          return (
            <line
              key={i}
              x1={cx + inner * Math.cos(a)}
              y1={cy + inner * Math.sin(a)}
              x2={cx + r * Math.cos(a)}
              y2={cy + r * Math.sin(a)}
              stroke="hsl(0 0% 100% / 0.4)"
              strokeWidth="1"
            />
          );
        })}
      </svg>
      <span className="text-sm font-bold font-display" style={{ color: remainingSeconds <= 10 ? "hsl(0 80% 55%)" : "hsl(0 0% 100%)" }}>
        {remainingSeconds}s
      </span>
    </div>
  );
}
