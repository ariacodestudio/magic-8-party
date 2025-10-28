import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { MobilePage } from "./pages/MobilePage"
import { DisplayPage } from "./pages/DisplayPage"
import { TestPage } from "./pages/TestPage"
import { DebugPage } from "./pages/DebugPage"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MobilePage />} />
        <Route path="/display" element={<DisplayPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/debug" element={<DebugPage />} />
      </Routes>
    </Router>
  )
}

export default App

