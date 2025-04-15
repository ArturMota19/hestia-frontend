// Components
import ScreenGuard from "./basics/ScreenGuard/ScreenGuard";
// Imports
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from 'react'
import Loading from "./basics/Loading/Loading";
// Styles



function App() {
  // Lazy load the components
  const Dashboard = lazy(() => import('./pages/Auth/Dashboard/Dashboard'));
  const Login = lazy(() => import('./pages/Auth/Login/Login'));
  const Register = lazy(() => import('./pages/Auth/Register/Register'));
  const Home = lazy(() => import('./pages/Home/Home'));
  const CreatePreset = lazy(() => import('./pages/Presets/CreatePreset'));

  return (
    <ScreenGuard>
      <BrowserRouter>
        <Suspense fallback={<Loading/>}>
          <Routes>
            {/* Dashboard and Auth Pages */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Protected Pages */}
            <Route path="/home" element={<Home />} />
            <Route path="/create-preset" element={<CreatePreset />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ScreenGuard>
  )
}

export default App
