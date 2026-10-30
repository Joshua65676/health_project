import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Logo } from "../../../assets";
import { NavLinks } from "../../../constants";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const [stickyClass, setStickyClass] = useState<boolean>(false);
  const [active, setActive] = useState<string>(NavLinks[0].name);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const shouldReduceMotion = useReducedMotion();

  const stickNavbar = () => {
    const windowHeight = window.scrollY;
    setStickyClass(windowHeight > 50);
  };

  useEffect(() => {
    const updateActiveLink = () => {
      const hash = window.location.hash || "#hero";
      const matchedLink = NavLinks.find((item) => item.link === hash);
      if (matchedLink) setActive(matchedLink.name);
    };

    updateActiveLink();
    window.addEventListener("scroll", stickNavbar);
    window.addEventListener("hashchange", updateActiveLink);

    return () => {
      window.removeEventListener("scroll", stickNavbar);
      window.removeEventListener("hashchange", updateActiveLink);
    };
  }, []);

  useEffect(() => {
    if (!sidebarOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSidebarOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [sidebarOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-20.5 w-full transition-all duration-300 ease-out ${
        stickyClass ? "bg-GrayBg shadow-sm backdrop-blur-md" : "bg-Bg"
      }`}
    >
      <main className="mx-auto flex h-full max-w-7xl flex-row items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row gap-1.5 items-center">
          <img src={Logo} alt="Logo" />
          <h2 className="font-Inter font-semibold text-[24px] leading-7 tracking-[-1px] text-Black">
            Medi<span className="text-TextColor">AI</span>
          </h2>
        </div>

        <ul className="md:flex flex-row items-center gap-10 hidden">
          {NavLinks.map((items) => {
            const isActive = active === items.name;

            return (
              <li
                key={items.name}
                className="transition-all duration-300 ease-out"
              >
                <a
                  href={items.link}
                  onClick={() => setActive(items.name)}
                  aria-current={isActive ? "page" : undefined}
                  className="group inline-flex flex-col items-center gap-2 transition-all duration-300 ease-out hover:-translate-y-0.5"
                >
                  <span
                    className={`font-Inter text-[16px] font-semibold leading-5 tracking-[-0.35px] transition-all duration-300 ease-out ${
                      isActive
                        ? "text-TextColor"
                        : "text-BorderColor group-hover:text-TextColor"
                    }`}
                  >
                    {items.name}
                  </span>
                  <span
                    className={`h-0.5 w-full origin-center rounded-full transition-all duration-300 ease-out ${
                      isActive
                        ? "scale-x-100 bg-TextColor"
                        : "scale-x-0 bg-transparent group-hover:scale-x-100 group-hover:bg-TextColor/80"
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>

        <div className="hidden flex-row items-center gap-3 md:flex">
          <Link
            to="/login"
            className="flex h-10 w-22.75 items-center justify-center rounded-[25px] border-2 border-TextColor text-center font-Inter text-[16px] font-semibold leading-6 text-BorderColor transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-TextColor hover:text-white"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="flex h-10 w-33.75 items-center justify-center rounded-[25px] bg-TextColor text-center font-Inter text-[16px] font-semibold leading-6 text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:shadow-TextColor/20"
          >
            Get Started
          </Link>
        </div>

        <button
          type="button"
          aria-label={
            sidebarOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={sidebarOpen}
          aria-controls="mobile-navigation"
          onClick={() => setSidebarOpen((open) => !open)}
          className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-lg text-TextColor transition-colors hover:bg-TextColor/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-TextColor md:hidden"
        >
          <span
            className={`h-0.5 w-6 rounded-full bg-current transition-transform duration-300 ${sidebarOpen ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`h-0.5 w-6 rounded-full bg-current transition-opacity duration-200 ${sidebarOpen ? "opacity-0" : "opacity-100"}`}
          />
          <span
            className={`h-0.5 w-6 rounded-full bg-current transition-transform duration-300 ${sidebarOpen ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </main>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation menu"
              onClick={() => setSidebarOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
              className="fixed inset-x-0 bottom-0 top-20 z-40 bg-black/30 md:hidden"
            />
            <motion.aside
              id="mobile-navigation"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.28,
                ease: "easeOut",
              }}
              className="fixed right-0 top-20 z-50 flex h-[calc(100dvh-5rem)] w-[min(22rem,100vw)] flex-col overflow-y-auto border-t border-TextColor/10 bg-white px-6 py-7 shadow-xl md:hidden"
            >
              <ul className="flex flex-col gap-2">
                {NavLinks.map((item) => {
                  const isActive = active === item.name;

                  return (
                    <li key={item.name}>
                      <a
                        href={item.link}
                        onClick={() => {
                          setActive(item.name);
                          setSidebarOpen(false);
                        }}
                        aria-current={isActive ? "page" : undefined}
                        className={`block rounded-lg px-4 py-3 font-Inter text-base font-semibold transition-colors ${isActive ? "bg-TextColor/10 text-TextColor" : "text-BorderColor hover:bg-TextColor/5 hover:text-TextColor"}`}
                      >
                        {item.name}
                      </a>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-auto flex flex-col gap-3 border-t border-TextColor/10 pt-6">
                <Link
                  to="/login"
                  onClick={() => setSidebarOpen(false)}
                  className="flex min-h-11 items-center justify-center rounded-full border-2 border-TextColor font-Inter font-semibold text-TextColor transition-colors hover:bg-TextColor hover:text-white"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setSidebarOpen(false)}
                  className="flex min-h-11 items-center justify-center rounded-full bg-TextColor font-Inter font-semibold text-white transition-colors hover:bg-TextColor/90"
                >
                  Sign Up
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
