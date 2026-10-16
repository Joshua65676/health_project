import React, { useState } from "react";
import { motion } from "framer-motion";
import NavBar from "../NavBar";
import { GoogleIcon, Lock, Logo, Mail, Eye, HeartIcon, EyeClose } from "../../assets";
import { Link } from "react-router-dom";

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="flex flex-col gap-8 bg-linear-to-b from-[#cfdee3] to-[#fafafa]">
      <NavBar />
      <section className="flex items-center justify-center max-h-screen container max-w-7xl mx-auto w-full">
        <motion.main
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="flex flex-col items-center justify-center px-16.5 py-8 w-119.25 rounded-2xl bg-white gap-4"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-14.75 h-14.75 rounded-lg bg-BoxBg shadow-hard flex items-center justify-center">
              <img src={Logo} alt="" className="" />
            </div>
            <h2 className="font-semibold font-Inter text-[32px] leading-10 text-center tracking-normal text-black">
              Welcome Back
            </h2>
            <p className="font-[400px] font-Inter text-[14px] leading-5 tracking-normal text-center w-77.75 text-Black">
              Sign in to access your personalized health insights and
              consultations.
            </p>
          </div>
          {/* Forms */}
          <div className="flex flex-col gap-2">
            <form className="flex flex-col gap-1 w-86.25">
              <label className="font-Inter font-[400px] text-[14px] leading-7.5 tracking-normal text-start text-Black">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Enter your email..."
                  className="w-86.25 h-12 rounded-[10px] border py-3.25 pl-12 pr-5.75 border-FormBg font-Inter font-medium text-[14px] leading-7.5 tracking-normal text-black"
                />
                <img
                  src={Mail}
                  alt=""
                  className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2"
                />
              </div>
            </form>

            <form className="flex flex-col gap-1 w-86.25">
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
                  placeholder="Enter your password"
                  className="w-86.25 h-12 rounded-[10px] border py-3.25 pl-12 pr-12 border-FormBg font-Inter font-medium text-[14px] leading-7.5 tracking-normal text-black"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {showPassword ? <img src={EyeClose} alt="" /> : <img src={Eye} alt="" />}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    id="rememberMe"
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
            </form>

            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.16 }}
              className="bg-TextColor cursor-pointer rounded-[10px] h-10 w-86.25 px-5.75 font-Inter font-medium text-[14px] leading-7.5 text-center text-white hover:bg-opacity-90 transition duration-300"
            >
              Login to MediAI
            </motion.button>
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
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.16 }}
              className="w-86.25 h-12 rounded-[10px] cursor-pointer px-5.75 bg-ButtonBg text-center font-Inter font-medium text-[14px] leading-7.5 text-black"
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
