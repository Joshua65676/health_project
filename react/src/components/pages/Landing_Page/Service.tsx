import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Brain,
  Dot,
  Ic,
  NotePad,
  ServiceBg,
  ShieldHeart,
  ShieldPlus,
  Union,
  Union2,
  Union3,
  Vector,
  Vector2,
  Vector3,
} from "../../../assets";

const Service: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const cardMotion = (delay: number) => ({
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: {
      duration: shouldReduceMotion ? 0 : 0.45,
      delay: shouldReduceMotion ? 0 : delay,
    },
  });

  return (
    <main
      id="service"
      className="w-full bg-linear-to-b from-ServiceBg to-ServiceBg2"
    >
      <section className="mx-auto flex w-full max-w-7xl flex-col items-center gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="flex w-full max-w-3xl flex-col items-center gap-4 text-center sm:gap-5">
          <h2 className="font-Manrope text-3xl font-semibold leading-tight text-TextBlack sm:text-4xl">
            Precision Services
          </h2>
          <p className="w-full font-Inter text-base font-semibold leading-7 text-TextColor sm:text-lg">
            Experience a new standard of care powered by advanced neural
            networks and empathetic intelligence.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
          <motion.article
            {...cardMotion(0)}
            className="relative isolate min-h-120 w-full overflow-hidden rounded-2xl bg-ServiceListBg shadow-ServiceList sm:col-span-2 lg:col-span-8"
          >
            <img
              src={ServiceBg}
              alt=""
              className="absolute inset-0 z-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 z-1 bg-linear-to-r from-ServiceListBg/60 via-ServiceListBg/50 to-transparent" />
            <div className="relative z-10 flex min-h-120 flex-col items-start gap-4 p-6 sm:p-8">
              <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-SoftGreen shadow-Bg sm:size-24">
                <img src={Brain} alt="" className="inline-block" />
              </div>
              <h3 className="w-full max-w-64 font-Inter text-2xl font-semibold leading-tight text-black sm:text-3xl">
                AI Symptoms Assessment
              </h3>
              <p className="w-full max-w-88 font-Inter text-[15px] leading-7 text-Black sm:text-base">
                Describe your symptoms in natural language and get AI-powered
                insights instantly.
              </p>
              <div className="relative isolate flex aspect-175/84 w-full max-w-43.75 items-center justify-center">
                <img
                  src={Union}
                  alt=""
                  className="absolute inset-0 -z-10 size-full object-contain"
                />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="flex items-center gap-1 flex-col -mt-4">
                    <p className="w-29.5 font-Inter text-[14px] font-medium leading-4.5 text-black">
                      I have a fever and sore throat
                    </p>
                    <hr className="w-30 border-Black" />
                  </div>
                  <img
                    src={Vector}
                    alt=""
                    className="absolute right-0 -mr-5 bottom-0 top-0"
                  />
                </div>
              </div>
            </div>
          </motion.article>

          <motion.article
            {...cardMotion(0.08)}
            className="min-h-120 w-full rounded-2xl bg-ServiceListBg shadow-ServiceList sm:col-span-1 lg:col-span-4"
          >
            <div className="flex h-full min-h-120 flex-col items-start gap-4 p-6 sm:p-8">
              <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-SoftGreen shadow-Bg sm:size-24">
                <img src={NotePad} alt="" />
              </div>
              <h3 className="w-full max-w-80.25 font-Inter text-2xl font-semibold leading-tight text-black sm:text-[28px]">
                Personalized Health Insights
              </h3>
              <p className="w-full max-w-60.75 font-Inter text-[15px] leading-7 text-Black sm:text-base">
                Receive possible causes, recommendations, and self-care tips
                tailored to your condition.
              </p>
              <div className="relative isolate mt-auto flex aspect-175/84 w-full h-25.5 max-w-43.75 items-center justify-center">
                <img
                  src={Union2}
                  alt=""
                  className="absolute inset-0 -z-10 size-full object-contain"
                />
                <div className="relative z-10 w-full px-4">
                  <div className="flex flex-col items-start gap-1">
                    <span className="font-Inter text-[14px] font-medium leading-4.5 text-black ml-2">
                      Possible causes
                    </span>
                    <ul className="flex flex-col items-start gap-1">
                      <li className="flex items-center gap-1.5 font-Inter text-[12px] leading-4.5 text-Black">
                        <img src={Dot} alt="" /> Common Cold
                      </li>
                      <li className="flex items-center gap-1.5 font-Inter text-[12px] leading-4.5 text-Black">
                        <img src={Dot} alt="" /> Viral Infections
                      </li>
                      <li className="flex items-center gap-1.5 font-Inter text-[12px] leading-4.5 text-Black">
                        <img src={Dot} alt="" /> Allergies
                      </li>
                    </ul>
                  </div>
                  <img
                    src={Vector2}
                    alt=""
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                  />
                </div>
              </div>
            </div>
          </motion.article>

          <motion.article
            {...cardMotion(0.16)}
            className="min-h-120 w-full rounded-2xl bg-linear-to-t from-white to-ServiceListBg shadow-ServiceListBg sm:col-span-1 lg:col-span-4"
          >
            <div className="flex h-full min-h-120 flex-col items-start gap-4 p-6 sm:p-8">
              <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-SoftGreen shadow-Bg sm:size-24">
                <img src={ShieldPlus} alt="" />
              </div>
              <h3 className="w-full max-w-80.25 font-Inter text-2xl font-semibold leading-tight text-black sm:text-[28px]">
                Smart Guidance &amp; Next Steps
              </h3>
              <p className="w-full max-w-60.75 font-Inter text-[15px] leading-7 text-Black sm:text-base">
                Get clear guidance on what to do next, including lifestyle
                advice and when to see a doctor.
              </p>
              <div className="relative isolate mt-auto flex aspect-235/84 w-full max-w-59.25 items-center justify-center">
                <img
                  src={Union3}
                  alt=""
                  className="absolute inset-0 -z-10 size-full object-contain"
                />
                <div className="relative z-10 flex w-59.25 h-24 items-center justify-between gap-2 px-6">
                  <div className="flex flex-col items-start gap-2">
                    <span className="font-Inter text-[14px] leading-4.5 text-black">
                      Recommended Next Step
                    </span>
                    <p className="w-40 max-w-full font-Inter text-[13px] leading-4.5 text-Black">
                      Consult a doctor if symptoms persist.
                    </p>
                  </div>
                  <img
                    src={Vector3}
                    alt=""
                    className="absolute right-5 bottom-3"
                  />
                </div>
              </div>
            </div>
          </motion.article>

          <motion.article
            {...cardMotion(0.24)}
            className="min-h-120 w-full rounded-2xl bg-linear-to-t from-white to-ServiceListBg shadow-ServiceListBg sm:col-span-2 lg:col-span-8"
          >
            <div className="flex h-full min-h-120 flex-col justify-between gap-8 p-6 sm:p-8 lg:p-10">
              <div className="flex flex-col-reverse items-start gap-5 sm:flex-row sm:items-center sm:justify-between lg:py-25">
                <div className="flex flex-col items-start gap-2.5">
                  <h3 className="font-Inter text-2xl font-semibold leading-tight text-black sm:text-[32px]">
                    Data Privacy First
                  </h3>
                  <p className="w-full max-w-104 font-Inter text-[15px] leading-7 text-Black sm:text-base">
                    Your conversations are encrypted and your health data is
                    always kept private.
                  </p>
                </div>
                <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-SoftGreen shadow-Bg sm:size-24">
                  <img src={ShieldHeart} alt="" />
                </div>
              </div>
              <div className="flex w-full max-w-68 items-center gap-2.5 rounded-[15px] border border-Black px-3 py-4">
                <img src={Ic} alt="" />
                <p className="font-Inter text-[14px] font-medium leading-5 text-black">
                  Your data is 100% secured and confidential
                </p>
              </div>
            </div>
          </motion.article>
        </div>
      </section>
    </main>
  );
};

export default Service;
