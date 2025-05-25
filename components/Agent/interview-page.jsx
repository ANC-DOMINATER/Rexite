"use client"

import { useState, useEffect, useRef } from "react"
import { Mic, User, Bot, Phone, PhoneOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import UserVisualizer from "@/components/Agent/user-visualizer"
import AIVisualizer from "@/components/Agent/ai-visualizer"
import { useUser } from "@clerk/nextjs"
import Vapi from "@vapi-ai/web"

// Add a style block at the top of the component to ensure full viewport coverage
const pageStyles = {
  container: {
    height: "100vh",
    width: "100vw",
    margin: 0,
    padding: 0,
    overflow: "hidden",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "column"
  }
}

export default function InterviewPage() {
  // Initialize state outside of any effects
  const [isConnected, setIsConnected] = useState(false)
  const [isUserSpeaking, setIsUserSpeaking] = useState(false)
  const [isAISpeaking, setIsAISpeaking] = useState(false)
  const [sessionTime, setSessionTime] = useState(0)
  const [vapiStatus, setVapiStatus] = useState("idle")
  const [audioLevels, setAudioLevels] = useState(Array(32).fill(0))

  // Vapi client refs
  const vapiRef = useRef(null)
  const analyserRef = useRef(null)
  const audioContextRef = useRef(null)
  const animationFrameRef = useRef(null)

  // Create memoized handler functions to avoid recreating them on every render
  const handleCallStart = useRef(() => {
    console.log("Vapi call started successfully")
    setIsConnected(true)
    setVapiStatus("connected")
  }).current

  const handleCallEnd = useRef(() => {
    setIsConnected(false)
    setIsUserSpeaking(false)
    setIsAISpeaking(false)
    setVapiStatus("idle")
    setSessionTime(0)
  }).current

  const handleSpeechStart = useRef(() => {
    setIsAISpeaking(true)
    setVapiStatus("speaking")
  }).current

  const handleSpeechEnd = useRef(() => {
    setIsAISpeaking(false)
    setVapiStatus("listening")
  }).current

  const handleError = useRef((error) => {
    console.error("Vapi error occurred:", error)
    console.error("Error type:", typeof error)
    console.error("Error details:", Object.keys(error).length ? JSON.stringify(error) : "Empty error object")
    console.error("Error context:", new Error().stack)
    setVapiStatus("idle")
    setIsConnected(false)
  }).current

  // Session timer
  useEffect(() => {
    let interval
    if (isConnected) {
      interval = setInterval(() => {
        setSessionTime((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval);
  }, [isConnected])

  // Audio level analyzer setup - keep once only
  useEffect(() => {
    if (!audioContextRef.current && typeof window !== 'undefined') {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext
        audioContextRef.current = new AudioContext()
        analyserRef.current = audioContextRef.current.createAnalyser()
        analyserRef.current.fftSize = 64
      } catch (error) {
        console.error("Error setting up audio context:", error)
      }
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(console.error)
      }
    }
  }, [])

  // Audio level updates
  useEffect(() => {
    if (!isConnected || !analyserRef.current) return

    const updateAudioLevels = () => {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)

      if (isUserSpeaking || isAISpeaking) {
        analyserRef.current.getByteFrequencyData(dataArray)
        // Scale the audio levels for visualization
        setAudioLevels(Array.from(dataArray).map(value => value * 0.8))
      } else {
        // Smooth decay when not speaking
        setAudioLevels(prev => prev.map(level => level * 0.95))
      }

      animationFrameRef.current = requestAnimationFrame(updateAudioLevels)
    }

    updateAudioLevels()
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isConnected, isUserSpeaking, isAISpeaking])

  // Initialize Vapi with stable callback references
  useEffect(() => {
    // Initialize Vapi only once
    if (!vapiRef.current && typeof window !== 'undefined') {
      try {
        console.log("Initializing Vapi with key:", process.env.NEXT_PUBLIC_VAPI_API_KEY ? "Key exists" : "Key missing")

        // Create Vapi instance with API key
        vapiRef.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY)

        // Set up event listeners with stable callback references
        vapiRef.current.on('call-start', handleCallStart)
        vapiRef.current.on('call-end', handleCallEnd)
        vapiRef.current.on('speech-start', handleSpeechStart)
        vapiRef.current.on('speech-end', handleSpeechEnd)
        vapiRef.current.on('error', handleError)

        // Connect volume level to audio visualizer - use a stable reference
        vapiRef.current.on('volume-level', (volume) => {
          // Volume is between 0 and 1, scale it to create visual effect
          if (analyserRef.current && audioContextRef.current) {
            const scaledVolume = volume * 255
            setAudioLevels(prev =>
              prev.map((_, i) => {

                return scaledVolume * (0.5 + Math.sin(i * 0.2) * 0.5)
              })
            )
          }
        })
      } catch (error) {
        console.error("Failed to initialize Vapi:", error)
        console.error("Error stack:", error.stack)
      }
    }

    return () => {
      // Clean up Vapi and event listeners
      if (vapiRef.current) {
        try {
          // Remove event listeners
          vapiRef.current.removeAllListeners()
          vapiRef.current.stop()
        } catch (error) {
          console.error("Error stopping Vapi:", error)
        }
      }
    }
  }, [handleCallStart, handleCallEnd, handleSpeechStart, handleSpeechEnd, handleError])

  const toggleConnection = async () => {
    if (!isConnected) {
      if (!vapiRef.current) {
        console.error("Vapi is not initialized")
        return
      }

      setVapiStatus("connecting")

      try {
        // Start the call with the assistant ID
        const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID

        console.log("Starting Vapi call with assistant ID:", assistantId ? "ID exists" : "ID missing")

        // You can also provide configuration overrides
        const assistantOverrides = {
          // Example: override settings if needed
          recordingEnabled: true,
        }

        // Enhanced error handling with try/catch and timeout
        const callPromise = vapiRef.current.start(assistantId, assistantOverrides)

        // Add a timeout to detect hanging calls
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Call start timed out after 10 seconds")), 20000)
        })

        await Promise.race([callPromise, timeoutPromise])
        // The call-start event will set isConnected and status
      } catch (error) {
        console.error("Failed to start Vapi call:", error)
        console.error("Error details:", error.message || "No error message")
        console.error("Error stack:", error.stack || "No stack trace")
        setVapiStatus("idle")
      }
    } else {
      // End the call
      try {
        await vapiRef.current.stop()
        // The call-end event will clean up the stateHydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:
      } catch (error) {
        console.error("Failed to stop Vapi call:", error)
        setIsConnected(false)
        setIsUserSpeaking(false)
        setIsAISpeaking(false)
        setVapiStatus("idle")
      }
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  const getStatusColor = () => {
    switch (vapiStatus) {
      case "connecting":
        return "text-yellow-400"
      case "connected":
        return "text-green-400"
      case "speaking":
        return isAISpeaking ? "text-blue-400" : "text-green-400"
      case "listening":
        return "text-purple-400"
      default:
        return "text-gray-400"
    }
  }

  const getStatusText = () => {
    switch (vapiStatus) {
      case "connecting":
        return "Connecting to Vapi..."
      case "connected":
        return "Connected - Ready to start"
      case "speaking":
        return isAISpeaking ? "AI is speaking" : "You are speaking"
      case "listening":
        return "Listening for your response"
      default:
        return "Not connected"
    }
  }

  function UserIcon() {
    const { user } = useUser();

    if (!user) return null;
    return (
      <img
        src={user.imageUrl}
        alt="User avatar"
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          objectFit: "cover",
          cursor: "pointer"
        }}
      />
    );
  }

  function UserName() {
    const { user } = useUser();
    return (
      <span className="text-white font-medium">
        {user?.fullName || "User"}
      </span>
    );
  }

  function getUserImageUrl() {
    // Safely access user data
    const { user, isLoaded } = useUser();

    // Defer to client-side rendering for user data to avoid hydration mismatch
    // Use the existing image in public folder as fallback
    return (isLoaded && user?.imageUrl) ? user.imageUrl : "/ai-avater.png";
  }

  return (
    <div style={pageStyles.container} className="bg-gradient-to-b from-gray-950 to-black text-white">
      {/* Main Interview Area */}
      <main className="flex-1 flex items-center justify-center w-full bg-gradient-to-br from-black via-gray-950 to-black">
        <div className="w-full h-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center px-4 sm:px-8 py-6">
          {/* User Section */}
          <div className="flex flex-col items-center justify-center h-full space-y-6 md:space-y-8">
            <div className="relative">
              <UserVisualizer
                isActive={isUserSpeaking}
                audioLevels={isUserSpeaking ? audioLevels : Array(32).fill(0)}
                userImage={getUserImageUrl()} />
            </div>

            <div className="text-center space-y-3 md:space-y-4">
              <h2 className="text-xl md:text-2xl font-semibold flex items-center justify-center gap-3">
                <div className="p-2 rounded-full bg-white/10">
                  <User className="w-5 h-5 md:w-6 md:h-6" />

                </div>
                You
              </h2>
              <p className="text-gray-400 text-sm md:text-base">Attendee</p>

              <div className="flex gap-3 justify-center">
                <Button
                  onClick={toggleConnection}
                  variant={isConnected ? "destructive" : "default"}
                  size="lg"
                  disabled={vapiStatus === "connecting"}
                  className={`transition-all duration-300 ${isConnected
                    ? "bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/25"
                    : "bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/25"
                    }`}>
                  {vapiStatus === "connecting" ? (
                    <>
                      <div
                        className="w-5 h-5 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Connecting...
                    </>
                  ) : isConnected ? (
                    <>
                      <PhoneOff className="w-5 h-5 mr-2" />
                      End Call
                    </>
                  ) : (
                    <>
                      <Phone className="w-5 h-5 mr-2" />
                      Start Interview
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* AI Section */}
          <div className="flex flex-col items-center justify-center h-full space-y-6 md:space-y-8">
            <div className="relative">
              <AIVisualizer
                isActive={isAISpeaking}
                audioLevels={isAISpeaking ? audioLevels : Array(32).fill(0)}
                vapiStatus={vapiStatus}
              />
            </div>

            <div className="text-center space-y-3 md:space-y-4">
              <h2 className="text-xl md:text-2xl font-semibold flex items-center justify-center gap-3">
                <div className="p-2 rounded-full bg-white/10">
                  <Bot className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <span>Rexite AI</span>
              </h2>
              <p className="text-gray-400 text-sm md:text-base">Interview Assistant</p>

              <div className="text-center max-w-sm space-y-2">
                <p className={`font-medium transition-colors duration-300 ${getStatusColor()}`}>
                  {getStatusText()}
                </p>

                {vapiStatus === "connecting" && (
                  <div className="flex justify-center">
                    <div className="flex space-x-1">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-2 h-2 bg-white rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.2}s` }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Enhanced Status Bar */}
      <footer className="w-full border-t border-gray-800/60 py-3 px-4 sm:px-6 bg-gradient-to-r from-black to-gray-900 backdrop-blur-sm">
        <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div
                className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${vapiStatus === "speaking" && isUserSpeaking
                  ? "bg-green-500 shadow-lg shadow-green-500/50"
                  : vapiStatus === "speaking" && isAISpeaking
                    ? "bg-blue-500 shadow-lg shadow-blue-500/50"
                    : vapiStatus === "listening"
                      ? "bg-purple-500 shadow-lg shadow-purple-500/50"
                      : vapiStatus === "connected"
                        ? "bg-green-400"
                        : "bg-gray-500"
                  }`} />
              <span className={`text-xs sm:text-sm font-medium transition-colors duration-300 ${getStatusColor()}`}>
                {getStatusText()}
              </span>
            </div>

            <div className="h-4 w-px bg-gray-600 hidden sm:block" />

            <div className="text-xs sm:text-sm text-gray-400">
              Connection:{" "}
              <span className={isConnected ? "text-green-400" : "text-red-400"}>
                {isConnected ? "Active" : "Disconnected"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400">
            <span>Interview  Session</span>
            <span className="hidden sm:inline">•</span>
            <span>Real-time Voice</span>
            <div className="h-4 w-px bg-gray-600 hidden sm:block" />
            <div className="flex items-center gap-2">
              <UserIcon />
              <UserName />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
