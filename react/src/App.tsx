import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./components/pages/Login";
import SignUp from "./components/pages/SignUp";
import ChatDashboard from "./components/dashboard/ChatDashboard";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/chatdashboard" element={<ChatDashboard />} />
    </Routes>
  );
}

export default App;
