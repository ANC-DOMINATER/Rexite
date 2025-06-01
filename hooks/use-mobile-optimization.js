"use client";

import { useState, useEffect } from "react";

/**
 * Hook for mobile device detection and performance optimization
 * Returns optimized settings based on device capabilities
 */
export function useMobileOptimization() {
  const [optimization, setOptimization] = useState({
    isMobile: false,
    isLowPerformance: false,
    particleCount: 350,
    frameRate: 60,
    enableComplexAnimations: true,
    enableParticleEffects: true,
    enableBlurEffects: true,
    devicePixelRatio: 1,
  });

  useEffect(() => {
    const checkDeviceCapabilities = () => {
      // Detect mobile devices
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth < 768;

      // Detect low-performance devices
      const isLowPerformance = 
        // Low-end mobile devices
        (/Android.*[2-5]\.|iPhone.*[1-8]S|iPad.*[1-4]/i.test(navigator.userAgent)) ||
        // Devices with low RAM (approximate detection)
        (navigator.deviceMemory && navigator.deviceMemory < 4) ||
        // Slow hardware concurrency
        (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) ||
        // Small screens (likely mobile)
        (window.innerWidth < 480 && window.innerHeight < 800);

      // Get device pixel ratio (limit for performance)
      const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      // Performance-based optimizations
      let particleCount = 350;
      let frameRate = 60;
      let enableComplexAnimations = true;
      let enableParticleEffects = true;
      let enableBlurEffects = true;

      if (isLowPerformance) {
        particleCount = 50;
        frameRate = 30;
        enableComplexAnimations = false;
        enableBlurEffects = false;
      } else if (isMobile) {
        particleCount = 150;
        frameRate = 45;
        enableComplexAnimations = true;
        enableBlurEffects = false; // Blur is expensive on mobile
      }

      setOptimization({
        isMobile,
        isLowPerformance,
        particleCount,
        frameRate,
        enableComplexAnimations,
        enableParticleEffects,
        enableBlurEffects,
        devicePixelRatio,
      });
    };

    checkDeviceCapabilities();

    // Re-check on window resize
    window.addEventListener("resize", checkDeviceCapabilities);
    return () => window.removeEventListener("resize", checkDeviceCapabilities);
  }, []);

  return optimization;
}

/**
 * Hook for responsive canvas sizing with performance optimization
 */
export function useResponsiveCanvas(canvasRef) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const optimization = useMobileOptimization();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const { innerWidth, innerHeight } = window;
      
      // Use lower resolution for better performance
      const scaleFactor = optimization.isMobile 
        ? Math.min(optimization.devicePixelRatio, 1.5)
        : optimization.devicePixelRatio;

      const width = innerWidth * scaleFactor;
      const height = innerHeight * scaleFactor;

      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(scaleFactor, scaleFactor);
      }

      setDimensions({ width, height });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [optimization.isMobile, optimization.devicePixelRatio]);

  return { dimensions, optimization };
}

/**
 * Hook for frame rate throttling
 */
export function useFrameThrottle(targetFPS = 60) {
  const optimization = useMobileOptimization();
  const frameInterval = 1000 / (optimization.frameRate || targetFPS);
  
  return {
    frameInterval,
    shouldSkipFrame: (lastFrameTime, currentTime) => {
      return currentTime - lastFrameTime < frameInterval;
    }
  };
}

/**
 * Hook for memory management and cleanup optimization
 */
export function useMemoryOptimization() {
  const optimization = useMobileOptimization();
  
  useEffect(() => {
    let memoryCheckInterval;

    // Aggressive memory management for mobile devices
    if (optimization.isMobile || optimization.isLowPerformance) {
      // Check memory usage and suggest garbage collection periodically
      memoryCheckInterval = setInterval(() => {
        // Force garbage collection if available (Chrome DevTools)
        if (window.gc && typeof window.gc === 'function') {
          window.gc();
        }
        
        // Check memory usage if available
        if (performance.memory) {
          const memoryUsage = performance.memory.usedJSHeapSize / performance.memory.totalJSHeapSize;
          
          // If memory usage is high (>80%), try to trigger cleanup
          if (memoryUsage > 0.8) {
            // Dispatch custom event for components to cleanup
            window.dispatchEvent(new CustomEvent('memory-pressure'));
          }
        }
      }, optimization.isLowPerformance ? 5000 : 10000); // More frequent on low-end devices
    }

    return () => {
      if (memoryCheckInterval) {
        clearInterval(memoryCheckInterval);
      }
    };
  }, [optimization.isMobile, optimization.isLowPerformance]);

  return {
    optimization,
    /**
     * Clean up arrays and objects to help garbage collection
     */
    cleanupArray: (array) => {
      if (Array.isArray(array)) {
        array.length = 0;
      }
    },
    /**
     * Clean up canvas context and associated data
     */
    cleanupCanvas: (canvasRef) => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        // Set canvas size to 1x1 to free memory
        canvas.width = 1;
        canvas.height = 1;
      }
    },
    /**
     * Optimized object pool for particle systems
     */
    createObjectPool: (createFunction, initialSize = 50) => {
      const pool = [];
      const active = [];
      
      // Pre-allocate objects for better performance
      for (let i = 0; i < initialSize; i++) {
        pool.push(createFunction());
      }
      
      return {
        get: () => {
          const obj = pool.pop() || createFunction();
          active.push(obj);
          return obj;
        },
        release: (obj) => {
          const index = active.indexOf(obj);
          if (index > -1) {
            active.splice(index, 1);
            // Reset object properties instead of creating new
            if (typeof obj.reset === 'function') {
              obj.reset();
            }
            pool.push(obj);
          }
        },
        cleanup: () => {
          pool.length = 0;
          active.length = 0;
        }
      };
    }
  };
}

/**
 * Hook for animation performance monitoring
 */
export function usePerformanceMonitor() {
  const optimization = useMobileOptimization();
  const [performanceStats, setPerformanceStats] = useState({
    fps: 60,
    frameTime: 16.67,
    isOptimal: true
  });

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let frameCheckInterval;

    if (optimization.isMobile) {
      frameCheckInterval = setInterval(() => {
        const now = performance.now();
        const fps = frameCount / ((now - lastTime) / 1000);
        const frameTime = (now - lastTime) / frameCount;
        const isOptimal = fps > (optimization.frameRate * 0.8); // 80% of target FPS

        setPerformanceStats({ fps, frameTime, isOptimal });
        
        // Reset counters
        frameCount = 0;
        lastTime = now;

        // If performance is poor, dispatch event for components to reduce quality
        if (!isOptimal) {
          window.dispatchEvent(new CustomEvent('performance-degraded', {
            detail: { fps, frameTime }
          }));
        }
      }, 2000); // Check every 2 seconds
    }

    return () => {
      if (frameCheckInterval) {
        clearInterval(frameCheckInterval);
      }
    };
  }, [optimization.isMobile, optimization.frameRate]);

  const recordFrame = () => {
    frameCount++;
  };

  return { performanceStats, recordFrame };
}
