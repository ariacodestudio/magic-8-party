import { useState, useEffect, useRef } from "react"
import { QRCodeSVG } from "qrcode.react"
import { motion, AnimatePresence } from "framer-motion"
import { supabase, type Answer } from "../lib/supabase"
import { Card, CardContent } from "../components/ui/card"

export function DisplayPage() {
  const [latestAnswer, setLatestAnswer] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showQR, setShowQR] = useState(true)
  const answerTimerRef = useRef<NodeJS.Timeout | null>(null)
  
  // Get the current URL for QR code
  const currentUrl = window.location.origin

  // Handle new answer: show for 10 seconds then return to QR
  const handleNewAnswer = (message: string) => {
    console.log('🎯 Showing new answer:', message)
    
    // Clear any existing timer
    if (answerTimerRef.current) {
      clearTimeout(answerTimerRef.current)
    }
    
    // Show the answer and hide QR
    setLatestAnswer(message)
    setShowQR(false)
    
    // After 10 seconds, hide answer and show QR again
    answerTimerRef.current = setTimeout(() => {
      console.log('⏰ 10 seconds passed, returning to QR mode')
      setLatestAnswer(null)
      setShowQR(true)
    }, 10000)
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

  return (
    <div 
      className="min-h-screen bg-black flex flex-col items-center justify-center p-8 cursor-pointer relative overflow-hidden"
      onClick={toggleFullscreen}
    >
      {/* Fullscreen hint */}
      {!isFullscreen && (
        <div className="absolute top-4 right-4 text-white/50 text-sm animate-pulse">
          Click anywhere for fullscreen
        </div>
      )}

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {latestAnswer ? (
          /* Answer Display - Replaces the ball */
          <motion.div
            key={`answer-${latestAnswer}`}
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 180, opacity: 0 }}
            transition={{ 
              duration: 0.8, 
              type: "spring",
              bounce: 0.5
            }}
            className="w-full max-w-6xl px-4"
          >
            <Card className="border-4 border-neon-blue bg-black/95 neon-glow shadow-2xl">
              <CardContent className="p-8 md:p-20">
                <motion.p 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [0.95, 1.05, 1] }}
                  transition={{ 
                    duration: 0.5,
                    times: [0, 0.5, 1],
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                  className="text-center text-5xl md:text-7xl lg:text-9xl text-neon-blue text-neon-glow font-bold uppercase tracking-wider leading-tight"
                >
                  {latestAnswer}
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          /* 8 Ball with QR Code or Number 8 */
          <motion.div
            key="ball"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Mesmerizing rotating background glow */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(0,255,255,0.3) 0%, transparent 70%)',
                filter: 'blur(40px)',
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* The 8 Ball */}
            <motion.div
              animate={{
                rotateY: [0, 360],
                scale: [1, 1.05, 1],
              }}
              transition={{
                rotateY: {
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                },
                scale: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              className="w-80 h-80 md:w-96 md:h-96 bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-full flex items-center justify-center relative overflow-hidden shadow-2xl"
              style={{
                boxShadow: '0 0 60px rgba(0,255,255,0.5), inset 0 0 60px rgba(0,255,255,0.2)'
              }}
            >
              {/* Shine effect */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"
                animate={{
                  x: [-100, 400],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2,
                  ease: "easeInOut"
                }}
              />
              
              {/* Inner circle with QR or 8 */}
              <motion.div 
                className="w-40 h-40 md:w-48 md:h-48 bg-white rounded-full flex items-center justify-center relative z-10"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(0,255,255,0.5)',
                    '0 0 40px rgba(0,255,255,0.8)',
                    '0 0 20px rgba(0,255,255,0.5)',
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <AnimatePresence mode="wait">
                  {showQR ? (
                    <motion.div
                      key="qr"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 90 }}
                      transition={{ duration: 0.5 }}
                      className="flex flex-col items-center"
                    >
                      <QRCodeSVG 
                        value={currentUrl} 
                        size={120}
                        level="M"
                        includeMargin={false}
                      />
                      <p className="text-black text-xs mt-2 font-bold">SCAN ME</p>
                    </motion.div>
                  ) : (
                    <motion.span
                      key="eight"
                      initial={{ scale: 0, rotate: 90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: -90 }}
                      transition={{ duration: 0.5 }}
                      className="text-black text-7xl md:text-8xl font-bold"
                    >
                      8
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </motion.div>
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
          <p className="text-white text-2xl mb-2">Scan the QR code to join the party!</p>
          <p className="text-white/70 text-lg">{currentUrl}</p>
        </motion.div>
      )}

      {/* Footer */}
      <div className="absolute bottom-4 text-white/50 text-lg">
        Magic 8 Party ✨
      </div>
    </div>
  )
}