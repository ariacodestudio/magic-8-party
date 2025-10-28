import { QRCodeSVG } from "qrcode.react"

export function TestPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl mb-8">QR Code Test Page</h1>
      
      <div className="bg-white p-4 rounded-lg mb-4">
        <QRCodeSVG 
          value="http://localhost:5173" 
          size={200}
        />
      </div>
      
      <p className="text-green-400 text-xl">✅ If you see a QR code above, everything works!</p>
      
      <div className="mt-8 space-y-2 text-center">
        <p className="text-white/70">Now go to:</p>
        <a href="/display" className="text-neon-blue underline text-xl">
          /display
        </a>
        <p className="text-white/50">(TV view with QR code)</p>
      </div>
    </div>
  )
}
