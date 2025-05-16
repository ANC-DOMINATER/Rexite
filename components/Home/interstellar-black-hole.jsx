"use client"

import { useEffect, useRef, useState } from "react"

export default function InterstellarBlackHole() {
  const canvasRef = useRef(null)
  const animationRef = useRef(0)
  const [isVisible, setIsVisible] = useState(true)
  const fpsInterval = useRef(1000 / 30) // Target 30 FPS
  const lastFrameTime = useRef(0)
  const lastFlareTime = useRef(0)
  const lastMajorFlareTime = useRef(0) // Track time of last major flare event

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas to full width/height and handle high DPI screens
    const handleResize = () => {
      const { innerWidth, innerHeight, devicePixelRatio } = window

      // Use a lower resolution for high DPI screens to improve performance
      const scaleFactor = devicePixelRatio > 1 ? 1.5 : devicePixelRatio

      canvas.width = innerWidth * scaleFactor
      canvas.height = innerHeight * scaleFactor
      canvas.style.width = `${innerWidth}px`
      canvas.style.height = `${innerHeight}px`

      ctx.scale(scaleFactor, scaleFactor)
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    // Create background stars for gravitational lensing effect
    const backgroundStars = []
    for (let i = 0; i < 300; i++) {
      backgroundStars.push({
        x: (Math.random() * canvas.width) / devicePixelRatio,
        y: (Math.random() * canvas.height) / devicePixelRatio,
        size: Math.random() * 1.2 + 0.3,
        opacity: Math.random() * 0.7 + 0.1,
        pulseSpeed: Math.random() * 0.002 + 0.001,
        pulseOffset: Math.random() * Math.PI * 2,
        originalX: (Math.random() * canvas.width) / devicePixelRatio,
        originalY: (Math.random() * canvas.height) / devicePixelRatio,
      })
    }

    // Create stars for the background with parallax effect
    const stars = []
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: (Math.random() * canvas.width) / devicePixelRatio,
        y: (Math.random() * canvas.height) / devicePixelRatio,
        size: Math.random() * 1.5,
        opacity: Math.random() * 0.8 + 0.2,
        pulseSpeed: Math.random() * 0.002 + 0.001,
        pulseOffset: Math.random() * Math.PI * 2,
        // No parallax effect
      })
    }

    // Create light flares for accretion disk
    const flares = []
    const majorFlares = []

    // Create spacetime distortion grid
    const gridSize = 20
    const cols = Math.ceil(canvas.width / devicePixelRatio / gridSize)
    const rows = Math.ceil(canvas.height / devicePixelRatio / gridSize)
    const distortionGrid = []

    for (let y = 0; y < rows; y++) {
      distortionGrid[y] = []
      for (let x = 0; x < cols; x++) {
        distortionGrid[y][x] = {
          x: x * gridSize,
          y: y * gridSize,
          originalX: x * gridSize,
          originalY: y * gridSize,
          distortionAmount: 0,
        }
      }
    }

    // Create particles for the swirling effect
    const particles = []
    const blackHoleRadius = (Math.min(canvas.width, canvas.height) * 0.06) / devicePixelRatio
    const numParticles = 350
    const numSpirals = 3

    for (let spiral = 0; spiral < numSpirals; spiral++) {
      const spiralOffset = (spiral * Math.PI * 2) / numSpirals
      const particlesPerSpiral = numParticles / numSpirals

      for (let i = 0; i < particlesPerSpiral; i++) {
        const angle = spiralOffset + (i * (Math.PI * 12)) / particlesPerSpiral
        const distance = (((i / particlesPerSpiral) * canvas.width) / devicePixelRatio) * 0.4 + blackHoleRadius * 2

        // Vary the starting positions slightly for more natural look
        const randomOffset = Math.random() * 20 - 10
        const randomAngleOffset = Math.random() * 0.2 - 0.1

        particles.push({
          x: innerWidth / 2 + Math.cos(angle + randomAngleOffset) * (distance + randomOffset),
          y: innerHeight / 2 + Math.sin(angle + randomAngleOffset) * (distance + randomOffset),
          size: Math.random() * 2 + 0.5, // More varied sizes
          speedFactor: Math.random() * 0.5 + 0.5, // More varied speed
          angle: angle + randomAngleOffset,
          distance: distance + randomOffset,
          alpha: Math.random() * 0.6 + 0.4,
          trail: [],
          trailLength: Math.floor(Math.random() * 6) + 3, // Varied trail lengths
          hue: Math.random() > 0.9 ? Math.random() * 60 - 30 : 0, // Occasional subtle color variation
          pulseRate: Math.random() * 0.02 + 0.01,
          pulseOffset: Math.random() * Math.PI * 2,
        })
      }
    }

    // Simplex noise implementation for smooth distortion
    // This is a simplified version of simplex noise
    const noise = (() => {
      const permutation = Array.from({ length: 512 }, () => Math.floor(Math.random() * 256))

      function fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10)
      }

      function lerp(t, a, b) {
        return a + t * (b - a)
      }

      function grad(hash, x, y) {
        const h = hash & 15
        const u = h < 8 ? x : y
        const v = h < 4 ? y : h === 12 || h === 14 ? x : 0
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v)
      }

      return (x, y) => {
        const X = Math.floor(x) & 255
        const Y = Math.floor(y) & 255
        x -= Math.floor(x)
        y -= Math.floor(y)

        const u = fade(x)
        const v = fade(y)

        const A = permutation[X] + Y
        const B = permutation[X + 1] + Y

        return (
          lerp(
            v,
            lerp(u, grad(permutation[A], x, y), grad(permutation[B], x - 1, y)),
            lerp(u, grad(permutation[A + 1], x, y - 1), grad(permutation[B + 1], x - 1, y - 1)),
          ) *
            0.5 +
          0.5
        )
      }
    })()

    let lastTime = 0
    let time = 0

    // Animation function
    const animate = (timestamp) => {
      // Skip animation if not visible (performance optimization)
      if (!isVisible) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      // Throttle to target FPS
      const elapsed = timestamp - lastFrameTime.current
      if (elapsed < fpsInterval.current) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }
      lastFrameTime.current = timestamp - (elapsed % fpsInterval.current)

      // Calculate delta time for smooth animation regardless of frame rate
      const deltaTime = timestamp - lastTime
      lastTime = timestamp
      const timeScale = Math.min(deltaTime / 16.67, 2) // Normalize to 60fps, cap at 2x

      time += deltaTime * 0.001

      // Fixed black hole position at center
      const { innerWidth, innerHeight, devicePixelRatio } = window
      const blackHoleX = innerWidth / 2
      const blackHoleY = innerHeight / 2

      // Clear canvas with fade effect for trails
      ctx.fillStyle = "rgba(0, 0, 0, 0.03)"
      ctx.fillRect(0, 0, canvas.width / devicePixelRatio, canvas.height / devicePixelRatio)

      // Calculate viewport boundaries for culling
      const viewportLeft = 0
      const viewportRight = innerWidth
      const viewportTop = 0
      const viewportBottom = innerHeight
      const cullingMargin = blackHoleRadius * 5

      // Update and draw spacetime distortion - only update visible grid points
      const updateInterval = 3 // Only update 1/3 of the grid each frame
      const startX = Math.floor((time * 100) % updateInterval) // Safe integer for modulo

      for (let y = 0; y < rows; y++) {
        if (!distortionGrid[y]) continue // Skip if row doesn't exist

        for (let x = startX; x < cols; x += updateInterval) {
          if (!distortionGrid[y][x]) continue // Skip if point doesn't exist

          const point = distortionGrid[y][x]

          // Skip points far from the center for performance
          const dx = point.originalX - blackHoleX
          const dy = point.originalY - blackHoleY
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance > blackHoleRadius * 20) continue

          // Calculate distortion based on distance from black hole
          const maxDistortRadius = blackHoleRadius * 15
          const distortionFactor = Math.max(0, 1 - distance / maxDistortRadius)

          // Add some noise-based movement to the distortion - use cached noise when possible
          const noiseValue = noise(point.originalX * 0.005 + time * 0.1, point.originalY * 0.005 + time * 0.1) * 2 - 1

          // Calculate angle to black hole
          const angle = Math.atan2(dy, dx)

          // Apply distortion - points are pulled toward the black hole
          const distortionAmount = distortionFactor * distortionFactor * blackHoleRadius * 2
          point.distortionAmount = distortionAmount

          point.x = point.originalX - Math.cos(angle) * distortionAmount * (1 + noiseValue * 0.2)
          point.y = point.originalY - Math.sin(angle) * distortionAmount * (1 + noiseValue * 0.2)
        }
      }

      // Draw distortion grid (subtle effect) - less frequently
      if (Math.random() > 0.85) {
        // Reduced frequency
        // Only draw occasionally for subtle effect
        ctx.strokeStyle = "rgba(20, 20, 30, 0.03)"
        ctx.lineWidth = 0.5

        // Only draw grid points near the black hole
        const gridDrawRadius = blackHoleRadius * 15

        for (let y = 0; y < rows - 1; y += 2) {
          // Skip every other row
          if (!distortionGrid[y] || !distortionGrid[y + 2]) continue

          for (let x = 0; x < cols - 1; x += 2) {
            // Skip every other column
            if (!distortionGrid[y][x] || !distortionGrid[y][x + 2] || !distortionGrid[y + 2][x]) continue

            const point = distortionGrid[y][x]
            const dx = point.originalX - blackHoleX
            const dy = point.originalY - blackHoleY
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance > gridDrawRadius) continue

            const intensity = point.distortionAmount / (blackHoleRadius * 2)
            if (intensity > 0.05) {
              ctx.strokeStyle = `rgba(20, 20, 30, ${intensity * 0.05})`

              ctx.beginPath()
              ctx.moveTo(distortionGrid[y][x].x, distortionGrid[y][x].y)
              ctx.lineTo(distortionGrid[y][x + 2].x, distortionGrid[y][x + 2].y)
              ctx.stroke()

              ctx.beginPath()
              ctx.moveTo(distortionGrid[y][x].x, distortionGrid[y][x].y)
              ctx.lineTo(distortionGrid[y + 2][x].x, distortionGrid[y + 2][x].y)
              ctx.stroke()
            }
          }
        }
      }

      // Apply gravitational lensing to background stars - with culling
      const visibleStars = backgroundStars.filter((star) => {
        return (
          star &&
          star.originalX > viewportLeft - cullingMargin &&
          star.originalX < viewportRight + cullingMargin &&
          star.originalY > viewportTop - cullingMargin &&
          star.originalY < viewportBottom + cullingMargin
        )
      })

      // Process stars in batches
      const starBatchSize = 50
      for (let i = 0; i < visibleStars.length; i += starBatchSize) {
        const batch = visibleStars.slice(i, i + starBatchSize)

        batch.forEach((star) => {
          if (!star) return // Skip if star is undefined

          // Calculate distance to black hole
          const dx = star.originalX - blackHoleX
          const dy = star.originalY - blackHoleY
          const starDistance = Math.sqrt(dx * dx + dy * dy)

          // Skip detailed calculations for distant stars
          if (starDistance > blackHoleRadius * 20) {
            ctx.beginPath()
            ctx.arc(star.originalX, star.originalY, star.size, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
            ctx.fill()
            return
          }

          // Calculate angle to black hole
          const angle = Math.atan2(dy, dx)

          // Calculate lensing effect (stronger closer to black hole)
          const lensRadius = blackHoleRadius * 10
          const lensingStrength = Math.max(0, 1 - Math.min(1, starDistance / lensRadius))

          // Einstein ring effect - stars very close to the black hole appear as a ring
          let lensedX, lensedY

          if (starDistance < blackHoleRadius * 1.8) {
            // Stars very close to the black hole create an Einstein ring
            const ringRadius = blackHoleRadius * 1.8
            const ringFactor = 1 - starDistance / (blackHoleRadius * 1.8)
            const ringAngle = angle + Math.PI * 2 * ringFactor * 0.1

            lensedX = blackHoleX + Math.cos(ringAngle) * ringRadius
            lensedY = blackHoleY + Math.sin(ringAngle) * ringRadius

            // Create a duplicate star on the opposite side for complete Einstein ring effect
            if (Math.random() > 0.85) {
              // Reduced frequency
              const twinkle = 0.5 + Math.sin(time * star.pulseSpeed * 1000 + star.pulseOffset) * 0.5
              const oppositeAngle = ringAngle + Math.PI
              const duplicateX = blackHoleX + Math.cos(oppositeAngle) * ringRadius
              const duplicateY = blackHoleY + Math.sin(oppositeAngle) * ringRadius

              ctx.beginPath()
              ctx.arc(duplicateX, duplicateY, star.size, 0, Math.PI * 2)
              ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle * 0.7})`
              ctx.fill()
            }
          } else {
            // Normal gravitational lensing for stars further away
            const deflection = (blackHoleRadius * blackHoleRadius * 8) / Math.max(starDistance, blackHoleRadius)
            const deflectionAngle = angle + Math.PI / 2

            // Bend light around the black hole
            lensedX = star.originalX - Math.cos(angle) * lensingStrength * deflection
            lensedY = star.originalY - Math.sin(angle) * lensingStrength * deflection

            // Add tangential component for more realistic lensing
            lensedX += Math.cos(deflectionAngle) * lensingStrength * deflection * 0.3
            lensedY += Math.sin(deflectionAngle) * lensingStrength * deflection * 0.3
          }

          star.x = lensedX
          star.y = lensedY

          // Draw lensed star with subtle twinkling
          const twinkle = 0.5 + Math.sin(time * star.pulseSpeed * 1000 + star.pulseOffset) * 0.5

          // Make stars closer to black hole appear stretched
          if (starDistance < blackHoleRadius * 5 && starDistance > blackHoleRadius * 2) {
            const stretchFactor = Math.max(0, 1 - starDistance / (blackHoleRadius * 5))
            const stretchAngle = Math.atan2(blackHoleY - star.y, blackHoleX - star.x)

            ctx.save()
            ctx.translate(star.x, star.y)
            ctx.rotate(stretchAngle)
            ctx.scale(1 + stretchFactor * 3, 1)

            ctx.beginPath()
            ctx.arc(0, 0, star.size, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle})`
            ctx.fill()

            ctx.restore()
          } else {
            ctx.beginPath()
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle})`
            ctx.fill()
          }
        })
      }

      // Draw stars with subtle twinkling - with culling
      const visibleRegularStars = stars.filter((star) => {
        return (
          star &&
          star.x > viewportLeft - cullingMargin &&
          star.x < viewportRight + cullingMargin &&
          star.y > viewportTop - cullingMargin &&
          star.y < viewportBottom + cullingMargin
        )
      })

      // Process in batches
      for (let i = 0; i < visibleRegularStars.length; i += starBatchSize) {
        const batch = visibleRegularStars.slice(i, i + starBatchSize)

        batch.forEach((star) => {
          if (!star) return // Skip if star is undefined

          // Only calculate twinkle for stars close to the black hole
          const dx = star.x - blackHoleX
          const dy = star.y - blackHoleY
          const distance = Math.sqrt(dx * dx + dy * dy)

          let opacity = star.opacity
          if (distance < blackHoleRadius * 10) {
            const twinkle = 0.5 + Math.sin(time * star.pulseSpeed * 1000 + star.pulseOffset) * 0.5
            opacity *= twinkle
          }

          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
          ctx.fill()
        })
      }

      // Draw black hole glow and aura
      const baseGlow = ctx.createRadialGradient(
        blackHoleX,
        blackHoleY,
        blackHoleRadius * 0.1,
        blackHoleX,
        blackHoleY,
        blackHoleRadius * 3,
      )
      baseGlow.addColorStop(0, "rgba(0, 0, 0, 1)")
      baseGlow.addColorStop(0.4, "rgba(0, 0, 0, 1)")
      baseGlow.addColorStop(0.5, "rgba(30, 30, 40, 0.3)")
      baseGlow.addColorStop(0.7, "rgba(20, 20, 30, 0.1)")
      baseGlow.addColorStop(1, "rgba(0, 0, 0, 0)")

      ctx.beginPath()
      ctx.arc(blackHoleX, blackHoleY, blackHoleRadius * 3, 0, Math.PI * 2)
      ctx.fillStyle = baseGlow
      ctx.fill()

      // Add ethereal aura effect with subtle pulsation
      const auraPulse = 0.7 + 0.3 * Math.sin(time * 0.5)
      const auraSize = blackHoleRadius * (2 + auraPulse * 0.5)

      // Inner aura (blue-ish)
      const innerAura = ctx.createRadialGradient(
        blackHoleX,
        blackHoleY,
        blackHoleRadius * 0.9,
        blackHoleX,
        blackHoleY,
        blackHoleRadius * 1.8,
      )
      innerAura.addColorStop(0, "rgba(100, 170, 255, 0)")
      innerAura.addColorStop(0.5, `rgba(70, 120, 255, ${0.05 * auraPulse})`)
      innerAura.addColorStop(1, "rgba(50, 100, 255, 0)")

      ctx.beginPath()
      ctx.arc(blackHoleX, blackHoleY, blackHoleRadius * 1.8, 0, Math.PI * 2)
      ctx.fillStyle = innerAura
      ctx.fill()

      // Outer aura (purple-ish)
      const outerAura = ctx.createRadialGradient(
        blackHoleX,
        blackHoleY,
        blackHoleRadius * 1.5,
        blackHoleX,
        blackHoleY,
        auraSize,
      )
      outerAura.addColorStop(0, "rgba(130, 80, 255, 0)")
      outerAura.addColorStop(0.5, `rgba(100, 50, 200, ${0.03 * auraPulse})`)
      outerAura.addColorStop(1, "rgba(80, 30, 180, 0)")

      ctx.beginPath()
      ctx.arc(blackHoleX, blackHoleY, auraSize, 0, Math.PI * 2)
      ctx.fillStyle = outerAura
      ctx.fill()

      // Draw black hole
      ctx.beginPath()
      ctx.arc(blackHoleX, blackHoleY, blackHoleRadius, 0, Math.PI * 2)
      ctx.fillStyle = "black"
      ctx.fill()

      // Enhanced accretion disk with subtle color variation
      ctx.beginPath()
      ctx.arc(blackHoleX, blackHoleY, blackHoleRadius * 1.2, 0, Math.PI * 2)
      const diskGradient = ctx.createRadialGradient(
        blackHoleX,
        blackHoleY,
        blackHoleRadius,
        blackHoleX,
        blackHoleY,
        blackHoleRadius * 1.5,
      )
      diskGradient.addColorStop(0, `rgba(255, 255, 255, ${0.4 * auraPulse})`)
      diskGradient.addColorStop(0.3, `rgba(220, 220, 255, ${0.3 * auraPulse})`)
      diskGradient.addColorStop(0.7, `rgba(180, 180, 255, ${0.1 * auraPulse})`)
      diskGradient.addColorStop(1, "rgba(255, 255, 255, 0)")
      ctx.strokeStyle = diskGradient
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Improved flare generation - more consistent and visually appealing
      if (time - lastFlareTime.current > 2.5 && Math.random() > 0.992) {
        lastFlareTime.current = time

        // Create flares at specific points around the accretion disk
        const flareAngle = Math.random() * Math.PI * 2
        const flareDistance = blackHoleRadius * 1.2

        // Determine flare type - mostly amber/orange with occasional blue
        const isBlue = Math.random() > 0.7
        const hue = isBlue ? 210 : Math.floor(Math.random() * 20) + 25 // Range from 25-45 (amber/orange)
        const size = blackHoleRadius * (0.25 + Math.random() * 0.25)

        flares.push({
          x: blackHoleX + Math.cos(flareAngle) * flareDistance,
          y: blackHoleY + Math.sin(flareAngle) * flareDistance,
          size: size,
          opacity: 0.6 + Math.random() * 0.3, // Slightly reduced opacity
          angle: flareAngle,
          life: 0,
          maxLife: 1.5 + Math.random() * 1.5,
          hue: hue,
          // Add subtle movement to flares
          velocity: {
            x: Math.cos(flareAngle) * (0.2 + Math.random() * 0.3),
            y: Math.sin(flareAngle) * (0.2 + Math.random() * 0.3),
          },
          // Add trail for some flares
          hasTrail: Math.random() > 0.5,
          trail: [],
          trailLength: Math.floor(Math.random() * 5) + 3,
        })
      }

      // Update and draw light flares
      for (let i = flares.length - 1; i >= 0; i--) {
        const flare = flares[i]
        if (!flare) continue // Skip if flare is undefined

        flare.life += deltaTime * 0.001

        if (flare.life >= flare.maxLife) {
          flares.splice(i, 1)
          continue
        }

        // Calculate flare opacity based on life - smooth fade in/out
        const progress = flare.life / flare.maxLife
        const flareOpacity = flare.opacity * (1 - Math.pow(progress - 0.5, 2) * 4)

        // Update flare position with subtle movement
        if (flare.hasTrail) {
          // Store position for trail
          if (flare.trail.length > flare.trailLength) {
            flare.trail.pop()
          }
          flare.trail.unshift({ x: flare.x, y: flare.y })
        }

        // Move flare slightly
        flare.x += flare.velocity.x * deltaTime * 0.05
        flare.y += flare.velocity.y * deltaTime * 0.05

        // Slow down movement over time
        flare.velocity.x *= 0.99
        flare.velocity.y *= 0.99

        // Draw flare
        const flareGradient = ctx.createRadialGradient(flare.x, flare.y, 0, flare.x, flare.y, flare.size)

        const color =
          flare.hue === 210
            ? `hsla(${flare.hue}, 100%, 70%, ${flareOpacity})`
            : `hsla(${flare.hue}, 100%, 65%, ${flareOpacity})`

        flareGradient.addColorStop(0, color)
        flareGradient.addColorStop(0.5, `hsla(${flare.hue}, 100%, 70%, ${flareOpacity * 0.5})`)
        flareGradient.addColorStop(1, `hsla(${flare.hue}, 100%, 80%, 0)`)

        ctx.beginPath()
        ctx.arc(flare.x, flare.y, flare.size, 0, Math.PI * 2)
        ctx.fillStyle = flareGradient
        ctx.fill()

        // Draw trail if flare has one
        if (flare.hasTrail && flare.trail.length > 1) {
          ctx.beginPath()
          ctx.moveTo(flare.trail[0].x, flare.trail[0].y)

          for (let j = 1; j < flare.trail.length; j++) {
            if (!flare.trail[j]) continue // Skip if trail point is undefined
            ctx.lineTo(flare.trail[j].x, flare.trail[j].y)
          }

          const trailGradient = ctx.createLinearGradient(
            flare.trail[0].x,
            flare.trail[0].y,
            flare.trail[flare.trail.length - 1]?.x || flare.trail[0].x,
            flare.trail[flare.trail.length - 1]?.y || flare.trail[0].y,
          )

          trailGradient.addColorStop(0, `hsla(${flare.hue}, 100%, 70%, ${flareOpacity * 0.7})`)
          trailGradient.addColorStop(1, `hsla(${flare.hue}, 100%, 80%, 0)`)

          ctx.strokeStyle = trailGradient
          ctx.lineWidth = flare.size * 0.3
          ctx.lineCap = "round"
          ctx.lineJoin = "round"
          ctx.stroke()
        }

        // Draw lens flare lines - more subtle and elegant
        ctx.beginPath()
        ctx.moveTo(
          flare.x - Math.cos(flare.angle) * flare.size * 1.5,
          flare.y - Math.sin(flare.angle) * flare.size * 1.5,
        )
        ctx.lineTo(
          flare.x + Math.cos(flare.angle) * flare.size * 1.5,
          flare.y + Math.sin(flare.angle) * flare.size * 1.5,
        )
        ctx.strokeStyle = `hsla(${flare.hue}, 100%, 80%, ${flareOpacity * 0.6})`
        ctx.lineWidth = flare.size * 0.15
        ctx.stroke()

        // Draw perpendicular lens flare line - more subtle
        const perpAngle = flare.angle + Math.PI / 2
        ctx.beginPath()
        ctx.moveTo(flare.x - Math.cos(perpAngle) * flare.size, flare.y - Math.sin(perpAngle) * flare.size)
        ctx.lineTo(flare.x + Math.cos(perpAngle) * flare.size, flare.y + Math.sin(perpAngle) * flare.size)
        ctx.strokeStyle = `hsla(${flare.hue}, 100%, 80%, ${flareOpacity * 0.4})`
        ctx.lineWidth = flare.size * 0.08
        ctx.stroke()
      }

      // Update and draw particles - with culling and batching
      const particleBatchSize = 50
      const visibleParticles = particles.filter((particle) => {
        return (
          particle &&
          particle.x > viewportLeft - cullingMargin &&
          particle.x < viewportRight + cullingMargin &&
          particle.y > viewportTop - cullingMargin &&
          particle.y < viewportBottom + cullingMargin
        )
      })

      for (let i = 0; i < visibleParticles.length; i += particleBatchSize) {
        const batch = visibleParticles.slice(i, i + particleBatchSize)

        batch.forEach((particle) => {
          if (!particle) return // Skip if particle is undefined

          // Store previous position for trail
          if (particle.trail.length > particle.trailLength) {
            particle.trail.pop()
          }
          particle.trail.unshift({ x: particle.x, y: particle.y })

          // Calculate gravitational effect
          const dx = blackHoleX - particle.x
          const dy = blackHoleY - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          // Slow orbital movement with subtle variations
          const baseSpeed = 0.0008 * timeScale * particle.speedFactor

          // Add subtle speed variations based on position
          const speedVariation = 0.2 * Math.sin(particle.angle * 2 + time * 0.5)

          // Accelerate particles as they get closer to the black hole
          const proximityFactor = Math.max(1, (blackHoleRadius * 3) / Math.max(distance, blackHoleRadius * 1.2))
          const orbitSpeed =
            ((baseSpeed * (blackHoleRadius * 8)) / Math.max(distance, blackHoleRadius)) *
            (1 + speedVariation) *
            (proximityFactor * proximityFactor * 0.2 + 0.8) // Accelerate near event horizon

          // Update angle based on distance (closer = faster)
          particle.angle += orbitSpeed

          // Gradually decrease distance (spiral inward) with subtle variations
          const gravitationalPull = 0.02 * timeScale * (blackHoleRadius / Math.max(distance, blackHoleRadius))

          // Add subtle pulsing to the gravitational pull
          const pulseFactor = 1 + 0.1 * Math.sin(time * particle.pulseRate * 1000 + particle.pulseOffset)
          particle.distance = Math.max(particle.distance - gravitationalPull * pulseFactor, blackHoleRadius * 1.1)

          // Update position based on black hole gravity only
          particle.x = blackHoleX + Math.cos(particle.angle) * particle.distance
          particle.y = blackHoleY + Math.sin(particle.angle) * particle.distance

          // Reset particle if it gets too close to the black hole
          if (distance < blackHoleRadius * 1.1) {
            const newDistance =
              (Math.random() * canvas.width) / (3 * devicePixelRatio) + canvas.width / (6 * devicePixelRatio)
            const newAngle = Math.random() * Math.PI * 2

            particle.x = blackHoleX + Math.cos(newAngle) * newDistance
            particle.y = blackHoleY + Math.sin(newAngle) * newDistance
            particle.distance = newDistance
            particle.trail = []

            // Occasionally change particle properties when recycling
            if (Math.random() > 0.7) {
              particle.speedFactor = Math.random() * 0.5 + 0.5
              particle.size = Math.random() * 2 + 0.5
              particle.trailLength = Math.floor(Math.random() * 6) + 3
              particle.hue = Math.random() > 0.9 ? Math.random() * 60 - 30 : 0
            }
          }

          // Skip drawing particles that are too far away to be visible
          if (distance > blackHoleRadius * 30) return

          // Draw particle trail with dynamic opacity
          if (particle.trail.length > 1) {
            ctx.beginPath()
            ctx.moveTo(particle.trail[0].x, particle.trail[0].y)

            for (let i = 1; i < particle.trail.length; i++) {
              if (!particle.trail[i]) continue // Skip if trail point is undefined
              ctx.lineTo(particle.trail[i].x, particle.trail[i].y)
            }

            // Calculate opacity based on distance and speed
            const distanceFactor = Math.min(1, (distance - blackHoleRadius) / (blackHoleRadius * 5))

            // Add subtle pulsing to the opacity
            const opacityPulse = 0.8 + 0.2 * Math.sin(time * particle.pulseRate * 1000 + particle.pulseOffset)
            const opacity = distanceFactor * particle.alpha * opacityPulse

            // Increase brightness as particles approach the black hole (proximity effect)
            const proximityBrightness = Math.min(1, proximityFactor - 1) * 0.5

            // Add subtle color variations to some particles
            if (particle.hue !== 0) {
              ctx.strokeStyle = `hsla(${220 + particle.hue}, 70%, ${80 + proximityBrightness * 20}%, ${
                opacity + proximityBrightness * 0.3
              })`
            } else {
              ctx.strokeStyle = `rgba(${255}, ${255}, ${255}, ${opacity + proximityBrightness * 0.3})`
            }

            ctx.lineWidth = particle.size * (1 + proximityBrightness * 0.5)
            ctx.stroke()
          }

          // Draw particle
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size / 2, 0, Math.PI * 2)

          // Add subtle color variations to some particles
          if (particle.hue !== 0) {
            ctx.fillStyle = `hsla(${220 + particle.hue}, 70%, 80%, ${particle.alpha})`
          } else {
            ctx.fillStyle = `rgba(255, 255, 255, ${particle.alpha})`
          }

          ctx.fill()
        })
      }

      // End of animate function
      animationRef.current = requestAnimationFrame(animate)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting !== isVisible) {
            setIsVisible(entry.isIntersecting)
            if (entry.isIntersecting) {
              lastFrameTime.current = performance.now()
              lastTime = performance.now()
            }
          }
        })
      },
      { threshold: 0.1, rootMargin: "100px" },
    )

    if (canvas) {
      observer.observe(canvas)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationRef.current)
      observer.disconnect()
    }
  }, [isVisible])

  return (
    <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full -z-10" style={{ background: "black" }} />
  )
}
