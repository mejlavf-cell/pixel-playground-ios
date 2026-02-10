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
  const radius = 140;
  const centerX = 160;
  const centerY = 160;

  const handleClick = (index: number) => {
    if (disabled || selected[index]) return;
    const isCorrect = onAnswer(index);
    setSelected((prev) => ({
      ...prev,
      [index]: isCorrect ? "correct" : "wrong",
    }));
  };

  return (
    <div className="relative mx-auto" style={{ width: 320, height: 320 }}>
      <svg width="320" height="320" viewBox="0 0 320 320">
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
        {/* center circle */}
        <circle cx={centerX} cy={centerY} r="28" fill="hsl(270 50% 15%)" stroke="hsl(30 95% 55%)" strokeWidth="3" />
        <text x={centerX} y={centerY} textAnchor="middle" dominantBaseline="central" fill="hsl(30 95% 55%)" fontSize="16" fontFamily="Fredoka, sans-serif" fontWeight="700">
          {correctCount}/5
        </text>
      </svg>
    </div>
  );
}
