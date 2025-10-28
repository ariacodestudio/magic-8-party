import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"

export function SupabaseDebug() {
  const [connectionStatus, setConnectionStatus] = useState<any>({})
  const [testResults, setTestResults] = useState<string[]>([])
  const [realtimeStatus, setRealtimeStatus] = useState("Not connected")
  const [lastMessage, setLastMessage] = useState<any>(null)

  const log = (message: string, isError = false) => {
    const timestamp = new Date().toLocaleTimeString()
    setTestResults(prev => [...prev, `[${timestamp}] ${isError ? '❌' : '✅'} ${message}`])
  }

  useEffect(() => {
    checkConnection()
    testRealtime()
  }, [])

  const checkConnection = async () => {
    log("Starting Supabase connection tests...")
    
    // Check environment variables
    const url = import.meta.env.VITE_SUPABASE_URL
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    setConnectionStatus({
      url: url ? `✅ ${url.substring(0, 30)}...` : '❌ Not found',
      key: key ? `✅ ${key.substring(0, 30)}...` : '❌ Not found',
    })

    if (!url || !key) {
      log("Environment variables missing!", true)
      return
    }

    log("Environment variables loaded successfully")

    // Test basic connection
    try {
      log("Testing database connection...")
      const { data, error } = await supabase
        .from('answers')
        .select('*')
        .limit(1)

      if (error) {
        log(`Database error: ${error.message}`, true)
        if (error.message.includes('relation "public.answers" does not exist')) {
          log("Table 'answers' doesn't exist - create it in Supabase!", true)
        }
      } else {
        log(`Database connected! Found ${data?.length || 0} answers`)
      }
    } catch (err: any) {
      log(`Connection failed: ${err.message}`, true)
    }
  }

  const testRealtime = () => {
    log("Setting up realtime subscription...")
    
    const channel = supabase
      .channel('debug-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'answers'
        },
        (payload) => {
          log(`🔔 Realtime event: ${payload.eventType}`)
          setLastMessage(payload)
        }
      )
      .subscribe((status) => {
        setRealtimeStatus(status)
        if (status === 'SUBSCRIBED') {
          log("Realtime connected successfully!")
        } else if (status === 'CHANNEL_ERROR') {
          log("Realtime connection failed - not enabled in Supabase!", true)
        } else {
          log(`Realtime status: ${status}`)
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const testInsert = async () => {
    log("Attempting to insert test data...")
    
    const testMessage = `Test: ${new Date().toLocaleString()}`
    const { data, error } = await supabase
      .from('answers')
      .insert([{ message: testMessage }])
      .select()

    if (error) {
      log(`Insert failed: ${error.message}`, true)
    } else {
      log(`Inserted successfully: ${testMessage}`)
    }
  }

  const testFetch = async () => {
    log("Fetching latest answers...")
    
    const { data, error } = await supabase
      .from('answers')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    if (error) {
      log(`Fetch failed: ${error.message}`, true)
    } else {
      log(`Fetched ${data?.length || 0} answers`)
      if (data && data.length > 0) {
        log(`Latest: "${data[0].message}"`)
      }
    }
  }

  const clearLogs = () => {
    setTestResults([])
    setLastMessage(null)
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-8 text-neon-blue">
        🔍 Supabase Connection Debug
      </h1>

      {/* Connection Status */}
      <div className="mb-8 p-6 border border-white/20 rounded-lg">
        <h2 className="text-2xl mb-4">📡 Connection Status</h2>
        <div className="space-y-2">
          <div>
            <span className="text-white/60">URL:</span> {connectionStatus.url}
          </div>
          <div>
            <span className="text-white/60">Key:</span> {connectionStatus.key}
          </div>
          <div>
            <span className="text-white/60">Realtime:</span> 
            <span className={
              realtimeStatus === 'SUBSCRIBED' ? 'text-green-400' :
              realtimeStatus === 'CHANNEL_ERROR' ? 'text-red-400' :
              'text-yellow-400'
            }> {realtimeStatus}</span>
          </div>
        </div>
      </div>

      {/* Test Actions */}
      <div className="mb-8 flex gap-4 flex-wrap">
        <button 
          onClick={checkConnection}
          className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded font-bold"
        >
          🔄 Test Connection
        </button>
        <button 
          onClick={testInsert}
          className="px-6 py-3 bg-neon-blue text-black hover:opacity-80 rounded font-bold"
        >
          📝 Test Insert
        </button>
        <button 
          onClick={testFetch}
          className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded font-bold"
        >
          📥 Test Fetch
        </button>
        <button 
          onClick={clearLogs}
          className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 rounded font-bold"
        >
          🗑️ Clear Logs
        </button>
      </div>

      {/* Test Results */}
      <div className="mb-8 p-6 border border-white/20 rounded-lg">
        <h2 className="text-2xl mb-4">📋 Test Results</h2>
        <div className="bg-black/50 p-4 rounded h-64 overflow-y-auto font-mono text-sm">
          {testResults.length === 0 ? (
            <div className="text-white/50">Click buttons above to start testing...</div>
          ) : (
            testResults.map((result, i) => (
              <div 
                key={i} 
                className={result.includes('❌') ? 'text-red-400' : 'text-green-400'}
              >
                {result}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Last Realtime Message */}
      {lastMessage && (
        <div className="mb-8 p-6 border border-neon-blue rounded-lg">
          <h2 className="text-2xl mb-4">🔔 Last Realtime Event</h2>
          <pre className="text-xs overflow-x-auto">
            {JSON.stringify(lastMessage, null, 2)}
          </pre>
        </div>
      )}

      {/* Instructions */}
      <div className="p-6 border border-yellow-500/50 rounded-lg bg-yellow-500/10">
        <h2 className="text-2xl mb-4 text-yellow-400">⚠️ How to Fix Common Issues</h2>
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-bold text-yellow-300">1. "Environment variables missing"</h3>
            <p>→ Create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY</p>
            <p>→ In Netlify: Add these to Site settings → Environment variables</p>
          </div>
          
          <div>
            <h3 className="font-bold text-yellow-300">2. "Table doesn't exist"</h3>
            <p>→ Go to Supabase SQL Editor and run:</p>
            <code className="block mt-1 p-2 bg-black/50 rounded">
              CREATE TABLE answers (id uuid DEFAULT gen_random_uuid() PRIMARY KEY, message text, created_at timestamptz DEFAULT now());
            </code>
          </div>
          
          <div>
            <h3 className="font-bold text-yellow-300">3. "Realtime CHANNEL_ERROR"</h3>
            <p>→ Enable realtime in Supabase SQL Editor:</p>
            <code className="block mt-1 p-2 bg-black/50 rounded">
              ALTER PUBLICATION supabase_realtime ADD TABLE answers;
            </code>
          </div>

          <div>
            <h3 className="font-bold text-yellow-300">4. "Insert failed: new row violates row-level security"</h3>
            <p>→ Enable public access in Supabase SQL Editor:</p>
            <code className="block mt-1 p-2 bg-black/50 rounded">
              ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
              CREATE POLICY "Allow all" ON answers FOR ALL USING (true);
            </code>
          </div>
        </div>
      </div>
    </div>
  )
}
