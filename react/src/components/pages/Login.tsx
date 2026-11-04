import React, { useState } from "react";
import { motion } from "framer-motion";
import NavBar from "../NavBar";
import {
  GoogleIcon,
  Lock,
  Logo,
  Mail,
  Eye,
  HeartIcon,
  EyeClose,
} from "../../assets";
import { Link } from "react-router-dom";
import { authCallbackUrl, googleAuthUrl, signIn } from "../../auth";

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setFeedback("");

    try {
      await signIn(email, password, remember);
      window.location.assign(authCallbackUrl);
    } catch (error) {
      setFeedback(
        error instanceof Error
          ? error.message
          : "Login failed. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="flex min-h-screen flex-col gap-4 bg-linear-to-b from-[#cfdee3] to-[#fafafa] sm:gap-8">
      <NavBar />
      <section className="container mx-auto flex w-full flex-1 items-center justify-center px-4 py-4 sm:max-w-7xl sm:px-6 sm:py-8">
        <motion.main
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="flex w-full max-w-119.25 flex-col items-center justify-center gap-4 rounded-2xl bg-white px-4 py-6 sm:px-8 sm:py-8 lg:px-16.5"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-14.75 h-14.75 rounded-lg bg-BoxBg shadow-hard flex items-center justify-center">
              <img src={Logo} alt="" className="" />
            </div>
            <h2 className="font-semibold font-Inter text-[32px] leading-10 text-center tracking-normal text-black">
              Welcome Back
            </h2>
            <p className="w-full max-w-77.75 text-center font-[400px] font-Inter text-[14px] leading-5 tracking-normal text-Black">
              Sign in to access your personalized health insights and
              consultations.
            </p>
          </div>
          {/* Forms */}
          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2">
            <div className="flex w-full flex-col gap-1">
              <label className="font-Inter font-[400px] text-[14px] leading-7.5 tracking-normal text-start text-Black">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email..."
                  className="h-12 w-full rounded-[10px] border border-FormBg py-3.25 pl-12 pr-5.75 font-Inter text-[14px] font-medium leading-7.5 tracking-normal text-black"
                />
                <img
                  src={Mail}
                  alt=""
                  className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2"
                />
              </div>
            </div>

            <div className="flex w-full flex-col gap-1">
              <label className="font-Inter font-[400px] text-[14px] leading-7.5 tracking-normal text-start text-Black">
                Password
              </label>
              <div className="relative">
                <img
                  src={Lock}
                  alt=""
                  className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="h-12 w-full rounded-[10px] border border-FormBg py-3.25 pl-12 pr-12 font-Inter text-[14px] font-medium leading-7.5 tracking-normal text-black"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {showPassword ? (
                    <img src={EyeClose} alt="" />
                  ) : (
                    <img src={Eye} alt="" />
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={remember}
                    onChange={(event) => setRemember(event.target.checked)}
                    className="h-4 w-4 cursor-pointer accent-TextColor"
                  />
                  <label
                    htmlFor="rememberMe"
                    className="font-Inter font-[400px] cursor-pointer text-[13px] leading-7.5 tracking-normal text-Black"
                  >
                    Remember Login
                  </label>
                </div>
                <span className="font-Inter font-[400px] text-[14px] leading-7.5 tracking-normal text-start text-TextColor cursor-pointer">
                  Forgot Password?
                </span>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={busy}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.16 }}
              className="h-10 w-full cursor-pointer rounded-[10px] bg-TextColor px-5.75 text-center font-Inter text-[14px] font-medium leading-7.5 text-white transition duration-300 hover:bg-opacity-90 disabled:cursor-wait disabled:opacity-60"
            >
              {busy ? "Signing in..." : "Login to MediAI"}
            </motion.button>
            {feedback && (
              <p role="alert" className="w-full text-sm text-red-700">
                {feedback}
              </p>
            )}
          </form>
          {/* Contiune */}
          <div className="flex flex-col gap-2">
            <div className="flex w-full items-center justify-between gap-2">
              <hr className="w-25 flex-1 border border-FormBg" />
              <span className="font-Inter font-[400px] text-[12px] leading-7.5 text-Black">
                Or continue with
              </span>
              <hr className="w-25 flex-1 border border-FormBg" />
            </div>

            <motion.button
              type="button"
              onClick={() => window.location.assign(googleAuthUrl)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.16 }}
              className="h-12 w-full cursor-pointer rounded-[10px] bg-ButtonBg px-5.75 text-center font-Inter text-[14px] font-medium leading-7.5 text-black"
            >
              <img src={GoogleIcon} alt="" className="inline-block" />
              Sign in with Google
            </motion.button>
            <span className="font-Inter font-[400px] text-[12px] leading-7.5 text-center text-Black">
              New here?
              <Link to="/signup" className="text-[13px] text-TextColor">
                Create account
              </Link>
            </span>
          </div>
        </motion.main>

        <div className="absolute right-0 top-10 hidden md:flex">
          <img src={HeartIcon} alt="" />
        </div>
      </section>
    </section>
  );
};

export default Login;
