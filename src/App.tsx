import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { MobilePage } from "./pages/MobilePage"
import { DisplayPage } from "./pages/DisplayPage"
import { TestPage } from "./pages/TestPage"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MobilePage />} />
        <Route path="/display" element={<DisplayPage />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </Router>
  )
}

export default App

