"use client";
import { useEffect, useState, useRef } from "react"
import { MessageCircle, Origami } from "lucide-react"

export default function AIVisualizer({
  isActive,
  audioLevels,
  vapiStatus
}) {
  const [smoothLevels, setSmoothLevels] = useState(Array(32).fill(0))
  const [rotationAngle, setRotationAngle] = useState(0)
  const [pulseScale, setPulseScale] = useState(1)
  const [wavePhase, setWavePhase] = useState(0)
  const [breathingPhase, setBreathingPhase] = useState(0)
  const animationRef = useRef()

  useEffect(() => {
    const animate = () => {
      // Smooth rotation
      setRotationAngle((prev) => prev + (isActive ? 1 : 0.2))

      // Wave phase for fluid motion
      setWavePhase((prev) => prev + 0.08)

      // Breathing effect
      setBreathingPhase((prev) => prev + 0.03)

      // Smooth audio level interpolation
      setSmoothLevels((prev) =>
        prev.map((level, index) => {
          const target = audioLevels[index] || 0
          const smoothing = isActive ? 0.25 : 0.1
          return level + (target - level) * smoothing
        }))

      // Smooth pulse scaling
      setPulseScale((prev) => {
        const target = isActive ? 1 + Math.sin(Date.now() / 400) * 0.12 : 1 + Math.sin(breathingPhase) * 0.03
        return prev + (target - prev) * 0.15
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    };
  }, [isActive, audioLevels])

  // Calculate dynamic size based on whether we're on mobile or desktop
  const useResponsiveSize = () => {
    const [size, setSize] = useState(280)

    useEffect(() => {
      const updateSize = () => {
        setSize(window.innerWidth < 640 ? 240 : 280)
      }
      
      updateSize()
      window.addEventListener('resize', updateSize)
      return () => window.removeEventListener('resize', updateSize)
    }, [])

    return size
  }
  
  const size = useResponsiveSize()
  const centerX = size / 2
  const centerY = size / 2
  const innerRadius = size * 0.28 // Proportional to total size
  const maxRadius = size * 0.45 // Proportional to total size

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}>
      {/* Outer glow effect */}
      <div
        className={`absolute inset-0 rounded-full transition-all duration-1000 ${
          isActive ? "shadow-2xl shadow-white/20" : ""
        }`}
        style={{
          background: isActive ? "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)" : "transparent",
        }} />
      {/* Ultra-smooth wave visualization */}
      <svg
        width={size}
        height={size}
        className="absolute transition-all duration-1000"
        style={{ transform: `rotate(${rotationAngle}deg)` }}>
        {smoothLevels.map((amplitude, index) => {
          const angle = ((index * 360) / smoothLevels.length) * (Math.PI / 180)

          // Multiple wave harmonics for natural movement
          const harmonic1 = Math.sin(wavePhase + index * 0.3) * (size * 0.07) // Scale with element size
          const harmonic2 = Math.sin(wavePhase * 1.6 + index * 0.2) * (size * 0.04) // Scale with element size
          const harmonic3 = Math.sin(wavePhase * 0.7 + index * 0.4) * (size * 0.03) // Scale with element size
          const harmonic4 = Math.sin(wavePhase * 2.1 + index * 0.15) * (size * 0.02) // Scale with element size

          const waveRadius = innerRadius + amplitude * 0.5 + harmonic1 + harmonic2 + harmonic3 + harmonic4

          // Create flowing wave layers
          const layers = [
            { radius: waveRadius, opacity: 0.95, width: size * 0.01, blur: 0 }, // Scale line width with size
            { radius: waveRadius * 0.8, opacity: 0.75, width: size * 0.009, blur: 0.5 },
            { radius: waveRadius * 0.6, opacity: 0.55, width: size * 0.007, blur: 1 },
            { radius: waveRadius * 0.4, opacity: 0.35, width: size * 0.005, blur: 1.5 },
          ]

          return layers.map((layer, layerIndex) => {
            const x1 = centerX + Math.cos(angle) * innerRadius
            const y1 = centerY + Math.sin(angle) * innerRadius
            const x2 = centerX + Math.cos(angle) * layer.radius
            const y2 = centerY + Math.sin(angle) * layer.radius

            return (
              <line
                key={`${index}-${layerIndex}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="white"
                strokeWidth={layer.width}
                strokeLinecap="round"
                className="transition-all duration-200"
                opacity={isActive ? layer.opacity : 0.12}
                style={{
                  filter: isActive
                    ? `drop-shadow(0 0 ${3 + layer.blur}px rgba(255,255,255,${layer.opacity * 0.7})) blur(${layer.blur * 0.3}px)`
                    : "none",
                }} />
            );
          });
        })}
      </svg>
      {/* Central AI icon with smooth scaling */}
      <div
        className={`relative rounded-full border-4 transition-all duration-500 flex items-center justify-center ${
          isActive
            ? "border-white shadow-xl shadow-white/40 bg-gray-900"
            : vapiStatus === "connected"
              ? "border-gray-400 bg-gray-800"
              : "border-gray-600 bg-gray-800"
        }`}
        style={{
          transform: `scale(${pulseScale})`,
          width: size * 0.5, // Proportional to container
          height: size * 0.5
        }}>
        <Origami
          className="transition-all duration-500 text-white"
          style={{
            width: size * 0.22,
            height: size * 0.22,
            filter: isActive
              ? "drop-shadow(0 0 12px rgba(255,255,255,0.4))"
              : vapiStatus === "connected"
                ? "drop-shadow(0 0 6px rgba(255,255,255,0.2))"
                : "none",
            opacity: isActive ? 1 : vapiStatus === "connected" ? 0.8 : 0.6,
            transform: `rotate(${Math.sin(wavePhase) * 3}deg)`,
          }} />

        {/* Inner glow effect */}
        {(isActive || vapiStatus === "connected") && (
          <div
            className="absolute inset-0 rounded-full transition-all duration-500"
            style={{
              background: `radial-gradient(circle, rgba(255,255,255,${isActive ? 0.1 : 0.05}) 0%, transparent 70%)`,
            }} />
        )}
      </div>
      {/* Vapi status indicator */}
      {vapiStatus === "connecting" && (
        <div className="absolute -top-4 -right-4">
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        </div>
      )}
      {/* Smooth breathing rings */}
      {[0, 1, 2, 3].map((ring) => {
        const ringSize = size - ring * (size * 0.06) // Proportional spacing
        return (
          <div
            key={ring}
            className={`absolute rounded-full border transition-all duration-1000 ${
              isActive ? "border-white/30" : vapiStatus === "connected" ? "border-white/15" : "border-gray-700/20"
            }`}
            style={{
              width: ringSize,
              height: ringSize,
              top: (size - ringSize) / 2,
              left: (size - ringSize) / 2,
              opacity: isActive ? 1 - ring * 0.2 : vapiStatus === "connected" ? 0.6 - ring * 0.15 : 0.3 - ring * 0.1,
              transform: `scale(${1 + Math.sin(breathingPhase + ring * 0.5) * 0.03})`,
            }} />
        )
      })}
    </div>
  );
}
