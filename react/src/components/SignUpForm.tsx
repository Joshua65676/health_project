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
import { Link, useNavigate } from "react-router-dom";
import { getAuthErrorMessage, googleAuthUrl, signUp } from "../auth";

const SignUpForm: React.FC = () => {
  const navigate = useNavigate();
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
      await signUp(name, email, password);
      navigate("/check-email", { state: { email: email.trim() } });
    } catch (error) {
      setFeedback(getAuthErrorMessage(error));
      setFeedbackIsError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="flex w-full flex-col items-center justify-center px-0 py-2 sm:px-4 sm:py-4">
      <section className="flex w-full items-center justify-center">
        <motion.main
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="flex w-full max-w-119.25 flex-col items-center justify-center gap-4 rounded-2xl bg-white px-4 py-6 sm:px-8 sm:py-8 lg:px-16.5"
        >
          <div className="flex w-full flex-col items-start gap-2">
            <h2 className="font-semibold font-Inter text-[32px] leading-10 text-start tracking-normal text-black">
              Create Account
            </h2>
            <p className="w-full max-w-77.75 text-start font-[400px] font-Inter text-[14px] leading-5 tracking-normal text-Black">
              Start your journey towards better health today.
            </p>
          </div>
          {/* Forms */}
          <div className="flex w-full flex-col gap-2">
            <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2">
              <div className="flex w-full flex-col gap-1">
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
                    className="h-12 w-full rounded-[10px] border border-FormBg py-3.25 pl-12 pr-5.75 font-Inter text-[14px] font-medium leading-7.5 tracking-normal text-black"
                  />
                  <img
                    src={Person}
                    alt=""
                    className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2"
                  />
                </div>
              </div>

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
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className="h-12 w-full rounded-[10px] border border-FormBg py-3.25 pl-12 pr-12 font-Inter text-[14px] font-medium leading-7.5 tracking-normal text-black"
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
                className="h-10 w-full cursor-pointer rounded-[10px] bg-TextColor px-5.75 text-center font-Inter text-[14px] font-medium leading-7.5 text-white transition duration-300 hover:bg-opacity-90 disabled:cursor-wait disabled:opacity-60"
              >
                <span className="flex items-center justify-center gap-2">
                  {busy ? "Creating account..." : "Create Account"}
                  <img src={ArrowRight} alt="" />
                </span>
              </motion.button>
              {feedback && (
                <p
                  role={feedbackIsError ? "alert" : "status"}
                  className={`w-full text-sm ${feedbackIsError ? "text-red-700" : "text-green-800"}`}
                >
                  {feedback}
                </p>
              )}
            </form>
          </div>
          {/* Contiune */}
          <div className="flex w-full flex-col gap-2">
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
