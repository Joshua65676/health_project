import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";

const CTA: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={{
        opacity: shouldReduceMotion ? 1 : 0,
        y: shouldReduceMotion ? 0 : 20,
      }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
      className="w-full max-w-223.5 rounded-3xl bg-white px-5 py-10 shadow-CTA sm:rounded-4xl sm:px-8 sm:py-12 lg:px-12 lg:py-14"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-5 sm:gap-6 lg:gap-8">
        <h2 className="w-full text-center font-Inter text-3xl font-semibold leading-tight tracking-[-0.32px] text-TextBlack sm:text-4xl sm:leading-tight lg:text-[40px]">
          Ready to Take Control of Your Health?
        </h2>
        <p className="w-full max-w-xl text-center font-Inter text-sm font-medium leading-6 text-Black sm:text-base sm:leading-7.5">
          Chat with our AI Health Assistant today and take the first step
          towards a healthier you.
        </p>
        <div className="flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4 lg:gap-5">
          <Link to="/.login">
            <motion.button
              type="button"
              whileHover={shouldReduceMotion ? undefined : { y: -2 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="min-h-12 w-full cursor-pointer rounded-[10px] bg-TextColor px-5 py-3 text-center font-Inter text-base font-medium leading-6 text-white transition-colors hover:bg-TextColor/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-TextColor sm:w-auto sm:min-w-44 lg:min-w-49.5"
            >
              Start Chat Now
            </motion.button>
          </Link>
          <motion.button
            type="button"
            whileHover={shouldReduceMotion ? undefined : { y: -2 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="min-h-12 w-full cursor-pointer rounded-[10px] border-2 border-TextColor px-5 py-3 text-center font-Inter text-base font-medium leading-6 text-black transition-colors hover:bg-TextColor/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-TextColor sm:w-auto sm:min-w-44 lg:min-w-49.5"
          >
            Learn More
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
};

export default CTA;
