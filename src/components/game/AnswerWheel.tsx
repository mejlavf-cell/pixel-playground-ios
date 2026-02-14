import { useState } from "react";
import { Question } from "@/data/questions";
import logoImage from "@/assets/logo-party-king.png";

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
  const size = 440;
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
          const fontSize = lines.length > 1 ? 8 : answer.text.length > 12 ? 9 : answer.text.length > 8 ? 10 : 11;
          const lineHeight = fontSize + 2;
          const textStartY = ty - ((lines.length - 1) * lineHeight) / 2;

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
        {/* center circle with logo image */}
        <defs>
          <clipPath id="centerClip">
            <circle cx={centerX} cy={centerY} r="42" />
          </clipPath>
        </defs>
        <circle cx={centerX} cy={centerY} r="44" fill="hsl(270 50% 15%)" stroke="hsl(30 95% 55%)" strokeWidth="3" />
        <image
          href={logoImage}
          x={centerX - 40}
          y={centerY - 40}
          width="80"
          height="80"
          clipPath="url(#centerClip)"
          preserveAspectRatio="xMidYMid slice"
        />
      </svg>
    </div>
  );
}
