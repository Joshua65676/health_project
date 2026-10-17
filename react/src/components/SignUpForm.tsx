import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  GoogleIcon,
  Lock,
  Mail,
  Eye,
  Person,
  ArrowRight,
  EyeClose,
} from "../assets";
import { Link } from "react-router-dom";
import { googleAuthUrl, signUp } from "../auth";

const SignUpForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackIsError, setFeedbackIsError] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setFeedback("");
    setFeedbackIsError(false);

    try {
      const result = await signUp(name, email, password);
      setFeedback(
        result.message || "Check your email for a confirmation link.",
      );
      setPassword("");
    } catch (error) {
      setFeedback(
        error instanceof Error
          ? error.message
          : "Signup failed. Please try again.",
      );
      setFeedbackIsError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-8 mb-8 bg-linear-to-b from-[#cfdee3] to-[#fafafa]">
      <section className="flex items-center justify-center">
        <motion.main
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="flex flex-col items-center justify-center px-16.5 py-8 w-119.25 rounded-2xl bg-white gap-4"
        >
          <div className="flex flex-col items-start gap-2">
            <h2 className="font-semibold font-Inter text-[32px] leading-10 text-start tracking-normal text-black">
              Create Account
            </h2>
            <p className="font-[400px] font-Inter text-[14px] leading-5 tracking-normal text-start w-77.75 text-Black">
              Start your journey towards better health today.
            </p>
          </div>
          {/* Forms */}
          <div className="flex flex-col gap-2">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <div className="flex flex-col gap-1 w-86.25">
                <label className="font-Inter font-[400px] text-[14px] leading-7.5 tracking-normal text-start text-Black">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Enter your full name"
                    className="w-86.25 h-12 rounded-[10px] border py-3.25 pl-12 pr-5.75 border-FormBg font-Inter font-medium text-[14px] leading-7.5 tracking-normal text-black"
                  />
                  <img
                    src={Person}
                    alt=""
                    className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1 w-86.25">
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
                    className="w-86.25 h-12 rounded-[10px] border py-3.25 pl-12 pr-5.75 border-FormBg font-Inter font-medium text-[14px] leading-7.5 tracking-normal text-black"
                  />
                  <img
                    src={Mail}
                    alt=""
                    className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1 w-86.25">
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
                    minLength={8}
                    maxLength={72}
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className="w-86.25 h-12 rounded-[10px] border py-3.25 pl-12 pr-12 border-FormBg font-Inter font-medium text-[14px] leading-7.5 tracking-normal text-black"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
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
                <div>
                  <span className="font-Inter font-[400px] text-[12px] leading-7.5 tracking-normal text-start text-Black">
                    Use at least 8 characters.
                  </span>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={busy}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.16 }}
                className="bg-TextColor cursor-pointer rounded-[10px] h-10 w-86.25 px-5.75 font-Inter font-medium text-[14px] leading-7.5 text-center text-white hover:bg-opacity-90 transition duration-300 disabled:cursor-wait disabled:opacity-60"
              >
                <span className="flex items-center justify-center gap-2">
                  {busy ? "Creating account..." : "Create Account"}
                  <img src={ArrowRight} alt="" />
                </span>
              </motion.button>
              {feedback && (
                <p
                  role={feedbackIsError ? "alert" : "status"}
                  className={`w-86.25 text-sm ${feedbackIsError ? "text-red-700" : "text-green-800"}`}
                >
                  {feedback}
                </p>
              )}
            </form>
          </div>
          {/* Contiune */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-row w-86.25 items-center justify-between">
              <hr className="w-25 border border-FormBg" />
              <span className="font-Inter font-[400px] text-[12px] leading-7.5 text-Black">
                Or continue with
              </span>
              <hr className="w-25 border border-FormBg" />
            </div>

            <motion.button
              type="button"
              onClick={() => window.location.assign(googleAuthUrl)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.16 }}
              className="w-86.25 h-12 rounded-[10px] cursor-pointer px-5.75 bg-ButtonBg text-center font-Inter font-medium text-[14px] leading-7.5 text-black"
            >
              <img src={GoogleIcon} alt="" className="inline-block" />
              Sign in with Google
            </motion.button>
            <span className="font-Inter font-[400px] text-[12px] leading-7.5 text-center text-Black">
              Already have an account?
              <Link to="/login" className="text-[13px] text-TextColor">
                Login
              </Link>
            </span>
          </div>
        </motion.main>
      </section>
    </section>
  );
};

export default SignUpForm;
