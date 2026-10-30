import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { REVIEWS } from "../../../constants";
import { CareLeft, CareRight, Quote, Rating1 } from "../../../assets";

export default function ReviewList() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(1);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const update = () => {
      const cards =
        window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
      setVisible(cards);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxIndex = Math.max(0, REVIEWS.length - visible);
  const current = Math.min(index, maxIndex);

  const prev = () => setIndex(Math.max(0, current - 1));
  const next = () => setIndex(Math.min(maxIndex, current + 1));

  return (
    <section
      aria-label="Customer reviews"
      aria-roledescription="carousel"
      className="mx-auto w-full max-w-6xl"
    >
      <div className="overflow-hidden">
        <motion.div
          className="flex items-stretch"
          animate={{ x: `-${current * (100 / visible)}%` }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.5,
            ease: "easeInOut",
          }}
        >
          {REVIEWS.map((review, reviewIndex) => (
            <motion.article
              key={review.id}
              aria-label={`Review by ${review.name}`}
              className="min-w-0 px-1.5 py-2"
              style={{ flex: `0 0 ${100 / visible}%` }}
              initial={{
                opacity: shouldReduceMotion ? 1 : 0,
                y: shouldReduceMotion ? 0 : 16,
              }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.4,
                delay: shouldReduceMotion ? 0 : reviewIndex * 0.1,
              }}
            >
              <div className="flex h-full flex-col rounded-2xl bg-white p-5 shadow-Review sm:p-6">
                <img src={Quote} alt="" className="size-7 shrink-0" />

                <p className="mt-3 min-h-0 flex-1 wrap-break-word font-Inter text-sm font-normal leading-6 text-Black sm:text-base sm:leading-7.5">
                  {review.text}
                </p>

                <div className="mt-6 flex items-center gap-3">
                  <img
                    src={review.image}
                    alt=""
                    className="size-12 shrink-0 rounded-full object-cover"
                  />
                  <div className="flex min-w-0 flex-col items-start gap-0.5">
                    <p className="max-w-full wrap-break-word font-Inter text-[15px] font-medium leading-6 text-black">
                      {review.name}
                    </p>
                    <p className="font-Inter text-sm font-normal leading-5 text-Black">
                      Verified User
                    </p>
                    <img
                      src={Rating1}
                      alt="5 out of 5 stars"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-4 sm:mt-7">
        <button
          type="button"
          onClick={prev}
          disabled={current === 0}
          aria-label="Previous reviews"
          className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-FormBg transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <img src={CareLeft} alt="" className="size-4" />
        </button>

        <div className="flex min-w-0 items-center justify-center gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, dotIndex) => (
            <button
              key={dotIndex}
              type="button"
              onClick={() => setIndex(dotIndex)}
              aria-label={`Go to review slide ${dotIndex + 1}`}
              aria-current={dotIndex === current ? "true" : undefined}
              className={`h-2 rounded-full transition-all duration-300 ${
                dotIndex === current ? "w-8 bg-TextColor" : "w-2 bg-FormBg"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={next}
          disabled={current === maxIndex}
          aria-label="Next reviews"
          className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-FormBg transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <img src={CareRight} alt="" className="size-4" />
        </button>
      </div>
    </section>
  );
}