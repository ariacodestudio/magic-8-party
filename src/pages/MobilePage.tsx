import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "../components/ui/button"
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
                clipPath: 'polygon(50% 100%, 0% 13.4%, 100% 13.4%)',
                background: 'linear-gradient(135deg, rgba(41,98,255,0.1) 0%, rgba(41,98,255,0.3) 100%)',
                boxShadow: '0 0 40px rgba(41,98,255,0.6), inset 0 0 20px rgba(41,98,255,0.2)',
                animation: 'flash 2s ease-out'
              }}
              >
                {/* Text content */}
                <div className="absolute inset-0 flex items-center justify-center px-4">
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
          /* 8 Ball (normal or shaking) - Refined and polished */
          <motion.div
            key="ball"
            className="relative"
            animate={isShaking ? "shake" : "idle"}
            variants={{
              shake: {
                x: [0, -15, 18, -12, 16, -8, 14, -6, 12, -4, 8, -2, 4, -1, 2, 0],
                y: [0, -8, 10, -6, 8, -4, 6, -3, 4, -2, 3, -1, 2, 0, 1, 0],
                rotate: [0, -3, 4, -2, 3, -1, 2, -1, 1, -0.5, 1, -0.3, 0.5, -0.2, 0.3, 0],
                scale: [1, 1.02, 0.98, 1.01, 0.99, 1.005, 0.995, 1.002, 0.998, 1.001, 0.999, 1],
                transition: { 
                  duration: 3, 
                  ease: [0.25, 0.46, 0.45, 0.94],
                  times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.85, 0.9, 0.95, 0.97, 0.99, 0.995, 1]
                }
              },
              idle: {
                x: 0,
                y: 0,
                rotate: 0,
                scale: 1,
                transition: { duration: 0.5, ease: "easeOut" }
              }
            }}
          >
            <div 
              className="w-48 h-48 md:w-64 md:h-64 rounded-full flex items-center justify-center relative overflow-hidden"
              style={{
                background: '#000000',
                boxShadow: isShaking 
                  ? '0 0 60px rgba(41,98,255,0.8), 0 0 100px rgba(41,98,255,0.4), inset 0 0 20px rgba(41,98,255,0.2)' 
                  : '0 0 20px rgba(41,98,255,0.3)',
                transition: 'box-shadow 0.3s ease-out'
              }}
            >
              <motion.div 
                className="absolute inset-0 bg-white"
                animate={isShaking ? { 
                  opacity: [0.05, 0.2, 0.1, 0.25, 0.08, 0.3, 0.06, 0.2, 0.04, 0.15, 0.02, 0.05],
                  scale: [1, 1.1, 0.9, 1.05, 0.95, 1.02, 0.98, 1.01, 0.99, 1.005, 0.995, 1]
                } : { 
                  opacity: 0.05,
                  scale: 1
                }}
                transition={{ 
                  duration: 3, 
                  ease: "easeInOut",
                  repeat: isShaking ? 0 : 0
                }}
              />
              <div 
                className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center"
                style={{
                  boxShadow: isShaking 
                    ? '0 0 30px rgba(41,98,255,0.9), 0 0 50px rgba(41,98,255,0.6)' 
                    : 'none',
                  transition: 'box-shadow 0.3s ease-out'
                }}
              >
                <motion.span 
                  className="text-black text-4xl md:text-6xl font-bold"
                  animate={isShaking ? {
                    scale: [1, 1.05, 0.95, 1.02, 0.98, 1.01, 0.99, 1.005, 0.995, 1],
                    rotate: [0, 2, -2, 1, -1, 0.5, -0.5, 0.2, -0.2, 0]
                  } : {
                    scale: 1,
                    rotate: 0
                  }}
                  transition={{ 
                    duration: 3, 
                    ease: "easeInOut"
                  }}
                >
                  8
                </motion.span>
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
        className="font-bold uppercase tracking-wider mt-16"
      >
        {isLoading ? " Consultando os espíritos..." : "Pergunte à Bola 8"}
      </Button>

      {/* Footer */}
      <div className="absolute bottom-4 text-white/50 text-sm">
        aria.studio
      </div>
    </div>
  )
}

