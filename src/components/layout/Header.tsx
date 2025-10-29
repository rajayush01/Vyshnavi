import React, { useState, useEffect } from "react";
import { Menu, ShoppingCart, X, User } from "lucide-react";
import "../../fonts.css";
import logo from "../../assets/logo.png";

type Action =
  | { type: "scroll"; target: string }
  | { type: "navigate"; target: string };

interface HeaderProps {
  onCartToggle: () => void;
  cartCount: number;
}

const Header: React.FC<HeaderProps> = ({ onCartToggle, cartCount }) => {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("home");
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  

  useEffect(() => {
    const handleScroll = (): void => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        .header-shadow {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .nav-link {
          position: relative;
          transition: all 0.3s ease;
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 2px;
          background: #3b82f6;
          transition: width 0.3s ease;
        }
        
        .nav-link.active::after,
        .nav-link:hover::after {
          width: 100%;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .scroll-banner {
          animation: scroll 30s linear infinite;
          white-space: nowrap;
        }
        
        .scroll-banner:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Continuous Scroll Banner */}
      <div className="fixed top-0 left-0 right-0 w-full z-50 bg-gradient-to-r from-blue-300 to-blue-200 text-blue-900 text-sm py-3 overflow-hidden">
        <div className="scroll-banner inline-flex">
          <span className="inline-flex items-center px-8">
            🚀 Welcome to Our Platform • Innovative Solutions for Modern
            Businesses • Join Us Today • 🚀 Welcome to Our Platform • Innovative
            Solutions for Modern Businesses • Join Us Today •
          </span>
        </div>
      </div>

      <header className="fixed top-10 left-0 right-0 w-full z-50 bg-white shadow-xl shadow-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <button
                onClick={() =>
                  handleNavigation("home", {
                    type: "scroll",
                    target: "hero-section",
                  })
                }
                className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                <img src={logo} alt="" className="h-[70px]" />
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8 .cormorant-sc-bold">
              <button
                onClick={() =>
                  handleNavigation("home", {
                    type: "scroll",
                    target: "hero-section",
                  })
                }
                className={`nav-link text-base font-medium transition-colors ${
                  activeTab === "home"
                    ? "text-blue-600 active"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                Home
              </button>
              <button
                onClick={() =>
                  handleNavigation("ghee", {
                    type: "navigate",
                    target: "/ghee",
                  })
                }
                className={`nav-link text-base font-medium transition-colors ${
                  activeTab === "ghee"
                    ? "text-blue-600 active"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                Ghee
              </button>
              <button
                onClick={() =>
                  handleNavigation("about", {
                    type: "navigate",
                    target: "/about",
                  })
                }
                className={`nav-link text-base font-medium transition-colors ${
                  activeTab === "about"
                    ? "text-blue-600 active"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                About Us
              </button>
              <button
                onClick={() =>
                  handleNavigation("portfolio", {
                    type: "navigate",
                    target: "/portfolio",
                  })
                }
                className={`nav-link text-base font-medium transition-colors ${
                  activeTab === "portfolio"
                    ? "text-blue-600 active"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                Portfolio
              </button>
              <button
                onClick={() =>
                  handleNavigation("contact", {
                    type: "navigate",
                    target: "/contact-us",
                  })
                }
                className={`nav-link text-base font-medium transition-colors ${
                  activeTab === "contact"
                    ? "text-blue-600 active"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                Contact Us
              </button>

              
              <div className="flex gap-2">
              <button
                onClick={() => window.location.href = '/auth'}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full flex items-center gap-2 transition"
              >
                <User size={20} />
              </button>

              <button
                onClick={onCartToggle}
                className="relative bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2 transition"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-xs text-white w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-3 space-y-1">
              <button
                onClick={() =>
                  handleNavigation("home", {
                    type: "scroll",
                    target: "hero-section",
                  })
                }
                className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === "home"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Home
              </button>
              <button
                onClick={() =>
                  handleNavigation("ghee", {
                    type: "navigate",
                    target: "/ghee",
                  })
                }
                className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === "ghee"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Ghee
              </button>
              <button
                onClick={() =>
                  handleNavigation("about", {
                    type: "navigate",
                    target: "/about",
                  })
                }
                className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === "about"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                About Us
              </button>
              <button
                onClick={() =>
                  handleNavigation("portfolio", {
                    type: "navigate",
                    target: "/portfolio",
                  })
                }
                className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === "portfolio"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Portfolio
              </button>
              <button
                onClick={() =>
                  handleNavigation("contact", {
                    type: "navigate",
                    target: "/contact-us",
                  })
                }
                className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === "contact"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Contact Us
              </button>

              <div className="flex gap-2 mt-2">
              <button
                onClick={() => window.location.href = '/auth'}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full flex items-center gap-2 transition"
              >
                <User size={20} />
              </button>

              <button
                onClick={onCartToggle}
                className="relative bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2 transition"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-xs text-white w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;