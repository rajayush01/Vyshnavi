import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Menu, ShoppingCart, X, User } from "lucide-react";
import "../../fonts.css";
import logo from "../../assets/logo.png";
import { useCart } from "@/context/cartContext";

type Action =
  | { type: "scroll"; target: string }
  | { type: "navigate"; target: string };

const NAV_ITEMS: { key: string; label: string; action: Action }[] = [
  { key: "home", label: "Home", action: { type: "navigate", target: "/" } },
  { key: "ghee", label: "Ghee", action: { type: "navigate", target: "/ghee" } },
  { key: "about", label: "About Us", action: { type: "navigate", target: "/about" } },
  { key: "portfolio", label: "Portfolio", action: { type: "navigate", target: "/portfolio" } },
  { key: "contact", label: "Contact Us", action: { type: "navigate", target: "/contact-us" } },
];

// Maps the current URL path to the matching nav key, defaulting to "home"
const getActiveTabFromPath = (pathname: string): string => {
  const match = NAV_ITEMS.find(
    (item) =>
      item.action.type === "navigate" &&
      item.action.target === pathname
  );

  return match ? match.key : "";
};

const Header: React.FC = () => {
  const { cartCount, toggleCart } = useCart();
  const location = useLocation();
  const isPortfolio = location.pathname.startsWith("/portfolio");
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>(() => getActiveTabFromPath(location.pathname));
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = (): void => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setActiveTab(getActiveTabFromPath(location.pathname));
  }, [location.pathname]);

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  const scrollToSection = (sectionId: string): void => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleNavigation = (tab: string, action: Action): void => {
    setActiveTab(tab);
    setIsMenuOpen(false);

    if (action.type === "scroll") {
      scrollToSection(action.target);
    } else if (action.type === "navigate") {
      window.location.href = action.target;
    }
  };

  return (
    <>
      <style>{`
        .nav-pill {
          position: relative;
          transition: color 0.25s ease;
        }
        .nav-pill::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 2px;
          border-radius: 2px;
          background: linear-gradient(90deg, #2563eb, #06b6d4);
          transition: width 0.3s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .nav-pill.active::after,
        .nav-pill:hover::after {
          width: 100%;
        }

        @keyframes marqueeScrollHeader {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .scroll-banner {
          animation: marqueeScrollHeader 26s linear infinite;
          white-space: nowrap;
        }
        .scroll-banner:hover {
          animation-play-state: paused;
        }

        .header-shell {
          transition: all 0.35s cubic-bezier(0.25,0.46,0.45,0.94);
        }

        .drawer-backdrop {
          animation: drawerFadeIn 0.3s ease forwards;
        }
        .drawer-panel {
          animation: drawerSlideIn 0.35s cubic-bezier(0.25,0.46,0.45,0.94) forwards;
        }
        @keyframes drawerFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes drawerSlideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>

      {/* Top promo marquee — hidden on /portfolio for a full-bleed, immersive header */}
      {!isPortfolio && (
        <div className="fixed top-0 left-0 right-0 w-full z-50 h-9 flex items-center bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white text-[11px] sm:text-xs overflow-hidden">
          <div className="scroll-banner inline-flex font-semibold tracking-wide">
            <span className="inline-flex items-center px-8">
              🥛&nbsp; Fresh Milk Delivered Daily &nbsp;•&nbsp; Trusted by 10,000+ Families &nbsp;•&nbsp; Lab-Tested Purity, Every Batch &nbsp;•&nbsp; 🥛&nbsp; Fresh Milk Delivered Daily &nbsp;•&nbsp; Trusted by 10,000+ Families &nbsp;•&nbsp; Lab-Tested Purity, Every Batch &nbsp;•&nbsp;
            </span>
          </div>
        </div>
      )}

      {/* Main header */}
      <header
        className={`header-shell fixed left-0 right-0 w-full z-50 ${isPortfolio ? "top-0" : "top-9"} ${
          isPortfolio
            ? "bg-transparent mt-1"
            : scrolled
            ? "bg-white/90 backdrop-blur-xl shadow-[0_8px_30px_-15px_rgba(37,99,235,0.35)] border-b border-blue-50"
            : "bg-white/70 backdrop-blur-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center transition-all duration-300 ${scrolled ? "h-14 lg:h-16" : "h-16 lg:h-20"}`}>
            {/* Logo */}
            <div className="flex items-center">
              <button
                onClick={() => (window.location.href = "/")}
                className={`text-2xl font-bold transition-colors ${
                  isPortfolio
                    ? "bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-3 py-1.5"
                    : "text-blue-600 hover:text-blue-700"
                }`}
              >
                <img src={logo} alt="Vyshnavi Dairy" className={`transition-all duration-300 ${scrolled && !isPortfolio ? "h-11" : "h-[60px]"} ${isPortfolio ? "h-9" : ""}`} />
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-9">
              {!isPortfolio &&
                NAV_ITEMS.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => handleNavigation(item.key, item.action)}
                    className={`nav-pill text-[15px] font-semibold transition-colors ${
                      activeTab === item.key ? "text-blue-600 active" : "text-slate-700 hover:text-blue-600"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}

              <div className="flex items-center gap-2 pl-2">
                <button
                  onClick={() => (window.location.href = "/auth")}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                    isPortfolio
                      ? "bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md"
                      : "bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 text-slate-600 hover:text-blue-600"
                  }`}
                  aria-label="Account"
                >
                  <User size={18} />
                </button>

                <button
                  onClick={toggleCart}
                  className="relative w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 hover:shadow-[0_10px_25px_-8px_rgba(37,99,235,0.6)] text-white flex items-center justify-center transition-all duration-200 hover:scale-105"
                  aria-label="Cart"
                >
                  <ShoppingCart size={18} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-[10px] font-bold text-white w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
            </nav>

            {/* Mobile: Cart & Auth Icons + Hamburger (hamburger hidden on /portfolio — no links to show) */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={() => (window.location.href = "/auth")}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
                  isPortfolio
                    ? "bg-white/10 border border-white/20 text-white backdrop-blur-md"
                    : "bg-slate-50 border border-slate-100 text-slate-600"
                }`}
                aria-label="Account"
              >
                <User size={17} />
              </button>

              <button
                onClick={toggleCart}
                className="relative w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center transition"
                aria-label="Cart"
              >
                <ShoppingCart size={17} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-[10px] font-bold text-white w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </button>

              {!isPortfolio && (
                <button
                  onClick={() => setIsMenuOpen(true)}
                className="p-2 text-slate-700 hover:text-blue-600 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]">
          <div
            className="drawer-backdrop absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="drawer-panel absolute top-0 right-0 h-full w-[82%] max-w-sm bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <img src={logo} alt="Vyshnavi Dairy" className="h-10" />
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-600"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleNavigation(item.key, item.action)}
                  className={`flex items-center justify-between w-full text-left px-4 py-3.5 rounded-2xl font-semibold text-[15px] transition-colors ${
                    activeTab === item.key
                      ? "text-blue-600 bg-blue-50"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                  {activeTab === item.key && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  )}
                </button>
              ))}
            </nav>

            <div className="px-6 py-5 border-t border-slate-100">
              <button
                onClick={() => (window.location.href = "/auth")}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-slate-50 border border-slate-100 text-slate-700 font-semibold text-sm"
              >
                <User size={16} /> My Account
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;