import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"

export function DebugPage() {
  const [status, setStatus] = useState<string[]>([])
  const [answers, setAnswers] = useState<any[]>([])
  
  const addStatus = (msg: string) => {
    setStatus(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`])
  }

  useEffect(() => {
    addStatus("🔌 Setting up real-time subscription...")
    
    const channel = supabase
      .channel('debug-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'answers'
        },
        (payload) => {
          addStatus(`✅ Real-time event received: ${payload.eventType}`)
          console.log('Payload:', payload)
          fetchAnswers()
        }
      )
      .subscribe((status) => {
        addStatus(`📡 Subscription status: ${status}`)
      })

    fetchAnswers()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchAnswers = async () => {
    addStatus("📥 Fetching answers from database...")
    const { data, error } = await supabase
      .from('answers')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      addStatus(`❌ Error: ${error.message}`)
    } else {
      addStatus(`✅ Fetched ${data?.length || 0} answers`)
      setAnswers(data || [])
    }
  }

  const testInsert = async () => {
    addStatus("📝 Inserting test answer...")
    const { error } = await supabase
      .from('answers')
      .insert([{ message: `Test at ${new Date().toLocaleTimeString()}` }])

    if (error) {
      addStatus(`❌ Insert failed: ${error.message}`)
    } else {
      addStatus("✅ Insert successful")
      fetchAnswers()
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl mb-8 text-neon-blue">🔍 Debug Real-time Sync</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Status Log */}
        <div className="border border-white/20 rounded-lg p-4">
          <h2 className="text-2xl mb-4">📊 Status Log</h2>
          <div className="bg-black/50 p-4 rounded h-64 overflow-y-auto font-mono text-sm space-y-1">
            {status.map((s, i) => (
              <div key={i} className={
                s.includes('❌') ? 'text-red-400' : 
                s.includes('✅') ? 'text-green-400' : 
                'text-white/70'
              }>
                {s}
              </div>
            ))}
          </div>
        </div>

        {/* Answers */}
        <div className="border border-white/20 rounded-lg p-4">
          <h2 className="text-2xl mb-4">💬 Recent Answers</h2>
          <div className="bg-black/50 p-4 rounded h-64 overflow-y-auto space-y-2">
            {answers.length === 0 ? (
              <p className="text-white/50">No answers yet...</p>
            ) : (
              answers.map((answer) => (
                <div key={answer.id} className="border border-neon-blue/30 p-2 rounded">
                  <p className="text-neon-blue">{answer.message}</p>
                  <p className="text-xs text-white/50">
                    {new Date(answer.created_at).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={testInsert}
          className="bg-neon-blue text-black px-6 py-3 rounded font-bold hover:opacity-80"
        >
          🧪 Test Insert
        </button>
        <button
          onClick={fetchAnswers}
          className="bg-white/20 text-white px-6 py-3 rounded font-bold hover:bg-white/30"
        >
          🔄 Refresh
        </button>
      </div>

      <div className="mt-8 p-4 border border-yellow-500/50 rounded bg-yellow-500/10">
        <h3 className="text-yellow-400 font-bold mb-2">⚠️ Troubleshooting</h3>
        <ul className="text-sm space-y-1 text-white/70">
          <li>• If subscription status is "SUBSCRIBED" = ✅ Good</li>
          <li>• If you see "CHANNEL_ERROR" = ❌ Realtime not enabled</li>
          <li>• Click "Test Insert" - you should see a real-time event</li>
          <li>• Open this page in 2 tabs - insert in one, watch the other update</li>
        </ul>
      </div>
    </div>
  )
}
