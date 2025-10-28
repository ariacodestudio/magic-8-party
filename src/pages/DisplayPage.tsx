import { useState, useEffect } from "react"
import { QRCodeSVG } from "qrcode.react"
import { motion, AnimatePresence } from "framer-motion"
import { supabase, type Answer } from "../lib/supabase"
import { Card, CardContent } from "../components/ui/card"

export function DisplayPage() {
  const [latestAnswer, setLatestAnswer] = useState<string | null>(null)
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
        console.log('✅ Latest answer:', data[0].message)
        setLatestAnswer(data[0].message)
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
      className="min-h-screen bg-black flex flex-col items-center justify-center p-8 cursor-pointer"
      onClick={toggleFullscreen}
    >
      {/* Fullscreen hint */}
      {!isFullscreen && (
        <div className="absolute top-4 right-4 text-white/50 text-sm animate-pulse">
          Click anywhere for fullscreen
        </div>
      )}

      {/* Large 8 Ball */}
      <motion.div
        className="relative mb-16"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
      >
        <div className="w-80 h-80 md:w-96 md:h-96 bg-gradient-to-br from-gray-900 to-black rounded-full flex items-center justify-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"></div>
          <div className="w-40 h-40 md:w-48 md:h-48 bg-white rounded-full flex items-center justify-center">
            <span className="text-black text-7xl md:text-8xl font-bold">8</span>
          </div>
        </div>
      </motion.div>

      {/* Answer Display */}
      <AnimatePresence mode="wait">
        {latestAnswer ? (
          <motion.div
            key={latestAnswer}
            initial={{ opacity: 0, y: 50, scale: 0.5, rotate: -10 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1, 
              rotate: 0 
            }}
            exit={{ opacity: 0, y: -50, scale: 0.5, rotate: 10 }}
            transition={{ 
              duration: 0.6, 
              type: "spring",
              bounce: 0.4
            }}
            className="mb-12 max-w-5xl w-full px-4"
          >
            <Card className="border-4 border-neon-blue bg-black/95 neon-glow shadow-2xl">
              <CardContent className="p-8 md:p-16">
                <motion.p 
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    duration: 0.3,
                    repeat: Infinity,
                    repeatType: "reverse",
                    repeatDelay: 2
                  }}
                  className="text-center text-4xl md:text-7xl lg:text-8xl text-neon-blue text-neon-glow font-bold uppercase tracking-wider leading-tight"
                >
                  {latestAnswer}
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-16 h-32 flex items-center"
          >
            <p className="text-white/50 text-3xl animate-pulse">Waiting for the first question...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Code Section - Fades out when answers appear */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: latestAnswer ? 0.3 : 1,
          scale: latestAnswer ? 0.7 : 1,
          y: latestAnswer ? 20 : 0
        }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center space-y-4"
      >
        <div className="bg-white p-4 rounded-lg">
          <QRCodeSVG 
            value={currentUrl} 
            size={latestAnswer ? 150 : 200}
            level="M"
            includeMargin={true}
          />
        </div>
        <div className="text-center">
          <p className={`text-white text-xl mb-2 ${latestAnswer ? 'text-base' : ''}`}>
            {latestAnswer ? 'Scan to play!' : 'Scan to join the party!'}
          </p>
          {!latestAnswer && <p className="text-white/70 text-lg">{currentUrl}</p>}
        </div>
      </motion.div>

      {/* Footer */}
      <div className="absolute bottom-4 text-white/50 text-lg">
        Magic 8 Party ✨
      </div>
    </div>
  )
}

