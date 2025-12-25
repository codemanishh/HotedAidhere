import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

export const Footer = () => {
  return (
    <footer className="bg-footer text-footer-foreground">
      <div className="h-0.5 bg-gradient-to-r from-primary via-accent to-primary" />
      
      <div className="container py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Logo & Branding */}
          <Link to="/" className="group flex items-center gap-2">
            <img 
              src={logo} 
              alt="Job Hunting Logo" 
              className="h-8 w-8 rounded-full bg-card p-0.5"
            />
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-sm font-bold text-footer-foreground">
                Job Hunting
              </span>
              <span className="text-xs text-footer-foreground/70">
                with Codemanishh
              </span>
            </div>
          </Link>

          {/* Center: Social + Privacy */}
          <div className="flex items-center gap-4">
            <a 
              href="https://t.me/TechJob_finder" 
              target="_blank" 
              rel="noopener noreferrer"
              className="h-7 w-7 flex items-center justify-center rounded-full bg-footer-foreground/10 text-footer-foreground hover:bg-[#0088cc] transition-colors"
              aria-label="Telegram"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
            </a>
            <a 
              href="https://www.instagram.com/codemanishh/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="h-7 w-7 flex items-center justify-center rounded-full bg-footer-foreground/10 text-footer-foreground hover:bg-gradient-to-br hover:from-[#f09433] hover:to-[#dc2743] transition-colors"
              aria-label="Instagram"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <span className="text-footer-foreground/30">|</span>
            <Link 
              to="/privacy-policy" 
              className="text-xs text-footer-muted hover:text-footer-foreground transition-colors"
            >
              Privacy Policy
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-xs text-footer-muted">
            © {new Date().getFullYear()} Codemanishh
          </p>
        </div>
      </div>
    </footer>
  );
};
