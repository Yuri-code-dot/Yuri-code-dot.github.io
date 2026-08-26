import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Search, BookMarked } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Library", to: "/library" },
  { label: "Curriculum", to: "/curriculum" },
  { label: "Authors", to: "/authors" },
  { label: "Periods", to: "/periods" },
  { label: "Genres", to: "/genres" },
  { label: "Resources", to: "/resources" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled ? "border-b border-border bg-ink/90 backdrop-blur-md" : "border-b border-transparent bg-gradient-to-b from-ink/80 to-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <button
          className="text-ivory md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        <Link to="/" className="flex min-w-0 items-center gap-2 font-display text-lg font-semibold tracking-tight text-ivory sm:text-xl">
          <BookMarked size={20} className="shrink-0 text-bronze" />
          <span className="truncate">English Literature Library</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? "text-bronze-bright" : "text-ivory-dim hover:text-ivory"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/search" aria-label="Search" className="text-ivory-dim transition-colors hover:text-bronze-bright">
            <Search size={19} />
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="border-t border-border bg-ink px-4 py-3 md:hidden animate-fade-in">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? "bg-surface-raised text-bronze-bright" : "text-ivory-dim hover:bg-surface"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
