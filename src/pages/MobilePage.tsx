import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { getRandomAnswer } from "../data/answers"
import { supabase } from "../lib/supabase"

export function MobilePage() {
  const [currentAnswer, setCurrentAnswer] = useState<string | null>(null)
  const [isShaking, setIsShaking] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const askThe8Ball = async () => {
    setIsLoading(true)
    setIsShaking(true)
    setCurrentAnswer(null)

    // Shake animation duration
    setTimeout(() => {
      setIsShaking(false)
    }, 500)

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

    // Show answer after shake
    setTimeout(() => {
      setCurrentAnswer(answer)
      setIsLoading(false)
    }, 600)
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      {/* 8 Ball */}
      <motion.div
        className="relative mb-12"
        animate={isShaking ? "shake" : "idle"}
        variants={{
          shake: {
            x: [0, -10, 10, -10, 10, 0],
            transition: { duration: 0.5 }
          },
          idle: {
            x: 0
          }
        }}
      >
        <div className="w-48 h-48 md:w-64 md:h-64 bg-gradient-to-br from-gray-900 to-black rounded-full flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"></div>
          <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center">
            <span className="text-black text-4xl md:text-6xl font-bold">8</span>
          </div>
        </div>
      </motion.div>

      {/* Answer Display */}
      <AnimatePresence mode="wait">
        {currentAnswer && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-8 max-w-md w-full"
          >
            <Card className="border-neon-blue/50 bg-black/80">
              <CardContent className="p-6">
                <p className="text-center text-xl md:text-2xl text-neon-blue text-neon-glow font-semibold">
                  {currentAnswer}
                </p>
              </CardContent>
            </Card>
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
        {isLoading ? "Consulting the spirits..." : "Ask the 8 Ball"}
      </Button>

      {/* Footer */}
      <div className="absolute bottom-4 text-white/50 text-sm">
        Magic 8 Party ✨
      </div>
    </div>
  )
}

