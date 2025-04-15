// Components
import ScreenGuard from "./basics/ScreenGuard/ScreenGuard";
import Dashboard from "./pages/Auth/Dashboard/Dashboard";
import Login from "./pages/Auth/Login/Login";
import Register from "./pages/Auth/Register/Register";
import Home from "./pages/Home/Home";
import CreatePreset from "./pages/Presets/CreatePreset";
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
            <Route path="/register" element={<Register />} />
            {/* Protected Pages */}
            <Route path="/home" element={<Home />} />
            <Route path="/create-preset" element={<CreatePreset />} />

          </Routes>
      </BrowserRouter>
    </ScreenGuard>
  )
}

export default App
