import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { STEPS } from "../../../constants";
import { VectorArrow } from "../../../assets";

const HowItWork: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const cardMotion = (index: number) => ({
    initial: {
      opacity: shouldReduceMotion ? 1 : 0,
      y: shouldReduceMotion ? 0 : 18,
    },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.25 },
    transition: {
      duration: shouldReduceMotion ? 0 : 0.45,
      delay: shouldReduceMotion ? 0 : index * 0.12,
    },
    whileHover: shouldReduceMotion
      ? undefined
      : { y: -5, transition: { duration: 0.2 } },
  });

  return (
    <section id="howitworks" className="w-full">
      <div className="mx-auto container flex w-full max-w-7xl flex-col items-center gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="flex w-full max-w-3xl flex-col items-center gap-4 text-center sm:gap-5">
          <h2 className="font-Manrope text-3xl font-semibold leading-tight text-TextBlack sm:text-4xl">
            How It Works
          </h2>
          <p className="w-full font-Inter text-base font-semibold leading-6 text-TextColor sm:text-lg">
            Get Health guidance in 3 simple steps
          </p>
        </div>

        <div className="grid w-full max-w-5xl grid-cols-1 rounded-2xl border-t border-FormBg bg-StepsBg md:grid-cols-3">
          {STEPS.map((step, index) => {
            const isLast = index === STEPS.length - 1;

            return (
              <motion.article
                key={step.id}
                {...cardMotion(index)}
                className="relative flex h-full flex-col items-center px-5 pb-8 pt-10 text-center sm:px-8 sm:pb-10 sm:pt-12 md:px-5 lg:px-8"
              >
                <span className="absolute left-1/2 top-0 flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-TextColor text-center font-Inter text-sm font-semibold text-white">
                  {step.id}
                </span>

                {!isLast && (
                  <img
                    src={VectorArrow}
                    alt=""
                    className="absolute right-0 top-0 z-10 hidden -translate-y-1/2 translate-x-1/2 bg-StepsBg md:block"
                  />
                )}

                {!isLast && (
                  <div className="absolute right-0 top-40 hidden h-50 w-px -translate-y-1/2 bg-FormBg md:block" />
                )}

                <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-SoftGreen shadow-Bg sm:size-20">
                  <img
                    src={step.icon}
                    alt=""
                    className="max-h-full max-w-full"
                  />
                </div>

                <h3 className="mt-5 w-full text-center font-Inter text-lg font-semibold leading-snug text-black sm:text-xl lg:text-xl">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-xs font-Inter text-sm font-normal leading-6 text-center text-Black sm:text-base sm:leading-7 lg:w-65.75">
                  {step.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWork;
