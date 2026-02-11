import { useState } from "react";
import { Question } from "@/data/questions";

interface AnswerWheelProps {
  question: Question;
  onAnswer: (index: number) => boolean;
  disabled: boolean;
  correctCount: number;
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
              <text
                x={tx}
                y={ty}
                textAnchor="middle"
                dominantBaseline="central"
                fill="white"
                fontSize={answer.text.length > 12 ? "8" : answer.text.length > 8 ? "9" : "10"}
                fontFamily="Nunito, sans-serif"
                fontWeight="600"
              >
                {answer.text}
              </text>
            </g>
          );
        })}
        {/* center circle with Party King logo */}
        <circle cx={centerX} cy={centerY} r="32" fill="hsl(270 50% 15%)" stroke="hsl(30 95% 55%)" strokeWidth="3" />
        <text x={centerX} y={centerY - 10} textAnchor="middle" dominantBaseline="central" fill="hsl(30 95% 55%)" fontSize="12" fontFamily="Fredoka, sans-serif" fontWeight="700">
          👑
        </text>
        <text x={centerX} y={centerY + 3} textAnchor="middle" dominantBaseline="central" fill="hsl(0 0% 100%)" fontSize="7" fontFamily="Fredoka, sans-serif" fontWeight="700" letterSpacing="0.5">
          PARTY
        </text>
        <text x={centerX} y={centerY + 14} textAnchor="middle" dominantBaseline="central" fill="hsl(30 95% 55%)" fontSize="8" fontFamily="Fredoka, sans-serif" fontWeight="800" letterSpacing="0.5">
          KING
        </text>
      </svg>
    </div>
  );
}
