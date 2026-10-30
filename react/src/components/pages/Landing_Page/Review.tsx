import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Rating } from "../../../assets";
import ReviewList from "./ReviewList";
import CTA from "./CTA";

const Review: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const entrance = (delay = 0) => ({
    initial: {
      opacity: shouldReduceMotion ? 1 : 0,
      y: shouldReduceMotion ? 0 : 16,
    },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: {
      duration: shouldReduceMotion ? 0 : 0.45,
      delay: shouldReduceMotion ? 0 : delay,
    },
  });

  return (
    <section
      id="reviews"
      className="w-full bg-linear-to-b from-ReviewBg to-ReviewBg2"
    >
      <div className="container mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <motion.header
          {...entrance()}
          className="flex w-full flex-col items-start gap-3"
        >
          <span className="font-Inter font-semibold text-[20px] leading-10 tracking-normal text-TextColor text-start">
            REVIEWS
          </span>
          <div className="flex w-full flex-col items-start justify-between gap-5 sm:flex-row sm:items-center sm:gap-8">
            <div className="flex min-w-0 flex-col items-start gap-1.5">
              <h2 className="font-Inter text-2xl font-semibold leading-tight text-TextBlack sm:text-3xl sm:leading-10">
                Trusted by 10,000+ Wellness Seekers
              </h2>
              <p className="font-Inter text-sm font-medium leading-6 text-Black sm:text-base sm:leading-7.5">
                See how MedAI is changing lives through data-driven empathy.
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-start gap-1.5 sm:items-end">
              <div className="flex items-center gap-2">
                <img src={Rating} alt="" className="max-w-24" />
                <span className="font-Inter text-2xl font-semibold leading-tight text-TextBlack sm:text-3xl sm:leading-10">
                  4.9/5
                </span>
              </div>
              <span className="font-Inter text-sm font-medium leading-6 text-Black sm:text-base sm:leading-7.5">
                From 10,000+ reviews
              </span>
            </div>
          </div>
        </motion.header>

        <motion.div {...entrance(0.12)} className="w-full">
          <ReviewList />
        </motion.div>

        <div className="flex items-center justify-center w-full mt-25">
          <CTA />
        </div>
      </div>
    </section>
  );
};

export default Review;
