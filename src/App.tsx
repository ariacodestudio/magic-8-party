import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { MobilePage } from "./pages/MobilePage"
import { DisplayPage } from "./pages/DisplayPage"
import { TestPage } from "./pages/TestPage"
import { DebugPage } from "./pages/DebugPage"
import { SupabaseDebug } from "./pages/SupabaseDebug"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MobilePage />} />
        <Route path="/display" element={<DisplayPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/debug" element={<DebugPage />} />
        <Route path="/supabase" element={<SupabaseDebug />} />
      </Routes>
    </Router>
  )
}

export default App

