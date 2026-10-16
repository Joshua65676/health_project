import React from "react";
import { Logo } from "../assets";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NavBar: React.FC = () => {
  return (
    <nav className="bg-Bg p-2.5 border border-Bg shadow-soft h-16.25">
      <main className="container max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={Logo} alt="Logo" />
          <h2 className="font-semibold font-Inter text-[24px] leading-7 tracking-[-1px]">
            Medi
            <span className="text-TextColor">AI</span>
          </h2>
        </div>
        <div className="items-center gap-2 hidden md:flex">
          <Link to="/login">
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.16 }}
              className="border-BorderColor cursor-pointer rounded-[25px] border-2 h-10 w-22.75 font-Inter font-semibold text-[16px] leading-6 text-center text-BorderColor hover:bg-opacity-90 transition duration-300"
            >
              Login
            </motion.button>
          </Link>

          <Link to="/signup">
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.16 }}
              className="bg-TextColor cursor-pointer rounded-[25px] h-10 w-33.75 font-Inter font-semibold text-[16px] leading-6 text-center text-white hover:bg-opacity-90 transition duration-300"
            >
              Get Started
            </motion.button>
          </Link>
        </div>
      </main>
    </nav>
  );
};

export default NavBar;
