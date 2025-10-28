import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { getRandomAnswer } from "../data/answers"
import { supabase } from "../lib/supabase"

export function MobilePage() {
  const [currentAnswer, setCurrentAnswer] = useState<string | null>(null)
  const [isShaking, setIsShaking] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const answerTimerRef = useRef<NodeJS.Timeout | null>(null)

  const askThe8Ball = async () => {
    setIsLoading(true)
    setIsShaking(true)
    setCurrentAnswer(null)

    // Get random answer
    const answer = getRandomAnswer()

    // Save to Supabase
    try {
      console.log('📝 Inserting answer:', answer)
      const { data, error } = await supabase
        .from('answers')
        .insert([{ message: answer }])
        .select()

      if (error) {
        console.error('❌ Error saving answer:', error)
        alert(`Failed to save: ${error.message}`)
      } else {
        console.log('✅ Answer saved successfully:', data)
      }
    } catch (error) {
      console.error('❌ Error connecting to Supabase:', error)
      alert('Failed to connect to database')
    }

    // Shake animation duration - building suspense!
    setTimeout(() => {
      setIsShaking(false)
    }, 3000)

    // Show answer after shake
    setTimeout(() => {
      setCurrentAnswer(answer)
      setIsLoading(false)
      
      // Reset after 10 seconds - hide answer and show 8 ball again
      answerTimerRef.current = setTimeout(() => {
        setCurrentAnswer(null)
      }, 10000) // 10 seconds
    }, 3000) // 3 seconds shake
  }

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (answerTimerRef.current) {
        clearTimeout(answerTimerRef.current)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      {/* Main Content - 8 Ball or Answer */}
      <AnimatePresence mode="wait">
        {currentAnswer ? (
          /* Answer Display - Upside Down Triangle (replaces 8 ball) */
          <div
            key={`answer-${currentAnswer}`}
            className="w-full max-w-md"
            style={{
              animation: 'answerAppear 0.8s ease-out'
            }}
          >
            <div className="relative">
              {/* Upside down triangle container */}
              <div 
                className="relative mx-auto w-64 h-64"
                style={{
                  clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)',
                  background: 'linear-gradient(135deg, rgba(41,98,255,0.1) 0%, rgba(41,98,255,0.3) 100%)',
                  boxShadow: '0 0 40px rgba(41,98,255,0.6), inset 0 0 20px rgba(41,98,255,0.2)'
                }}
              >
                {/* Text content */}
                <div className="absolute inset-0 flex items-start justify-center pt-8 px-4">
                  <p 
                    className="text-center text-white font-bold uppercase tracking-wider text-xs sm:text-sm md:text-base"
                    style={{
                      animation: 'answerPulse 2s ease-in-out infinite',
                      textShadow: '0 0 10px rgba(255,255,255,0.8)',
                      lineHeight: '1.2'
                    }}
                  >
                    {currentAnswer.split(' ').map((word, index, array) => (
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
          /* 8 Ball (normal or shaking) */
          <motion.div
            key="ball"
            className="relative"
            animate={isShaking ? "shake" : "idle"}
            variants={{
              shake: {
                x: [0, -20, 20, -20, 20, -15, 15, -20, 20, -10, 10, -15, 15, -8, 8, -5, 5, 0],
                y: [0, -10, 10, -10, 10, -8, 8, -10, 10, -5, 5, -8, 8, -3, 3, -2, 2, 0],
                rotate: [0, -5, 5, -5, 5, -4, 4, -5, 5, -3, 3, -4, 4, -2, 2, -1, 1, 0],
                transition: { duration: 3, ease: "easeInOut" }
              },
              idle: {
                x: 0,
                y: 0,
                rotate: 0
              }
            }}
          >
            <div 
              className="w-48 h-48 md:w-64 md:h-64 bg-gradient-to-br from-gray-900 to-black rounded-full flex items-center justify-center relative overflow-hidden"
              style={{
                boxShadow: isShaking 
                  ? '0 0 60px rgba(41,98,255,0.8), inset 0 0 40px rgba(41,98,255,0.3)' 
                  : '0 0 20px rgba(41,98,255,0.3)'
              }}
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"
                animate={isShaking ? { opacity: [0.1, 0.4, 0.1] } : { opacity: 0.1 }}
                transition={{ duration: 0.3, repeat: isShaking ? 10 : 0 }}
              />
              <div 
                className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center"
                style={{
                  boxShadow: isShaking 
                    ? '0 0 30px rgba(41,98,255,0.9)' 
                    : 'none'
                }}
              >
                <span className="text-black text-4xl md:text-6xl font-bold">8</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ask Button */}
      <Button
        onClick={askThe8Ball}
        disabled={isLoading}
        variant="neon"
        size="xl"
        className="font-bold uppercase tracking-wider"
      >
        {isLoading ? "🔮 Consultando os espíritos..." : "Pergunte à Bola 8"}
      </Button>

      {/* Footer */}
      <div className="absolute bottom-4 text-white/50 text-sm">
        aria.studio
      </div>
    </div>
  )
}

