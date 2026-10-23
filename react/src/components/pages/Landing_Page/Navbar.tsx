import React, { useEffect, useState } from "react";
import { Logo } from "../../../assets";
import { NavLinks } from "../../../constants";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const [stickyClass, setStickyClass] = useState<boolean>(false);
  const [active, setActive] = useState<string>(NavLinks[0].name);

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

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-20.5 w-full transition-all duration-300 ease-out ${
        stickyClass ? "bg-GrayBg shadow-sm backdrop-blur-md" : "bg-Bg"
      }`}
    >
      <main className="flex flex-row items-center justify-between max-w-7xl mx-auto py-6">
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

        <div className="hidden md:flex flex-row items-center gap-3">
          <Link to="/login">
            <button className="cursor-pointer w-22.75 h-10 rounded-[25px] border-2 border-TextColor font-Inter font-semibold text-[16px] leading-6 text-center text-BorderColor transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-TextColor hover:text-white">
              Login
            </button>
          </Link>
          <Link to="/signup">
            <button className="cursor-pointer w-33.75 h-10 rounded-[25px] bg-TextColor font-Interfont-semibold text-[16px] leading-6 text-center text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:shadow-TextColor/20">
              Get Started
            </button>
          </Link>
        </div>
      </main>
    </nav>
  );
};

export default Navbar;
