"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { FlipWords } from "@/components/ui/flip-words";
import Link from "next/link";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { useMobileOptimization, useResponsiveCanvas, useFrameThrottle } from "@/hooks/use-mobile-optimization";

export default function SpaceHeroSection() {
  const canvasRef = useRef(null)
  const buttonRef = useRef(null)
  const [distantStars, setDistantStars] = useState([])
  const { optimization } = useResponsiveCanvas(canvasRef)
  const { shouldSkipFrame } = useFrameThrottle(optimization.frameRate)
  const lastFrameTime = useRef(0)

  // Generate distant stars only on client-side to avoid hydration errors - optimized count
  useEffect(() => {
    const starCount = optimization.isMobile ? 4 : optimization.isLowPerformance ? 2 : 8
    const starData = Array(starCount).fill().map((_, i) => ({
      key: i,
      width: Math.random() * 1.5 + 0.5, // Random width between 0.5-2px
      height: Math.random() * 1.5 + 0.5, // Random height between 0.5-2px
      top: Math.random() * 100, // Random top position
      left: Math.random() * 100, // Random left position
      duration: 1 + Math.random() * 2, // Random animation duration
      delay: Math.random() * 2 // Random delay
    }))
    setDistantStars(starData)
  }, [optimization.isMobile, optimization.isLowPerformance])
  // Handle star field animation - optimized for mobile
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions - handled by useResponsiveCanvas hook

    // Create stars with mobile optimization
    const stars = []
    const createStars = () => {
      stars.length = 0
      // Reduce star density for mobile performance
      const baseDensity = optimization.isMobile ? 2000 : optimization.isLowPerformance ? 1500 : 1000
      const starCount = Math.floor((canvas.width * canvas.height) / baseDensity)

      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5,
          speed: Math.random() * 0.5 + 0.1,
        })
      }
    }

    createStars()
    window.addEventListener("resize", createStars)

    // Animate stars with frame throttling
    let animationFrameId

    const animate = (timestamp) => {
      // Use mobile-optimized frame throttling
      if (shouldSkipFrame(lastFrameTime.current, timestamp)) {
        animationFrameId = requestAnimationFrame(animate)
        return
      }
      lastFrameTime.current = timestamp

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw stars
      stars.forEach((star) => {
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
        ctx.fill()

        // Move stars
        star.y += star.speed

        if (star.y > canvas.height) {
          star.y = 0
          star.x = Math.random() * canvas.width
        }
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", createStars)
      cancelAnimationFrame(animationFrameId)
    }
  }, [optimization.isMobile, optimization.isLowPerformance, shouldSkipFrame])

  return (
    <section className="w-full h-screen relative">
      <div
        className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black w-full h-full"
      >
        {/* Star field background */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />        {/* Enhanced Planets with optimized animation */}
        <motion.div
          className="absolute w-50 h-50 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 opacity-80"
          style={{
            top: "20%",
            left: "15%",
            boxShadow: "0 0 40px rgba(255, 255, 255, 0.1) inset",
          }}
          animate={optimization.enableComplexAnimations ? {
            scale: [1, 1.05, 1],
            x: [-5, 5, -5],
            y: [-3, 3, -3],
          } : {
            scale: [1, 1.02, 1], // Reduced animation for mobile
          }}
          transition={{
            duration: optimization.enableComplexAnimations ? 8 : 4,
            ease: "easeInOut",
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          {/* Planet rings with optimized animation */}
          {optimization.enableComplexAnimations && (
            <motion.div
              className="absolute top-1/2 left-1/2 w-70 h-16 border border-gray-600 rounded-full opacity-60"
              style={{
                transform: "translate(-50%, -50%) rotateX(75deg)",
                borderWidth: "1px",
              }}
              animate={{
                rotate: 360,
                scale: [1, 1.03, 1],
              }}
              transition={{
                rotate: { duration: 20, ease: "linear", repeat: Number.POSITIVE_INFINITY },
                scale: { duration: 5, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY },
              }}
            />
          )}

          {/* Planet surface details - simplified for mobile */}
          <motion.div
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{
              background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 20%)",
            }}
            animate={optimization.enableComplexAnimations ? {
              rotate: [0, 15, 0],
            } : {}}
            transition={{
              duration: optimization.enableComplexAnimations ? 10 : 0,
              ease: "easeInOut",
              repeat: optimization.enableComplexAnimations ? Number.POSITIVE_INFINITY : 0
            }}
          />
        </motion.div>

        {/* Second planet with optimized animation */}
        <motion.div
          className="absolute w-30 h-30 rounded-full bg-gradient-to-br from-gray-500 to-gray-800"
          style={{
            top: "60%",
            right: "20%",
            boxShadow: "0 0 20px rgba(255, 255, 255, 0.1) inset",
          }}
          animate={optimization.enableComplexAnimations ? {
            scale: [1, 1.03, 1],
            y: [-3, 3, -3],
          } : {
            scale: [1, 1.01, 1], // Reduced animation for mobile
          }}
          transition={{
            duration: optimization.enableComplexAnimations ? 6 : 3,
            ease: "easeInOut",
            repeat: Number.POSITIVE_INFINITY,
          }}
        >          {/* Planet surface details - conditional rendering */}
          {optimization.enableComplexAnimations && (
            <motion.div
              className="absolute inset-0 rounded-full overflow-hidden"
              style={{
                background: "radial-gradient(circle at 70% 30%, rgba(255,255,255,0.15) 0%, transparent 30%)",
              }}
              animate={{
                rotate: 360,
              }}
              transition={{ duration: 15, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
            />
          )}
        </motion.div>        {/* New small moon - conditional rendering for performance */}
        {optimization.enableComplexAnimations && (
          <motion.div
            className="absolute w-18 h-18 rounded-full bg-gradient-to-br from-gray-400 to-gray-600"
            style={{
              top: "30%",
              right: "35%",
              boxShadow: "0 0 10px rgba(255, 255, 255, 0.05) inset",
            }}
            animate={{
              scale: [1, 1.05, 1],
              x: [-5, 5, -5],
              y: [3, -3, 3],
            }}
            transition={{
              duration: 12,
              ease: "easeInOut",
              repeat: Number.POSITIVE_INFINITY,
            }}
          />
        )}

        {/* Distant stars cluster - optimized for mobile */}
        <motion.div
          className="absolute w-40 h-20"
          style={{
            top: "15%",
            right: "10%",
          }}
        >
          {distantStars.map((star) => (
            <motion.div
              key={star.key} className="absolute rounded-full bg-white"
              style={{
                width: `${star.width}px`,
                height: `${star.height}px`,
                top: `${star.top}%`,
                left: `${star.left}%`,
              }}
              animate={optimization.enableComplexAnimations ? {
                opacity: [0.4, 0.8, 0.4],
                scale: [1, 1.2, 1],
              } : {
                opacity: [0.4, 0.6, 0.4], // Reduced animation for mobile
              }}
              transition={{
                duration: optimization.enableComplexAnimations ? star.duration : star.duration * 0.5,
                repeat: Number.POSITIVE_INFINITY,
                delay: star.delay,
              }}
            />
          ))}
        </motion.div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-6">
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Beyond the Event Horizon
          </motion.h1>

          <motion.p
            className="text-lg md:text-2xl text-gray-300 max-w-2xl mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Rexite: Your AI-powered interview coach.{" "}
            <FlipWords
              words={["Prepare smarter.", "Succeed faster."]}
              className="text-cyan-400 font-semibold mt-3"
            />
          </motion.p>

          <Link href="/onboarding">
            <InteractiveHoverButton
              ref={buttonRef}
              className="px-8 py-5 text-lg"
            >
              Explore 🦖
            </InteractiveHoverButton>
          </Link>
        </div>
      </div>
    </section>
  )
}
