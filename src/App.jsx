// Components
import ScreenGuard from "./basics/ScreenGuard/ScreenGuard";
// Imports
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Loading from "./basics/Loading/Loading";
import { Toaster } from "react-hot-toast";
// Styles

function App() {
  // Lazy load the components
  const Dashboard = lazy(() => import("./pages/Auth/Dashboard/Dashboard"));
  const Login = lazy(() => import("./pages/Auth/Login/Login"));
  const Register = lazy(() => import("./pages/Auth/Register/Register"));
  const Home = lazy(() => import("./pages/Home/Home"));
  const CreatePreset = lazy(() =>
    import("./pages/Presets/CreatePreset/CreatePreset")
  );
  const ViewPreset = lazy(() =>
    import("./pages/Presets/ViewPreset/ViewPreset")
  );
  const CreateParams = lazy(() =>
    import("./pages/Params/CreateParams/CreateParams")
  );
  const ViewParams = lazy(() => import("./pages/Params/ViewParams/ViewParams"));
  const CreateRoutine = lazy(() =>
    import("./pages/Routines/CreateRoutine/CreateRoutine")
  );
  const ViewRoutines = lazy(() => import("./pages/Routines/ViewRoutines/ViewRoutines"))

  return (
    <ScreenGuard>
      <Toaster />
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Dashboard and Auth Pages */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Protected Pages */}
            <Route path="/home" element={<Home />} />
            {/* Presets Routes */}
            <Route path="/create-presets" element={<CreatePreset />} />
            <Route path="/view-presets" element={<ViewPreset />} />
            {/* Params Routes */}
            <Route path="/create-params" element={<CreateParams />} />
            <Route path="/view-params" element={<ViewParams />} />
            {/* Routines Routes */}
            <Route path="/create-routines" element={<CreateRoutine />} />
            <Route path="/view-routines" element={<ViewRoutines />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ScreenGuard>
  );
}

export default App;
