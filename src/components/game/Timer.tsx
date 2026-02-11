import { useEffect, useState, useRef } from "react";

interface TimerProps {
  totalSeconds: number;
  remainingSeconds: number;
  onTick: () => void;
  running: boolean;
}

export function Timer({ totalSeconds, remainingSeconds, onTick, running }: TimerProps) {
  const fraction = remainingSeconds / totalSeconds;
  const r = 26;
  const cx = 34;
  const cy = 34;
  
  // hand moves clockwise from 12 o'clock: elapsed fraction * 360
  const elapsed = 1 - fraction;
  const handAngle = elapsed * 360;
  const handRad = (handAngle - 90) * (Math.PI / 180);
  const hx = cx + (r - 4) * Math.cos(handRad);
  const hy = cy + (r - 4) * Math.sin(handRad);

  // arc: draw remaining portion clockwise from 12 o'clock
  // We draw the "remaining" arc starting where elapsed ends, going clockwise to 12 o'clock
  // Easier: draw elapsed arc (red bg) and remaining arc (green) on top
  const elapsedRad = -Math.PI / 2 + elapsed * 2 * Math.PI;
  const remLargeArc = fraction > 0.5 ? 1 : 0;
  const elapsedLargeArc = elapsed > 0.5 ? 1 : 0;
  
  const ex = cx + r * Math.cos(elapsedRad);
  const ey = cy + r * Math.sin(elapsedRad);

  // Remaining arc: from elapsedRad clockwise back to 12 o'clock (-PI/2)
  const topX = cx;
  const topY = cy - r;

  const remainingArcPath = fraction <= 0
    ? ""
    : fraction >= 1
    ? `M ${topX} ${topY} A ${r} ${r} 0 1 1 ${topX - 0.01} ${topY}`
    : `M ${ex} ${ey} A ${r} ${r} 0 ${remLargeArc} 1 ${topX} ${topY}`;

  // Elapsed arc: from 12 o'clock clockwise to elapsedRad
  const elapsedArcPath = elapsed <= 0
    ? ""
    : elapsed >= 1
    ? `M ${topX} ${topY} A ${r} ${r} 0 1 1 ${topX - 0.01} ${topY}`
    : `M ${topX} ${topY} A ${r} ${r} 0 ${elapsedLargeArc} 1 ${ex} ${ey}`;

  return (
    <div className="flex flex-col items-center gap-0.5">
      <svg width="68" height="68" viewBox="0 0 68 68">
        {/* background circle */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="hsl(0 0% 100% / 0.1)" strokeWidth="5" />
        {/* elapsed arc (red) */}
        {elapsedArcPath && (
          <path d={elapsedArcPath} fill="none" stroke="hsl(0 80% 45%)" strokeWidth="5" opacity="0.5" />
        )}
        {/* remaining arc (green) */}
        {remainingArcPath && (
          <path d={remainingArcPath} fill="none" stroke="hsl(145 70% 50%)" strokeWidth="5" strokeLinecap="round" />
        )}
        {/* center dot */}
        <circle cx={cx} cy={cy} r="2.5" fill="hsl(30 95% 55%)" />
        {/* hand */}
        <line x1={cx} y1={cy} x2={hx} y2={hy} stroke="hsl(30 95% 55%)" strokeWidth="2" strokeLinecap="round" />
        {/* ticks */}
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i * 30 - 90) * (Math.PI / 180);
          const inner = r - 3;
          return (
            <line
              key={i}
              x1={cx + inner * Math.cos(a)}
              y1={cy + inner * Math.sin(a)}
              x2={cx + r * Math.cos(a)}
              y2={cy + r * Math.sin(a)}
              stroke="hsl(0 0% 100% / 0.3)"
              strokeWidth="1"
            />
          );
        })}
      </svg>
      <span className="text-xs font-bold font-display" style={{ color: remainingSeconds <= 10 ? "hsl(0 80% 55%)" : "hsl(0 0% 100%)" }}>
        {remainingSeconds}s
      </span>
    </div>
  );
}
