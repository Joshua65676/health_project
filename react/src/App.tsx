import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./components/pages/Login";
import SignUp from "./components/pages/SignUp";
import ChatDashboard from "./components/dashboard/ChatDashboard";
import Home from "./components/pages/Landing_Page/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/chatdashboard" element={<ChatDashboard />} />
    </Routes>
  );
}

export default App;
