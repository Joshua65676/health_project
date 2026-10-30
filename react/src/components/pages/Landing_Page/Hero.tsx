import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BgImage, Chat, Sparkle } from "../../../assets";
import { HeroList } from "../../../constants";
import { Link } from "react-router-dom";

const Hero: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const entrance = (delay: number) => ({
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: shouldReduceMotion ? 0 : 0.55, delay },
  });

  return (
    <section
      id="hero"
      className="relative isolate mt-20 min-h-[calc(100svh-5rem)] overflow-hidden bg-[#e9e9e4]"
    >
      {/* Background image */}
      <img
        src={BgImage}
        alt=""
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[68%_center] lg:object-right"
      />

      {/* Gradient fade: solid on the left, transparent on the right */}
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-[#e9e9e4]/90 via-[#e9e9e4]/45 to-transparent" />
      <div className="absolute inset-0 -z-10 bg-[#e9e9e4]/25 sm:bg-transparent" />
      <div className="mx-auto flex min-h-[calc(100svh-5rem)] w-full max-w-7xl flex-col items-start justify-center gap-10 px-5 py-14 sm:gap-12 sm:px-8 sm:py-16 lg:gap-10 lg:px-10 lg:py-25">
        <motion.div
          {...entrance(0)}
          className="flex w-full flex-col items-start gap-5"
        >
          <div className="inline-flex min-h-8.5 max-w-full items-center gap-1.5 rounded-[10px] bg-LightGreen px-2.5 py-1 text-center">
            <img src={Sparkle} alt="" className="inline-block" />
            <span className="font-Inter text-[13px] font-semibold leading-6 tracking-normal text-TextColor sm:text-[15px]">
              Your AI Health Assistance
            </span>
          </div>

          <h2 className="w-full max-w-4xl lg:max-w-180 font-Inter text-4xl font-bold leading-[1.08] text-TextBlack sm:text-5xl lg:text-7xl">
            Describe Your Symptoms.{" "}
            <span className="text-TextColor">Get Instant Guidance.</span>
          </h2>

          <p className="w-full max-w-xl font-Inter text-base font-semibold leading-7 text-LightBlack sm:text-lg lg:w-117.5">
            Talk to our AI health assistance, get real-time insights about your
            health, and receive personalized recommendation on the next step.
          </p>
        </motion.div>

        <motion.div
          {...entrance(0.12)}
          className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-start"
        >
          <Link to="/login">
            <button className="flex h-14 w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full bg-TextColor px-6 py-4 text-center font-Inter text-base font-semibold leading-6 text-white shadow-button transition-transform hover:-translate-y-0.5 sm:w-57.5 sm:px-8">
              <img src={Chat} alt="" className="inline-block" />
              Start Chat Now
            </button>
          </Link>

          <button className="h-14 w-full whitespace-nowrap rounded-full border-2 border-FormBg px-6 py-4 text-center font-Inter text-base font-semibold leading-6 text-black shadow-button transition-colors hover:bg-white/50 sm:w-57.5 sm:px-8">
            Learn Our Process
          </button>
        </motion.div>

        <motion.ul
          {...entrance(0.24)}
          className="flex w-full flex-wrap items-center gap-x-5 gap-y-3 sm:gap-x-7"
        >
          {HeroList.map((items) => (
            <li key={items.name}>
              <div className="flex items-center gap-2.5">
                <img src={items.icon} alt="" />
                <span className="font-Inter text-sm font-medium leading-6 text-LightBlack sm:text-base">
                  {items.name}
                </span>
              </div>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
};

export default Hero;
