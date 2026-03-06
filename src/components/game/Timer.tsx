import { useEffect, useRef } from "react";

interface TimerProps {
  totalSeconds: number;
  remainingSeconds: number;
  onTick: () => void;
  running: boolean;
}

export function Timer({ totalSeconds, remainingSeconds, onTick, running }: TimerProps) {
  const fraction = remainingSeconds / totalSeconds;
  const r = 18;
  const cx = 24;
  const cy = 24;
  
  const elapsed = 1 - fraction;
  const handAngle = elapsed * 360;
  const handRad = (handAngle - 90) * (Math.PI / 180);
  const hx = cx + (r - 4) * Math.cos(handRad);
  const hy = cy + (r - 4) * Math.sin(handRad);

  const elapsedRad = -Math.PI / 2 + elapsed * 2 * Math.PI;
  const remLargeArc = fraction > 0.5 ? 1 : 0;
  const elapsedLargeArc = elapsed > 0.5 ? 1 : 0;
  
  const ex = cx + r * Math.cos(elapsedRad);
  const ey = cy + r * Math.sin(elapsedRad);

  const topX = cx;
  const topY = cy - r;

  const remainingArcPath = fraction <= 0
    ? ""
    : fraction >= 1
    ? `M ${topX} ${topY} A ${r} ${r} 0 1 1 ${topX - 0.01} ${topY}`
    : `M ${ex} ${ey} A ${r} ${r} 0 ${remLargeArc} 1 ${topX} ${topY}`;

  const elapsedArcPath = elapsed <= 0
    ? ""
    : elapsed >= 1
    ? `M ${topX} ${topY} A ${r} ${r} 0 1 1 ${topX - 0.01} ${topY}`
    : `M ${topX} ${topY} A ${r} ${r} 0 ${elapsedLargeArc} 1 ${ex} ${ey}`;

  const isUrgent = remainingSeconds <= 10 && remainingSeconds > 0;
  const isCritical = remainingSeconds <= 5 && remainingSeconds > 0;

  // Remaining arc color
  const arcColor = isCritical 
    ? "hsl(0 90% 50%)" 
    : isUrgent 
    ? "hsl(40 95% 55%)" 
    : "hsl(145 70% 50%)";

  const urgentScale = isCritical ? "scale-[1.3]" : isUrgent ? "scale-[1.15]" : "";
  const blinkStyle = isUrgent && running ? {
    animation: isCritical 
      ? "timer-blink 0.35s ease-in-out infinite" 
      : "timer-blink 0.7s ease-in-out infinite",
  } : undefined;

  return (
    <div className={`flex flex-col items-center gap-0.5 transition-transform duration-300 ${urgentScale}`} style={blinkStyle}>
      <svg width="48" height="48" viewBox="0 0 48 48">
        {/* background circle */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="hsl(0 0% 100% / 0.1)" strokeWidth="4" />
        {/* elapsed arc (red) */}
        {elapsedArcPath && (
          <path d={elapsedArcPath} fill="none" stroke="hsl(0 80% 45%)" strokeWidth="4" opacity="0.5" />
        )}
        {/* remaining arc */}
        {remainingArcPath && (
          <path d={remainingArcPath} fill="none" stroke={arcColor} strokeWidth="4" strokeLinecap="round" />
        )}
        {/* center dot */}
        <circle cx={cx} cy={cy} r="2" fill="hsl(30 95% 55%)" />
        {/* hand */}
        <line x1={cx} y1={cy} x2={hx} y2={hy} stroke="hsl(30 95% 55%)" strokeWidth="1.5" strokeLinecap="round" />
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
      <span 
        className={`text-xs font-bold font-display ${isUrgent ? "scale-110" : ""}`}
        style={{ 
          color: isCritical ? "hsl(0 90% 55%)" : isUrgent ? "hsl(40 95% 60%)" : "hsl(0 0% 100%)",
          transition: "color 0.3s, transform 0.3s"
        }}
      >
        {remainingSeconds}s
      </span>
    </div>
  );
}
