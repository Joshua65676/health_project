import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  FaceBook,
  Instagram,
  Logo,
  Tiwtter,
  VectorSend,
} from "../../../assets";
import { Link } from "react-router-dom";
import { FOOTER_COLUMNS } from "../../../constants";

const Footer: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={{
        opacity: shouldReduceMotion ? 1 : 0,
        y: shouldReduceMotion ? 0 : 18,
      }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: "easeOut" }}
      className="w-full bg-white"
    >
      <main className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-5 lg:gap-8 lg:px-8 lg:py-12">
        <div className="flex flex-col items-start gap-2.5 sm:col-span-2 lg:col-span-1">
          <div className="flex flex-row items-center gap-2">
            <img src={Logo} alt="" className="w-5.75 h-5" />
            <h2 className="font-Inter font-semibold text-[20px] leading-7 tracking-normal text-TextBlack text-center">
              Medi<span className="text-TextColor">AI</span>
            </h2>
          </div>
          <p className="w-full max-w-72 font-Inter text-sm font-normal leading-6 tracking-[-0.35px] text-Black">
            Your AI Health Assistant for smart, personalized, and private
            healthcare support.
          </p>
          <div className="flex flex-row items-center gap-2.5">
            <Link to="/">
              <img src={FaceBook} alt="" />
            </Link>
            <Link to="/">
              <img src={Tiwtter} alt="" />
            </Link>
            <Link to="/">
              <img src={Instagram} alt="" />
            </Link>
          </div>
        </div>

        {/* List */}
        <div className="grid grid-cols-2 items-start gap-6 sm:col-span-2 sm:grid-cols-3 sm:gap-8 lg:col-span-3">
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title} className="min-w-0">
              <h4 className="font-Inter font-medium text-base leading-5 text-black tracking-[-0.35px]">
                {column.title}
              </h4>
              <ul className="mt-4 flex flex-col gap-3 items-start">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="font-Inter text-sm font-normal leading-5 tracking-[-0.35px] text-Black transition-colors hover:text-black"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex min-w-0 flex-col items-start gap-2.5 sm:col-span-2 lg:col-span-1">
          <h2 className="font-Inter font-medium text-base leading-5 tracking-[-0.35px] text-black">
            Stay Updated
          </h2>
          <p className="w-full max-w-60 font-Inter text-sm font-normal leading-5.5 tracking-[-0.35px] text-Black">
            Subscribe to get Health tips and updates from MediAI.
          </p>

          <form className="flex w-full max-w-sm items-center gap-2">
            <input
              type="email"
              placeholder="Enter your email..."
              className="h-7.25 w-49.5 flex-1 rounded-[10px] border border-TextColor px-3 font-Inter text-sm text-Black placeholder:text-Black/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-TextColor sm:px-4"
            />
            <button
              type="button"
              aria-label="Subscribe"
              className="flex h-7.25 w-7.25 shrink-0 cursor-pointer items-center justify-center rounded-[5px] bg-TextColor transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-TextColor"
            >
              <img src={VectorSend} alt="" />
            </button>
          </form>
        </div>
      </main>
    </motion.section>
  );
};

export default Footer;
