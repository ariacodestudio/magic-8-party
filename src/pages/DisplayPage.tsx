import { useState, useEffect } from "react"
import { QRCodeSVG } from "qrcode.react"
import { motion, AnimatePresence } from "framer-motion"
import { supabase, type Answer } from "../lib/supabase"
import { Card, CardContent } from "../components/ui/card"

export function DisplayPage() {
  const [latestAnswer, setLatestAnswer] = useState<string | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  // Get the current URL for QR code
  const currentUrl = window.location.origin

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
          setLatestAnswer(newAnswer.message)
          setShowAnswer(true)
          
          // Hide answer after 10 seconds
          setTimeout(() => {
            setShowAnswer(false)
          }, 10000)
        }
      )
      .subscribe((status) => {
        console.log('📡 Subscription status:', status)
        if (status === 'CHANNEL_ERROR') {
          console.error('❌ Real-time subscription failed! Check if realtime is enabled in Supabase.')
        }
      })

    // Fetch the latest answer on mount
    const fetchLatestAnswer = async () => {
      console.log('📥 Fetching latest answer from database...')
      const { data, error } = await supabase
        .from('answers')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)

      if (error) {
        console.error('❌ Error fetching latest answer:', error)
      } else if (data && data.length > 0) {
        const newMessage = data[0].message
        console.log('✅ Latest answer:', newMessage)
        
        // Only update if it's a new answer
        if (newMessage !== latestAnswer) {
          setLatestAnswer(newMessage)
          setShowAnswer(true)
          
          // Hide answer after 10 seconds
          setTimeout(() => {
            setShowAnswer(false)
          }, 10000)
        }
      } else {
        console.log('📭 No answers in database yet')
      }
    }

    fetchLatestAnswer()
    
    // Poll for updates as a fallback (every 2 seconds)
    const pollInterval = setInterval(fetchLatestAnswer, 2000)

    // Cleanup subscription
    return () => {
      console.log('🧹 Cleaning up subscription and polling')
      clearInterval(pollInterval)
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
      className="min-h-screen bg-black flex flex-col items-center justify-center p-8 cursor-pointer relative"
      onClick={toggleFullscreen}
    >
      {/* Fullscreen hint */}
      {!isFullscreen && (
        <div className="absolute top-4 right-4 text-white/50 text-sm animate-pulse">
          Click anywhere for fullscreen
        </div>
      )}

      <AnimatePresence mode="wait">
        {showAnswer && latestAnswer ? (
          /* ANSWER MODE: Show giant answer */
          <motion.div
            key={latestAnswer}
            initial={{ opacity: 0, scale: 0.3, rotateY: -180 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              rotateY: 0 
            }}
            exit={{ opacity: 0, scale: 0.3, rotateY: 180 }}
            transition={{ 
              duration: 0.8, 
              type: "spring",
              bounce: 0.5
            }}
            className="max-w-6xl w-full px-4"
          >
            <Card className="border-4 border-neon-blue bg-black/95 neon-glow shadow-2xl">
              <CardContent className="p-12 md:p-20">
                <motion.p 
                  animate={{ 
                    scale: [1, 1.05, 1],
                    textShadow: [
                      "0 0 20px #00ffff, 0 0 40px #00ffff",
                      "0 0 30px #00ffff, 0 0 60px #00ffff",
                      "0 0 20px #00ffff, 0 0 40px #00ffff"
                    ]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="text-center text-5xl md:text-7xl lg:text-9xl text-neon-blue font-bold uppercase tracking-wider leading-tight"
                >
                  {latestAnswer}
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          /* QR CODE MODE: Show 8 ball with QR inside */
          <motion.div
            key="qr-ball"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              rotateY: 0
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="flex flex-col items-center"
          >
            {/* 8 Ball with mesmerizing animation */}
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.02, 0.98, 1]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
              className="relative mb-8"
            >
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(255,255,255,0.1)",
                    "0 0 40px rgba(255,255,255,0.2)",
                    "0 0 20px rgba(255,255,255,0.1)"
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="w-[400px] h-[400px] md:w-[500px] md:h-[500px] bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-full flex items-center justify-center relative overflow-hidden shadow-2xl"
              >
                {/* Animated shine effect */}
                <motion.div 
                  animate={{
                    rotate: 360
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"
                />
                
                {/* QR Code in center (replacing the 8) */}
                <motion.div 
                  animate={{
                    scale: [1, 1.05, 1]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="w-48 h-48 md:w-56 md:h-56 bg-white rounded-full flex items-center justify-center shadow-2xl z-10"
                >
                  <QRCodeSVG 
                    value={currentUrl} 
                    size={160}
                    level="H"
                    includeMargin={false}
                  />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Instructions */}
            <motion.div
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-center"
            >
              <p className="text-white text-2xl md:text-3xl mb-2 font-bold">
                Scan to Join the Party! 🎉
              </p>
              <p className="text-white/70 text-lg">{currentUrl}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="absolute bottom-4 text-white/50 text-lg">
        Magic 8 Party ✨
      </div>
    </div>
  )
}

