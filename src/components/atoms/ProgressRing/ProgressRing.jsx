import React from "react";
import { cn } from "@/lib/utils";

/**
 * SVG circular progress ring.
 * Props:
 *   value       — 0–100 (current percentage)
 *   size        — diameter in px (default 120)
 *   strokeWidth — ring thickness in px (default 10)
 *   className   — extra classes on the <svg> wrapper
 *   label       — optional text rendered below the percentage (e.g. "Overall")
 */
export function ProgressRing({
  value = 0,
  size = 120,
  strokeWidth = 10,
  className,
  label,
}) {
  const clampedValue = Math.min(Math.max(Number(value) || 0, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedValue / 100) * circumference;

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-label={`Progress: ${clampedValue}%`}
        role="img"
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200"
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-primary transition-all duration-700 ease-out"
          style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
        />
        {/* Percentage text */}
        <text
          x="50%"
          y="50%"
          dominantBaseline="central"
          textAnchor="middle"
          className="fill-current text-foreground"
          style={{ fontSize: size * 0.2, fontWeight: 700, fontFamily: "inherit" }}
        >
          {clampedValue}%
        </text>
      </svg>
      {label && (
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      )}
    </div>
  );
}
