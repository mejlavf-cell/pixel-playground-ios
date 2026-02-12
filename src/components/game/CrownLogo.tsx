interface CrownLogoProps {
  size?: "large" | "small";
}

/** Filled crown SVG matching the Party King visual design */
function CrownSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 80" className={className} fill="none">
      <path
        d="M10 65 L5 25 L25 40 L50 10 L75 40 L95 25 L90 65 Z"
        fill="hsl(38 95% 58%)"
      />
      <path
        d="M10 65 L5 25 L25 40 L50 10 L75 40 L95 25 L90 65 Z"
        fill="url(#crownGrad)"
      />
      {/* balls on tips */}
      <circle cx="5" cy="25" r="5" fill="hsl(38 95% 58%)" />
      <circle cx="50" cy="10" r="6" fill="hsl(40 95% 62%)" />
      <circle cx="95" cy="25" r="5" fill="hsl(38 95% 58%)" />
      <circle cx="25" cy="40" r="4" fill="hsl(38 95% 55%)" />
      <circle cx="75" cy="40" r="4" fill="hsl(38 95% 55%)" />
      <defs>
        <linearGradient id="crownGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(45 95% 65%)" />
          <stop offset="100%" stopColor="hsl(30 95% 50%)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function CrownLogo({ size = "large" }: CrownLogoProps) {
  if (size === "small") {
    return (
      <div className="flex flex-col items-center">
        <CrownSvg className="w-8 h-6" />
        <span className="font-display text-[9px] leading-none text-foreground" style={{ fontWeight: 900, textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
          PARTY
        </span>
        <span className="font-display text-[10px] leading-none text-foreground" style={{ fontWeight: 900, textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
          KING
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <CrownSvg className="w-20 h-16 mb-1" />
      <h1
        className="font-display text-[3.5rem] leading-[0.9] text-foreground text-center"
        style={{
          fontWeight: 900,
          letterSpacing: '-0.01em',
          textShadow: '0 3px 8px rgba(0,0,0,0.25)',
        }}
      >
        PARTY
        <br />
        <span className="text-foreground">KING</span>
      </h1>
      {/* BY YOE - right-aligned to width of "NG" */}
      <div className="w-full flex justify-end" style={{ maxWidth: '220px' }}>
        <span
          className="text-[0.7rem] leading-none tracking-wide"
          style={{
            fontWeight: 900,
            color: 'hsl(0 0% 0%)',
            fontFamily: 'Fredoka, sans-serif',
          }}
        >
          BY <span style={{ fontWeight: 900 }}>YOE</span>
        </span>
      </div>
    </div>
  );
}
