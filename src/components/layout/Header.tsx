import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const navLinks = [
    { name: 'Calculator', path: '/calculator' },
    { name: 'About', path: '/about' },
    { name: 'Docs', path: '/docs' },
    { name: 'Support', path: '/contact' },
  ];

  if (location.pathname === '/print') return null;

  return (
    <header className="print:hidden sticky top-0 z-40 flex items-center justify-between gap-5 min-h-[72px] px-[5vw] py-2.5 border-b border-gpline bg-[color-mix(in_srgb,var(--bg)_92%,transparent)] backdrop-blur-md transition-colors duration-200">
      <Link to="/" className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-gpgold">
        {/* Exact GradeMark signature SVG logo */}
        <span className="grade-mark relative grid grid-cols-3 items-end w-[39px] h-[32px]" aria-hidden="true">
          <i className="h-[12px] border-2 border-gpblue block"></i>
          <i className="h-[19px] border-2 border-gpblue block"></i>
          <i className="h-[27px] border-2 border-gpblue block"></i>
          <b className="absolute left-1 top-[21px] w-[29px] h-[2px] bg-gpgold -rotate-[28deg] origin-right block">
            <span className="absolute -right-[5px] -top-[3px] w-2 h-2 rounded-full bg-gpred block"></span>
          </b>
        </span>
        <strong className="font-serif font-bold text-xl tracking-tight text-ink">GradeForge</strong>
      </Link>

      <nav aria-label="Primary" className="flex items-center gap-3 sm:gap-6 font-mono font-semibold text-xs sm:text-sm tracking-wide">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`transition-colors py-1 ${
                isActive
                  ? 'text-gpblue font-bold border-b-2 border-gpblue'
                  : 'text-ink/80 hover:text-gpblue'
              } ${link.name === 'Support' || link.name === 'Docs' ? 'hidden sm:inline-block' : 'inline-block'}`}
            >
              {link.name}
            </Link>
          );
        })}

        <button
          id="theme-toggle"
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          className="flex items-center gap-1.5 px-3 py-1.5 min-h-[40px] border border-gpline bg-paper text-ink rounded-none hover:border-gpblue focus:outline-none focus-visible:ring-2 focus-visible:ring-gpgold transition-colors cursor-pointer"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-gpgold" />
              <span className="hidden sm:inline text-xs font-mono">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-gpblue" />
              <span className="hidden sm:inline text-xs font-mono">Dark</span>
            </>
          )}
        </button>
      </nav>
    </header>
  );
};
