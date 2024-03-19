import React from "react";

const CircularProgress = ({ strokeWidth, progress, r, cx, cy, size }) => {
  const circumference = 2 * 3.14 * r;
  const offset = circumference * ((100 - progress) / 100);
  return (
    <div className="relative inline-block scale-150">
      <div className="absolute flex flex-col justify-center w-full h-full text-center">
        <div className="text-4xl font-semibold text-primary">{progress}</div>
      </div>
      <div className="-rotate-90">
        <svg width={size} height={size}>
          <circle
            r={r}
            cy={cy}
            cx={cx}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
            stroke="#aaa"
            strokeDasharray="27 10 27 10 27 10 27 10 27 10 27 10 27 10 27 10 27 10 27 1000"
          ></circle>
          <circle
            r={r}
            cy={cy}
            cx={cx}
            strokeWidth={strokeWidth}
            fill="transparent"
            stroke-dasharray={circumference + "px"}
            stroke-dashoffset={offset + "px"}
            strokeLinecap="round"
            stroke="#19e27a"
          ></circle>
        </svg>
      </div>
    </div>
  );
};

export default CircularProgress;
