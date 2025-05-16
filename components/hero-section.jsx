"use client"

import { useEffect, useRef } from "react"
import InterstellarBlackHole from "./interstellar-black-hole"

export default function HeroSection() {
  const titleRef = useRef(null)
  const descriptionRef = useRef(null)
  const buttonRef = useRef(null)

  useEffect(() => {
    // Animate elements when component mounts
    const title = titleRef.current
    const description = descriptionRef.current
    const button = buttonRef.current

    if (title && description && button) {
      // Initial state - invisible
      title.style.opacity = "0"
      title.style.transform = "translateY(20px)"
      description.style.opacity = "0"
      description.style.transform = "translateY(20px)"
      button.style.opacity = "0"
      button.style.transform = "translateY(20px)"

      // Animate title after a short delay
      setTimeout(() => {
        title.style.transition = "opacity 1.2s ease, transform 1.2s ease"
        title.style.opacity = "1"
        title.style.transform = "translateY(0)"

        // Animate description after title
        setTimeout(() => {
          description.style.transition = "opacity 1.2s ease, transform 1.2s ease"
          description.style.opacity = "1"
          description.style.transform = "translateY(0)"

          // Animate button after description
          setTimeout(() => {
            button.style.transition =
              "opacity 1s ease, transform 1s ease, background-color 0.3s ease, transform 0.3s ease"
            button.style.opacity = "1"
            button.style.transform = "translateY(0)"
          }, 300)
        }, 300)
      }, 500)
    }
  }, [])

  return (
    <section
      className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <InterstellarBlackHole />
      {/* Semi-transparent gradient overlay to improve text readability */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-0"></div>
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1
          ref={titleRef}
          className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight drop-shadow-lg"
          style={{ opacity: 0, transform: "translateY(20px)" }}>
          Beyond the Event Horizon
        </h1>
        <p
          ref={descriptionRef}
          className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed font-light backdrop-blur-sm bg-black/10 px-4 py-2 rounded-lg"
          style={{ opacity: 0, transform: "translateY(20px)" }}>
          Where time bends and light surrenders to the infinite pull of gravity
        </p>
        <button
          ref={buttonRef}
          className="px-8 py-3 bg-white text-black rounded-full text-lg font-medium hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg"
          style={{ opacity: 0, transform: "translateY(20px)" }}>
          Explore the Universe
        </button>
      </div>
    </section>
  );
}
