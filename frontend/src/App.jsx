import { Route, Routes } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LogInPage from "./pages/LogInPage";

function App() {
  return (
    <>
      <div
        className="min-h-screen bg-gradient-to-r from-slate-900 to-slate-700
  flex items-center justify-center relative overflow-hidden"
      >
        <Routes>
          <Route path="/" element={"Home"} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LogInPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
