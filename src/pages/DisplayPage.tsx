import { useState, useEffect, useRef } from "react"
import { QRCodeSVG } from "qrcode.react"
import { motion, AnimatePresence } from "framer-motion"
import { supabase, type Answer } from "../lib/supabase"

export function DisplayPage() {
  const [latestAnswer, setLatestAnswer] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showQR, setShowQR] = useState(true)
  const [isShaking, setIsShaking] = useState(false)
  const [isPortrait, setIsPortrait] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [portraitRotation, setPortraitRotation] = useState(0) // 0°, 180°
  const answerTimerRef = useRef<NodeJS.Timeout | null>(null)
  const controlsTimerRef = useRef<NodeJS.Timeout | null>(null)
  const qrSwitchTimerRef = useRef<NodeJS.Timeout | null>(null)
  
  // Get the current URL for QR code
  const currentUrl = window.location.origin

  // Handle new answer: show 8 ball shake, then answer, then return to QR
  const handleNewAnswer = (message: string) => {
    console.log('🎯 New answer incoming:', message)
    
    // Clear any existing timer
    if (answerTimerRef.current) {
      clearTimeout(answerTimerRef.current)
    }
    
    // Step 1: Hide QR and show 8 ball shaking
    setShowQR(false)
    setIsShaking(true)
    
    // Step 2: After 3 seconds of shaking, show the answer (building suspense!)
    setTimeout(() => {
      setIsShaking(false)
      setLatestAnswer(message)
    }, 3000)
    
    // Step 3: After 10 seconds, hide answer and show QR again
    answerTimerRef.current = setTimeout(() => {
      console.log('⏰ 10 seconds passed, returning to QR mode')
      setLatestAnswer(null)
      setShowQR(true)
    }, 13000) // 3s shake + 10s display
  }

  useEffect(() => {
    console.log('🎱 DisplayPage: Setting up real-time subscription...')
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('answers-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'answers'
        },
        (payload) => {
          console.log('🔔 Real-time event received!', payload)
          const newAnswer = payload.new as Answer
          handleNewAnswer(newAnswer.message)
        }
      )
      .subscribe((status) => {
        console.log('📡 Subscription status:', status)
        if (status === 'CHANNEL_ERROR') {
          console.error('❌ Real-time subscription failed! Check if realtime is enabled in Supabase.')
        }
      })

    // Fetch the latest answer on mount (but don't auto-show it)
    const fetchLatestAnswer = async () => {
      const { data, error } = await supabase
        .from('answers')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)

      if (error) {
        console.error('❌ Error fetching latest answer:', error)
      } else if (data && data.length > 0) {
        console.log('✅ Latest answer in DB:', data[0].message)
        // Don't auto-show old answers, wait for new ones
      } else {
        console.log('📭 No answers in database yet')
      }
    }

    fetchLatestAnswer()

    // Cleanup subscription
    return () => {
      console.log('🧹 Cleaning up subscription')
      if (answerTimerRef.current) {
        clearTimeout(answerTimerRef.current)
      }
      supabase.removeChannel(channel)
    }
  }, [])

  // Auto-hide controls after 5 seconds
  const resetControlsTimer = () => {
    setShowControls(true)
    
    if (controlsTimerRef.current) {
      clearTimeout(controlsTimerRef.current)
    }
    
    controlsTimerRef.current = setTimeout(() => {
      setShowControls(false)
    }, 5000)
  }

  // Show controls when mouse is near the top
  const handleMouseMove = (e: React.MouseEvent) => {
    const mouseY = e.clientY
    const windowHeight = window.innerHeight
    
    // Show controls if mouse is in top 100px or bottom 100px
    if (mouseY < 100 || mouseY > windowHeight - 100) {
      resetControlsTimer()
    }
  }

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Auto-switch between QR and 8 every 5 seconds when idle
  useEffect(() => {
    const startQRSwitch = () => {
      if (qrSwitchTimerRef.current) {
        clearTimeout(qrSwitchTimerRef.current)
      }
      
      qrSwitchTimerRef.current = setTimeout(() => {
        if (!latestAnswer && !isShaking) {
          setShowQR(!showQR)
          startQRSwitch() // Continue switching
        }
      }, 5000)
    }
    
    startQRSwitch()
    
    return () => {
      if (qrSwitchTimerRef.current) {
        clearTimeout(qrSwitchTimerRef.current)
      }
    }
  }, [showQR, latestAnswer, isShaking])

  // Initialize controls timer on mount
  useEffect(() => {
    resetControlsTimer()
    
    return () => {
      if (controlsTimerRef.current) {
        clearTimeout(controlsTimerRef.current)
      }
    }
  }, [])

  return (
    <div 
      className="min-h-screen bg-black flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden"
        style={{ 
          transform: isPortrait ? `rotate(${90 + portraitRotation}deg)` : 'rotate(0deg)',
          width: isPortrait ? '100vh' : '100vw',
          height: isPortrait ? '100vw' : '100vh',
          transformOrigin: 'center center',
          position: 'fixed',
          top: isPortrait ? '50%' : '0',
          left: isPortrait ? '50%' : '0',
          marginLeft: isPortrait ? '-50vh' : '0',
          marginTop: isPortrait ? '-50vw' : '0'
        }}
      onMouseMove={handleMouseMove}
    >
      {/* Control buttons - auto-hide after 5 seconds */}
      <AnimatePresence>
        {showControls && (
          <>
            {/* Rotation toggle button */}
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => {
                e.stopPropagation()
                setIsPortrait(!isPortrait)
                resetControlsTimer()
              }}
              className="absolute top-4 left-4 z-50 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm backdrop-blur-sm border border-white/20 transition-colors"
            >
                {isPortrait ? '↻ Landscape' : '↻ Portrait'}
              </motion.button>

              {/* Flip button - only in portrait mode */}
              {isPortrait && (
                <motion.button
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    setPortraitRotation((prev) => (prev + 180) % 360)
                    resetControlsTimer()
                  }}
                  className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm backdrop-blur-sm border border-white/20 transition-colors"
                >
                  Flip ({portraitRotation}°)
                </motion.button>
              )}

            {/* Fullscreen toggle */}
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => {
                e.stopPropagation()
                toggleFullscreen()
                resetControlsTimer()
              }}
              className="absolute top-4 right-4 z-50 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm backdrop-blur-sm border border-white/20 transition-colors"
            >
              {isFullscreen ? '⊟ Exit Fullscreen' : '⊡ Fullscreen'}
            </motion.button>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {isShaking ? (
          /* 8 Ball Shaking Animation - Low-spec optimized */
          <div
            key="ball-shaking"
            className="relative"
              style={{
                animation: 'shake 3s ease-in-out',
                willChange: 'transform',
                backfaceVisibility: 'hidden',
                perspective: '1000px'
              }}
          >
            {/* Simplified background glow - no blur filter */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'rgba(41,98,255,0.3)',
                animation: 'pulse 2s ease-in-out infinite'
              }}
            />
            
            {/* The 8 Ball - simplified gradient */}
            <div
              className="w-80 h-80 md:w-96 md:h-96 rounded-full flex items-center justify-center relative overflow-hidden"
              style={{
                background: '#000000',
                boxShadow: '0 0 60px rgba(41,98,255,0.6)'
              }}
            >
              {/* Simple shine effect - no gradient */}
              <div 
                className="absolute inset-0 bg-white"
                style={{
                  opacity: 0.05,
                  animation: 'spin 3s linear'
                }}
              />
              
              {/* Inner circle with number 8 */}
              <div 
                className="w-40 h-40 md:w-48 md:h-48 bg-white rounded-full flex items-center justify-center relative z-10"
                style={{
                  boxShadow: '0 0 30px rgba(41,98,255,0.8)',
                  animation: 'pulse 0.5s ease-in-out infinite'
                }}
              >
                <span className="text-black text-7xl md:text-8xl font-bold">8</span>
              </div>
            </div>
          </div>
        ) : latestAnswer ? (
          /* Answer Display - Optimized with CSS */
          <div
            key={`answer-${latestAnswer}`}
            className="w-full max-w-6xl px-4"
            style={{
              animation: 'answerAppear 0.8s ease-out'
            }}
          >
            <div className="relative">
              {/* Upside down triangle container */}
              <div 
                className={`relative mx-auto ${
                  isPortrait ? 'w-80 h-80' : 'w-96 h-96'
                }`}
              style={{
                clipPath: 'polygon(50% 100%, 0% 13.4%, 100% 13.4%)',
                background: 'linear-gradient(135deg, rgba(41,98,255,0.1) 0%, rgba(41,98,255,0.3) 100%)',
                boxShadow: '0 0 40px rgba(41,98,255,0.6), inset 0 0 20px rgba(41,98,255,0.2)',
                animation: 'flash 2s ease-out'
              }}
              >
                {/* Text content */}
                <div className="absolute inset-0 flex items-center justify-center px-4">
                  <p 
                    className={`text-center text-white font-bold uppercase tracking-wider ${
                      isPortrait 
                        ? 'text-xs sm:text-sm md:text-base' 
                        : 'text-sm md:text-base lg:text-lg'
                    }`}
                    style={{
                      animation: 'answerPulse 2s ease-in-out infinite',
                      textShadow: '0 0 10px rgba(255,255,255,0.8)',
                      lineHeight: '1.2'
                    }}
                  >
                    {latestAnswer.split(' ').map((word, index, array) => (
                      <span key={index}>
                        {word}
                        {index < array.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* 8 Ball with QR Code or Number 8 (idle state) - Low-spec optimized */
          <div
            key="ball-idle"
            className="relative"
            style={{
              animation: 'ballIdle 0.8s ease-out'
            }}
          >
            {/* Simplified background glow - no blur filter */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'rgba(41,98,255,0.2)',
                animation: 'pulse 3s ease-in-out infinite'
              }}
            />
            
            {/* The 8 Ball (static) - simplified gradient */}
            <div
              className="w-80 h-80 md:w-96 md:h-96 rounded-full flex items-center justify-center relative overflow-hidden"
              style={{
                background: '#000000',
                boxShadow: '0 0 40px rgba(41,98,255,0.4)'
              }}
            >
              {/* Simple shine effect - static */}
              <div 
                className="absolute inset-0 bg-white"
                style={{
                  opacity: 0.03
                }}
              />
              
              {/* Inner circle with QR or 8 */}
              <div 
                className="w-40 h-40 md:w-48 md:h-48 bg-white rounded-full flex items-center justify-center relative z-10"
                style={{
                  boxShadow: '0 0 20px rgba(41,98,255,0.5)'
                }}
              >
                <AnimatePresence mode="wait">
                  {showQR ? (
                     <div
                       key="qr"
                       className="flex items-center justify-center"
                       style={{
                         animation: 'qrAppear 0.5s ease-out'
                       }}
                     >
                       <QRCodeSVG 
                         value={currentUrl} 
                         size={120}
                         level="M"
                         includeMargin={false}
                       />
                     </div>
                  ) : (
                    <span
                      key="eight"
                      className="text-black text-7xl md:text-8xl font-bold"
                      style={{
                        animation: 'eightAppear 0.5s ease-out'
                      }}
                    >
                      8
                    </span>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Instructions (only show when QR is visible) */}
      {showQR && !latestAnswer && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="absolute bottom-12 text-center"
        >
          <p className="text-white text-5xl mb-2">Magic 🎱 Ball</p>

          <p className="text-white text-2xl mb-2">Escaneie o QR Code e faça uma pergunta aos Espíritos!</p>
         
        </motion.div>
      )}

      {/* Footer */}
      <div className="absolute bottom-4 text-white/50 text-lg">
        aria.studio
      </div>
    </div>
  )
}