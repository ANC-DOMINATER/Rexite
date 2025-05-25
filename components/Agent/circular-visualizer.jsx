"use client";
import { useEffect, useState } from "react"

export default function CircularVisualizer({
  isActive,
  size = 60,
  color = "white"
}) {
  const [bars, setBars] = useState(Array(12).fill(0))

  useEffect(() => {
    if (!isActive) {
      setBars(Array(12).fill(0))
      return
    }

    const interval = setInterval(() => {
      setBars((prev) => prev.map(() => Math.random() * 100))
    }, 100)

    return () => clearInterval(interval);
  }, [isActive])

  const radius = size / 2 - 10
  const centerX = size / 2
  const centerY = size / 2

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute">
        {bars.map((height, index) => {
          const angle = index * 30 * (Math.PI / 180) // 30 degrees apart
          const x1 = centerX + Math.cos(angle) * (radius - 8)
          const y1 = centerY + Math.sin(angle) * (radius - 8)
          const x2 = centerX + Math.cos(angle) * (radius - 8 + height * 0.15)
          const y2 = centerY + Math.sin(angle) * (radius - 8 + height * 0.15)

          return (
            <line
              key={index}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              className="transition-all duration-100"
              opacity={isActive ? 0.8 : 0.3} />
          );
        })}
      </svg>
      {/* Center dot */}
      <div
        className={`w-2 h-2 rounded-full transition-all duration-300 ${isActive ? "bg-white" : "bg-gray-500"}`} />
    </div>
  );
}
