// Components
import Dashboard from "./pages/Auth/Dashboard/Dashboard";
// Imports
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Styles

function App() {
  return (
    <BrowserRouter>
          <Routes>
            {/* Dashboard Pages */}
            <Route path="/" element={<Dashboard />} />
            {/* Dashboard */}
          </Routes>
      </BrowserRouter>
  )
}

export default App
