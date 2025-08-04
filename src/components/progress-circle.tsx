/**
 * v0 by Vercel.
 * @see https://v0.dev/t/rY87tkX1BSR
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
  percentage: number;
  size?: number;
  startColor?: string;
  endColor?: string;
};

export default function ProgressCircle({
  children,
  percentage,
  size = 64,
  startColor = "var(--custom-accent)",
  endColor = startColor,
}: Props) {
  if (percentage < 0) percentage = 0;
  if (percentage > 1) percentage = 1;

  return (
    <div className="flex justify-center items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="top-0 left-0 absolute w-full h-full -rotate-90 transform"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke="#e5e7eb"
            strokeWidth="6"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke="url(#progress-gradient)"
            strokeWidth="6"
            strokeDasharray="251.2"
            strokeDashoffset={251.2 * (1 - percentage)}
          />
          <defs>
            <linearGradient
              id="progress-gradient"
              x1="0%"
              y1="100%"
              x2="25%"
              y2="0%"
            >
              <stop offset="0%" stopColor={startColor} />
              <stop offset="100%" stopColor={endColor} />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 place-items-center grid">
          {children && children}
        </div>
      </div>
    </div>
  );
}
