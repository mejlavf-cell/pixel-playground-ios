import { useState } from "react";
import { Question } from "@/data/questions";

interface AnswerWheelProps {
  question: Question;
  onAnswer: (index: number) => boolean;
  disabled: boolean;
  correctCount: number;
}

/** Split text into lines that fit within maxChars per line */
function wrapText(text: string, maxChars: number): string[] {
  if (text.length <= maxChars) return [text];
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if (current && (current + " " + word).length > maxChars) {
      lines.push(current);
      current = word;
    } else {
      current = current ? current + " " + word : word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export function AnswerWheel({ question, onAnswer, disabled, correctCount }: AnswerWheelProps) {
  const [selected, setSelected] = useState<Record<number, "correct" | "wrong">>({});
  const totalAnswers = question.answers.length;
  const size = 340;
  const radius = size / 2 - 10;
  const centerX = size / 2;
  const centerY = size / 2;

  const handleClick = (index: number) => {
    if (disabled || selected[index]) return;
    const isCorrect = onAnswer(index);
    setSelected((prev) => ({
      ...prev,
      [index]: isCorrect ? "correct" : "wrong",
    }));
  };

  return (
    <div className="relative mx-auto w-full" style={{ maxWidth: size }}>
      <svg width="100%" viewBox={`0 0 ${size} ${size}`}>
        {question.answers.map((answer, i) => {
          const angleStep = (2 * Math.PI) / totalAnswers;
          const startAngle = i * angleStep - Math.PI / 2;
          const endAngle = startAngle + angleStep;
          
          const x1 = centerX + radius * Math.cos(startAngle);
          const y1 = centerY + radius * Math.sin(startAngle);
          const x2 = centerX + radius * Math.cos(endAngle);
          const y2 = centerY + radius * Math.sin(endAngle);

          const largeArc = angleStep > Math.PI ? 1 : 0;
          const path = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

          const midAngle = startAngle + angleStep / 2;
          const textR = radius * 0.65;
          const tx = centerX + textR * Math.cos(midAngle);
          const ty = centerY + textR * Math.sin(midAngle);

          let fill = "hsl(270 40% 25%)";
          let stroke = "hsl(270 30% 35%)";
          if (selected[i] === "correct") {
            fill = "hsl(145 70% 35%)";
            stroke = "hsl(145 70% 45%)";
          } else if (selected[i] === "wrong") {
            fill = "hsl(0 80% 45%)";
            stroke = "hsl(0 80% 55%)";
          }

          // Wrap long text
          const maxChars = answer.text.length > 16 ? 10 : 14;
          const lines = wrapText(answer.text, maxChars);
          const fontSize = lines.length > 1 ? 7 : answer.text.length > 12 ? 8 : answer.text.length > 8 ? 9 : 10;
          const lineHeight = fontSize + 2;
          const textStartY = ty - ((lines.length - 1) * lineHeight) / 2;

          // Rotate text to align with slice
          const rotDeg = (midAngle * 180) / Math.PI;
          const flipText = rotDeg > 90 && rotDeg < 270;
          const textRotation = flipText ? rotDeg + 180 : rotDeg;

          return (
            <g
              key={i}
              onClick={() => handleClick(i)}
              className={!disabled && !selected[i] ? "cursor-pointer" : ""}
              style={{ transition: "opacity 0.2s" }}
            >
              <path
                d={path}
                fill={fill}
                stroke={stroke}
                strokeWidth="2"
                opacity={disabled && !selected[i] ? 0.5 : 1}
              />
              {lines.map((line, li) => (
                <text
                  key={li}
                  x={tx}
                  y={textStartY + li * lineHeight}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="white"
                  fontSize={fontSize}
                  fontFamily="Nunito, sans-serif"
                  fontWeight="600"
                >
                  {line}
                </text>
              ))}
            </g>
          );
        })}
        {/* center circle with crown logo */}
        <circle cx={centerX} cy={centerY} r="32" fill="hsl(270 50% 15%)" stroke="hsl(30 95% 55%)" strokeWidth="3" />
        {/* Crown */}
        <g transform={`translate(${centerX - 16}, ${centerY - 18})`}>
          <svg viewBox="0 0 100 80" width="32" height="24" fill="none">
            <path d="M10 65 L5 25 L25 40 L50 10 L75 40 L95 25 L90 65 Z" fill="hsl(38 95% 58%)" />
            <path d="M10 65 L5 25 L25 40 L50 10 L75 40 L95 25 L90 65 Z" fill="url(#cwg)" />
            <circle cx="5" cy="25" r="5" fill="hsl(38 95% 58%)" />
            <circle cx="50" cy="10" r="6" fill="hsl(40 95% 62%)" />
            <circle cx="95" cy="25" r="5" fill="hsl(38 95% 58%)" />
            <defs><linearGradient id="cwg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(45 95% 65%)" /><stop offset="100%" stopColor="hsl(30 95% 50%)" /></linearGradient></defs>
          </svg>
        </g>
        <text x={centerX} y={centerY + 8} textAnchor="middle" dominantBaseline="central" fill="hsl(0 0% 100%)" fontSize="7" fontFamily="Fredoka, sans-serif" fontWeight="900" letterSpacing="0.5">
          PARTY
        </text>
        <text x={centerX} y={centerY + 19} textAnchor="middle" dominantBaseline="central" fill="hsl(0 0% 100%)" fontSize="8" fontFamily="Fredoka, sans-serif" fontWeight="900" letterSpacing="0.5">
          KING
        </text>
      </svg>
    </div>
  );
}
