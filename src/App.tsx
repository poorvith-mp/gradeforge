import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { GradeProvider } from './context/GradeContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { CalculatorPage } from './pages/CalculatorPage';
import { AboutPage } from './pages/AboutPage';
import { DocsPage } from './pages/DocsPage';
import { ContactPage } from './pages/ContactPage';
import { PrintPage } from './pages/PrintPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <GradeProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-bg text-ink selection:bg-gpwash selection:text-gpblue transition-colors duration-150">
            <Header />
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/calculator" element={<CalculatorPage />} />
                <Route path="/calculator.html" element={<Navigate to="/calculator" replace />} />
                <Route path="/print" element={<PrintPage />} />
                <Route path="/print.html" element={<Navigate to="/print" replace />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/about.html" element={<Navigate to="/about" replace />} />
                <Route path="/docs" element={<DocsPage />} />
                <Route path="/docs.html" element={<Navigate to="/docs" replace />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/contact.html" element={<Navigate to="/contact" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </BrowserRouter>
      </GradeProvider>
    </ThemeProvider>
  );
};
