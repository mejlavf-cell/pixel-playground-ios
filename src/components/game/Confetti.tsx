import { useEffect, useState } from "react";

const CONFETTI_COLORS = [
  "hsl(30 95% 55%)",
  "hsl(330 70% 55%)",
  "hsl(270 60% 50%)",
  "hsl(50 90% 50%)",
  "hsl(145 70% 40%)",
  "hsl(210 80% 50%)",
];

export function Confetti({ count = 30 }: { count?: number }) {
  const [pieces, setPieces] = useState<{ id: number; left: number; delay: number; color: string; size: number }[]>([]);

  useEffect(() => {
    setPieces(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        size: 6 + Math.random() * 8,
      }))
    );
  }, [count]);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute animate-confetti-fall"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          }}
        />
      ))}
    </div>
  );
}
