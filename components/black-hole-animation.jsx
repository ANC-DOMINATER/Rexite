"use client"

import { useEffect, useRef } from "react"

export default function BlackHoleAnimation() {
  const canvasRef = useRef(null)
  const animationRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas to full width/height and handle high DPI screens
    const handleResize = () => {
      const { innerWidth, innerHeight, devicePixelRatio } = window
      const height = Math.min(innerHeight, 800) // Cap the height for very tall screens

      canvas.width = innerWidth * devicePixelRatio
      canvas.height = height * devicePixelRatio
      canvas.style.width = `${innerWidth}px`
      canvas.style.height = `${height}px`

      ctx.scale(devicePixelRatio, devicePixelRatio)
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    // Create particles for the swirling effect
    const particles = []
    const blackHoleRadius = Math.min(canvas.width, canvas.height) * 0.05
    const blackHoleX = canvas.width / (2 * window.devicePixelRatio)
    const blackHoleY = canvas.height / (2 * window.devicePixelRatio)

    // Initialize particles
    for (let i = 0; i < 1000; i++) {
      const distance = (Math.random() * canvas.width) / (2 * window.devicePixelRatio)
      const angle = Math.random() * Math.PI * 2

      particles.push({
        x: blackHoleX + Math.cos(angle) * distance,
        y: blackHoleY + Math.sin(angle) * distance,
        size: Math.random() * 2 + 0.5,
        speedX: 0,
        speedY: 0,
        angle,
        distance,
        alpha: Math.random() * 0.5 + 0.5,
        originalDistance: distance,
      })
    }

    // Animation function
    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio)

      // Draw black hole
      ctx.beginPath()
      ctx.arc(blackHoleX, blackHoleY, blackHoleRadius, 0, Math.PI * 2)
      ctx.fillStyle = "black"
      ctx.fill()

      // Draw accretion disk (ring around black hole)
      ctx.beginPath()
      ctx.arc(blackHoleX, blackHoleY, blackHoleRadius * 1.2, 0, Math.PI * 2)
      const gradient = ctx.createRadialGradient(
        blackHoleX,
        blackHoleY,
        blackHoleRadius,
        blackHoleX,
        blackHoleY,
        blackHoleRadius * 1.5,
      )
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)")
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)")
      ctx.strokeStyle = gradient
      ctx.lineWidth = 2
      ctx.stroke()

      // Update and draw particles
      particles.forEach((particle) => {
        // Calculate distance to black hole
        const dx = blackHoleX - particle.x
        const dy = blackHoleY - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Gravitational force
        const force = (blackHoleRadius * 10) / (distance * distance)
        const angle = Math.atan2(dy, dx)

        // Apply gravitational force
        particle.speedX += Math.cos(angle) * force
        particle.speedY += Math.sin(angle) * force

        // Apply angular momentum (swirl effect)
        const perpAngle = angle + Math.PI / 2
        const swirlForce = 0.2 * (1 - Math.min(1, distance / (blackHoleRadius * 10)))
        particle.speedX += Math.cos(perpAngle) * swirlForce
        particle.speedY += Math.sin(perpAngle) * swirlForce

        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Dampen speed slightly for stability
        particle.speedX *= 0.99
        particle.speedY *= 0.99

        // Reset particle if it gets too close to the black hole or goes off screen
        if (
          distance < blackHoleRadius ||
          particle.x < 0 ||
          particle.x > canvas.width / window.devicePixelRatio ||
          particle.y < 0 ||
          particle.y > canvas.height / window.devicePixelRatio
        ) {
          const newDistance =
            (Math.random() * canvas.width) / (3 * window.devicePixelRatio) +
            canvas.width / (6 * window.devicePixelRatio)
          const newAngle = Math.random() * Math.PI * 2

          particle.x = blackHoleX + Math.cos(newAngle) * newDistance
          particle.y = blackHoleY + Math.sin(newAngle) * newDistance
          particle.speedX = 0
          particle.speedY = 0
          particle.originalDistance = newDistance
        }

        // Draw particle with trail effect
        ctx.beginPath()
        ctx.moveTo(particle.x, particle.y)
        ctx.lineTo(particle.x - particle.speedX * 5, particle.y - particle.speedY * 5)

        // Adjust opacity based on speed and distance
        const speed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY)
        const opacity = Math.min(1, speed * 2) * particle.alpha

        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
        ctx.lineWidth = particle.size
        ctx.stroke()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return (
    <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full -z-10" style={{ background: "black" }} />
  )
}
