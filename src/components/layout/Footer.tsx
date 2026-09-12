import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Footer: React.FC = () => {
  const location = useLocation();
  if (location.pathname === '/print') return null;

  return (
    <footer className="print:hidden w-[min(1100px,90vw)] mx-auto border-t border-gpline py-9 mt-16 text-gpmuted text-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-2">
          <p className="m-0 text-ink/90 font-medium">
            GradeForge — An academic notebook for SGPA & CGPA calculations.
          </p>
          <p className="m-0 text-xs">
            Built by{' '}
            <a
              href="https://poorvithmp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gpblue underline hover:opacity-80"
            >
              Poorvith M P
            </a>
            . Grades and custom scales stay securely inside this browser.
          </p>
          <p className="m-0 text-xs text-gpmuted/80">
            No analytics service receives grades, calculator entries, or page activity.
          </p>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs md:justify-end">
          <Link to="/" className="hover:text-gpblue transition-colors">Home</Link>
          <Link to="/calculator" className="hover:text-gpblue transition-colors">Calculator</Link>
          <Link to="/about" className="hover:text-gpblue transition-colors">About</Link>
          <Link to="/docs" className="hover:text-gpblue transition-colors">Formulas & FAQ</Link>
          <Link to="/contact" className="hover:text-gpblue transition-colors">Support</Link>
          <a
            href="https://github.com/poorvith-mp/gradeforge"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gpblue transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};
