"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export default function NotFound() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Set canvas to full screen
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Stars
    const stars = [];
    for (let i = 0; i < 400; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        speed: Math.random() * 0.05,
        opacity: Math.random() * 0.5 + 0.5,
      });
    }

    // Nebula particles
    const nebulaParticles = [];
    const colors = ["#8a2be2", "#4b0082", "#9370db", "#9932cc", "#ba55d3"];
    for (let i = 0; i < 50; i++) {
      nebulaParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 100 + 50,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.2,
      });
    }

    // Shooting stars
    const shootingStars = [];
    for (let i = 0; i < 5; i++) {
      shootingStars.push({
        x: Math.random() * canvas.width,
        y: (Math.random() * canvas.height) / 2,
        length: Math.random() * 80 + 100,
        speed: Math.random() * 5 + 10,
        opacity: 0,
        active: false,
        delay: Math.random() * 200,
      });
    }

    // Animation
    let animationFrameId;
    let frameCount = 0;

    const render = () => {
      frameCount++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw deep space background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#0a0a1a");
      gradient.addColorStop(1, "#1a0a2e");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw nebula
      nebulaParticles.forEach((particle) => {
        const grd = ctx.createRadialGradient(
            particle.x,
            particle.y,
            0,
            particle.x,
            particle.y,
            particle.size
        );
        grd.addColorStop(0, `${particle.color}`);
        grd.addColorStop(1, "transparent");

        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        particle.x += Math.sin(frameCount * 0.001) * 0.2;
        particle.y += Math.cos(frameCount * 0.001) * 0.2;
      });

      // Draw stars
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();

        star.opacity = 0.5 + Math.sin(frameCount * 0.01 + star.x) * 0.5;
        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });

      // Draw shooting stars
      shootingStars.forEach((star) => {
        if (frameCount % 200 === star.delay && !star.active) {
          star.active = true;
          star.x = Math.random() * canvas.width;
          star.y = Math.random() * (canvas.height / 3);
          star.opacity = 1;
        }

        if (star.active) {
          ctx.beginPath();
          ctx.moveTo(star.x, star.y);
          ctx.lineTo(star.x + star.length, star.y + star.length);
          ctx.strokeStyle = `rgba(255, 255, 255, ${star.opacity})`;
          ctx.lineWidth = 2;
          ctx.stroke();

          star.x += star.speed;
          star.y += star.speed;
          star.opacity -= 0.01;

          if (star.opacity <= 0) {
            star.active = false;
            star.delay = Math.random() * 200;
          }
        }
      });

      animationFrameId = window.requestAnimationFrame(render);
    };

    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
      <div
          ref={containerRef}
          className="relative min-h-screen overflow-hidden font-sans"
      >
        {/* Canvas for space background */}
        <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full z-0"
        />
        {/* Saturn */}
        <div
            className="absolute z-10 w-40 h-40 md:w-60 md:h-60"
            style={{
              top: "30%",
              left: "15%",
              animation: "float 15s infinite ease-in-out",
            }}
        >
          <div className="relative w-full h-full">
            <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                      "linear-gradient(135deg, #e6c88a 0%, #d4b36a 40%, #a88d5a 100%)",
                  boxShadow:
                      "inset -10px -10px 20px rgba(0,0,0,0.4), 0 0 20px rgba(230, 200, 138, 0.3)",
                }}
            ></div>
            <div className="absolute inset-0 rounded-full overflow-hidden">
              {[
                {
                  height: "4.63718606943393px",
                  top: "34.307567496416716%",
                  background:
                      "rgba(153.20821489554723, 131.99546395875583, 76.38200263400839, 0.6)",
                  transform: "rotate(1.3771276497587848deg)",
                  boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                },
                {
                  height: "8.59427224881511px",
                  top: "92.39828969539236%",
                  background:
                      "rgba(173.25677317270666, 124.0271518099366, 79.87224003987163, 0.6)",
                  transform: "rotate(3.016830892722036deg)",
                  boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                },
                {
                  height: "5.87436px",
                  top: "52.18453%",
                  background: "rgba(162.34, 138.75, 68.29, 0.6)",
                  transform: "rotate(2.14568deg)",
                  boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                },
                {
                  height: "3.92841px",
                  top: "76.32197%",
                  background: "rgba(178.46, 142.31, 81.73, 0.6)",
                  transform: "rotate(4.32981deg)",
                  boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                },
                {
                  height: "7.14529px",
                  top: "12.45678%",
                  background: "rgba(169.78, 127.64, 72.35, 0.6)",
                  transform: "rotate(2.75432deg)",
                  boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                },
              ].map((style, i) => (
                  <div key={i} className="absolute w-full" style={style}></div>
              ))}
            </div>
            <div
                className="absolute top-1/2 left-1/2"
                style={{
                  width: "160%",
                  height: "30%",
                  transform: "translate(-50%, -50%) rotate(-20deg)",
                  perspective: "1000px",
                }}
            >
              <div
                  className="absolute inset-0 rounded-[100%]"
                  style={{
                    border: "4px solid rgba(230, 200, 138, 0.7)",
                    transform: "rotateX(75deg)",
                    boxShadow: "0 0 10px rgba(230, 200, 138, 0.3)",
                  }}
              ></div>
              <div
                  className="absolute inset-[10%] rounded-[100%]"
                  style={{
                    border: "6px solid rgba(200, 180, 120, 0.5)",
                    transform: "rotateX(75deg)",
                  }}
              ></div>
              <div
                  className="absolute inset-[25%] rounded-[100%]"
                  style={{
                    border: "3px solid rgba(180, 160, 100, 0.4)",
                    transform: "rotateX(75deg)",
                  }}
              ></div>
            </div>
          </div>
        </div>
        {/* Planet */}
        <div
            className="absolute z-10"
            style={{
              top: "60%",
              right: "10%",
              width: "250px",
              height: "250px",
              borderRadius: "50%",
              background: "linear-gradient(45deg, #330867, #30cfd0)",
              boxShadow: "0 0 60px rgba(48, 207, 208, 0.3)",
              animation: "float 20s infinite ease-in-out 2s",
              overflow: "hidden",
            }}
        >
          <div className="absolute w-full h-full opacity-30">
            {Array.from({ length: 8 }).map((_, i) => (
                <div
                    key={i}
                    className="absolute bg-white rounded-full"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      width: `${Math.random() * 60 + 20}px`,
                      height: `${Math.random() * 60 + 20}px`,
                      opacity: Math.random() * 0.3,
                    }}
                />
            ))}
          </div>
          <div
              className="absolute top-1/2 left-1/2 w-[300px] h-[50px] -translate-x-1/2 -translate-y-1/2 bg-transparent border-t-4 border-purple-300 opacity-50 rounded-[100%] -rotate-12"
          ></div>
        </div>
        {/* Content */}
        <div className="relative z-20 flex flex-col items-center justify-center min-h-screen text-center px-6">
          <h1 className="text-[150px] md:text-[200px] font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-0">
            404
          </h1>
          <div className="relative -mt-10 mb-8">
            <h2 className="text-3xl md:text-5xl font-bold text-white">
              Page Not Found
            </h2>
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-6"
            >
              <Link href="/">
                <RotateCcw className="mr-2 h-5 w-5" />
                Return to Home
              </Link>
            </Button>
          </div>
        </div>
        {/* CSS Animations */}
        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              transform: translate(0, 0);
            }
            25% {
              transform: translate(-15px, 15px);
            }
            50% {
              transform: translate(0, 30px);
            }
            75% {
              transform: translate(15px, 15px);
            }
          }
        `}</style>
      </div>
  );
}