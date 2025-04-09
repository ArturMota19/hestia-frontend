// Components
import ScreenGuard from "./basics/ScreenGuard/ScreenGuard";
import Dashboard from "./pages/Auth/Dashboard/Dashboard";
import Login from "./pages/Auth/Login/Login";
// Imports
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Styles



function App() {
  return (
    <ScreenGuard>
      <BrowserRouter>
          <Routes>
            {/* Dashboard and Auth Pages */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Dashboard />} />
            {/* XXX Pages */}
          </Routes>
      </BrowserRouter>
    </ScreenGuard>
  )
}

export default App
