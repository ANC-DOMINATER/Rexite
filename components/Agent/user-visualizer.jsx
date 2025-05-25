"use client";
import { useEffect, useState, useRef } from "react"
import Image from "next/image"

export default function UserVisualizer({
  isActive,
  audioLevels,
  userImage
}) {
  const [smoothLevels, setSmoothLevels] = useState(Array(32).fill(0))
  const [pulseIntensity, setPulseIntensity] = useState(0)
  const [wavePhase, setWavePhase] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)
  const animationRef = useRef()
  const defaultImage = "/ai-avater.png" // Using the existing image in public folder

  useEffect(() => {
    const animate = () => {
      setWavePhase((prev) => prev + 0.05)

      // Smooth interpolation of audio levels
      setSmoothLevels((prev) =>
        prev.map((level, index) => {
          const target = audioLevels[index] || 0
          const smoothing = 0.2
          return level + (target - level) * smoothing
        }))

      // Smooth pulse intensity
      setPulseIntensity((prev) => {
        const target = isActive ? Math.sin(Date.now() / 300) * 0.3 + 0.7 : 0
        return prev + (target - prev) * 0.1
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
  const innerRadius = size * 0.32 // Proportional to total size
  const maxRadius = size * 0.46 // Proportional to total size

  // Use a stable image source that doesn't change between server and client renders
  const imageSrc = userImage || defaultImage

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}>
      {/* Outer glow effect */}
      <div
        className={`absolute inset-0 rounded-full transition-all duration-1000 ${isActive ? "shadow-2xl shadow-white/20" : ""
          }`}
        style={{
          background: isActive
            ? `radial-gradient(circle, rgba(255,255,255,${pulseIntensity * 0.15}) 0%, transparent 70%)`
            : "transparent",
        }} />
      {/* Smooth wave visualization */}
      <svg width={size} height={size} className="absolute">
        {smoothLevels.map((level, index) => {
          const angle = ((index * 360) / smoothLevels.length) * (Math.PI / 180)

          // Create multiple wave layers with different frequencies
          const wave1 = Math.sin(wavePhase + index * 0.2) * (size * 0.05)
          const wave2 = Math.sin(wavePhase * 1.5 + index * 0.15) * (size * 0.035)
          const wave3 = Math.sin(wavePhase * 0.8 + index * 0.25) * (size * 0.028)

          const dynamicRadius = innerRadius + level * 0.4 + wave1 + wave2 + wave3

          // Create smooth gradient from inner to outer
          const layers = [
            { radius: dynamicRadius, opacity: 0.9, width: size * 0.01, blur: 0 },
            { radius: dynamicRadius * 0.85, opacity: 0.7, width: size * 0.007, blur: 1 },
            { radius: dynamicRadius * 0.7, opacity: 0.5, width: size * 0.005, blur: 2 },
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
                className="transition-all duration-150"
                opacity={isActive ? layer.opacity : 0.15}
                style={{
                  filter: isActive
                    ? `drop-shadow(0 0 ${4 + layer.blur}px rgba(255,255,255,${layer.opacity * 0.6})) blur(${layer.blur * 0.5}px)`
                    : "none",
                }} />
            );
          });
        })}
      </svg>
      {/* User image container with smooth scaling */}
      <div
        className={`relative rounded-full overflow-hidden border-4 transition-all duration-500 ${isActive ? "border-white shadow-xl shadow-white/40" : "border-gray-600"
          }`}
        style={{
          transform: `scale(${1 + pulseIntensity * 0.08})`,
          width: size * 0.5, // Proportional to container
          height: size * 0.5
        }}>
        {/* Fix hydration issues by using an img tag with stable defaults */}
        <img
          src={imageSrc}
          alt="User"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{
            filter: isActive ? `brightness(${1 + pulseIntensity * 0.2})` : "brightness(0.8)",
          }} />

        {/* Dynamic overlay effect */}
        {isActive && (
          <div
            className="absolute inset-0 rounded-full transition-all duration-300"
            style={{
              background: `radial-gradient(circle, transparent 40%, rgba(255,255,255,${pulseIntensity * 0.1}) 100%)`,
            }} />
        )}
      </div>
      {/* Smooth breathing rings */}
      {[0, 1, 2].map((ring) => {
        const ringSize = size - ring * (size * 0.07) // Proportional spacing
        return (
          <div
            key={ring}
            className={`absolute rounded-full border transition-all duration-1000 ${isActive ? "border-white/25" : "border-gray-700/30"
              }`}
            style={{
              width: ringSize,
              height: ringSize,
              top: (size - ringSize) / 2,
              left: (size - ringSize) / 2,
              opacity: isActive ? (1 - ring * 0.25) * pulseIntensity : 0.2,
              transform: `scale(${1 + Math.sin(wavePhase + ring) * 0.02})`,
            }} />
        )
      })}
    </div>
  );
}
