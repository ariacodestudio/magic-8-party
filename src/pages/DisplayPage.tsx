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
          const newAnswer = payload.new as Answer
          setLatestAnswer(newAnswer.message)
        }
      )
      .subscribe()

    // Fetch the latest answer on mount
    const fetchLatestAnswer = async () => {
      const { data, error } = await supabase
        .from('answers')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)

      if (error) {
        console.error('Error fetching latest answer:', error)
      } else if (data && data.length > 0) {
        setLatestAnswer(data[0].message)
      }
    }

    fetchLatestAnswer()

    // Cleanup subscription
    return () => {
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
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="mb-16 max-w-4xl w-full"
          >
            <Card className="border-2 border-neon-blue bg-black/90 neon-glow">
              <CardContent className="p-12">
                <p className="text-center text-4xl md:text-6xl text-neon-blue text-neon-glow font-bold uppercase tracking-wider">
                  {latestAnswer}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="mb-16 h-32 flex items-center">
            <p className="text-white/50 text-2xl">Waiting for the first question...</p>
          </div>
        )}
      </AnimatePresence>

      {/* QR Code Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col items-center space-y-4"
      >
        <div className="bg-white p-4 rounded-lg">
          <QRCodeSVG 
            value={currentUrl} 
            size={200}
            level="M"
            includeMargin={true}
          />
        </div>
        <div className="text-center">
          <p className="text-white text-xl mb-2">Scan to join the party!</p>
          <p className="text-white/70 text-lg">{currentUrl}</p>
        </div>
      </motion.div>

      {/* Footer */}
      <div className="absolute bottom-4 text-white/50 text-lg">
        Magic 8 Party ✨
      </div>
    </div>
  )
}

