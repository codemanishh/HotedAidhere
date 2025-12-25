import { Link } from "react-router-dom";
import { Download } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const locations = [
  { name: "Bangalore Jobs", path: "/?location=bangalore" },
  { name: "Hyderabad Jobs", path: "/?location=hyderabad" },
  { name: "Chennai Jobs", path: "/?location=chennai" },
  { name: "Delhi Jobs", path: "/?location=delhi" },
  { name: "Pune Jobs", path: "/?location=pune" },
  { name: "Mumbai Jobs", path: "/?location=mumbai" },
];

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const Header = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowInstall(false);
    }
    setDeferredPrompt(null);
  };

  // Touch drag handling for marquee
  const handleTouchStart = () => {
    setIsPaused(true);
  };

  const handleTouchEnd = () => {
    // Resume animation after a short delay
    setTimeout(() => setIsPaused(false), 2000);
  };

  return (
    <header className="sticky top-0 z-50 w-full animate-fade-in">
      {/* Main Header */}
      <div className="bg-gradient-to-r from-header via-header to-primary/90 shadow-lg">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-md group-hover:blur-lg transition-all" />
              <img 
                src={logo} 
                alt="Freshers Junction Logo" 
                className="relative h-12 w-12 rounded-full bg-card p-0.5 shadow-md transition-transform group-hover:scale-110 group-hover:rotate-3"
              />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-display text-xl font-bold text-header-foreground tracking-tight leading-none">
                Job Hunting
              </span>
              <span className="font-display text-xs font-medium text-header-foreground/80 tracking-wide">
                with Codemanishh
              </span>
            </div>
          </Link>
          
          <nav className="flex items-center gap-3">
            <Link 
              to="/" 
              className="text-sm font-medium text-header-foreground/80 transition-colors hover:text-header-foreground hidden sm:block"
            >
              Home
            </Link>
            {showInstall && (
              <Button
                onClick={handleInstallClick}
                size="sm"
                className="bg-accent hover:bg-accent/90 text-accent-foreground gap-1.5 shadow-md hover:shadow-lg transition-all hover:scale-105"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Install App</span>
              </Button>
            )}
          </nav>
        </div>
      </div>

      {/* Location Navigation Bar */}
      <div className="bg-card/95 backdrop-blur-md border-b border-border shadow-sm overflow-hidden">
        {/* Desktop - static centered */}
        <div className="hidden md:block container">
          <nav className="flex items-center justify-center gap-2 py-3">
            {locations.map((loc, i) => (
              <Link
                key={loc.name}
                to={loc.path}
                className="group relative px-4 py-2 whitespace-nowrap rounded-lg transition-all duration-200 font-medium text-sm text-muted-foreground hover:text-primary"
              >
                <span className="relative z-10">{loc.name}</span>
                <span className="absolute inset-0 bg-primary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary rounded-full group-hover:w-3/4 transition-all duration-300" />
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Mobile - marquee animation with touch drag scroll */}
        <div 
          ref={marqueeRef}
          className="md:hidden py-2 overflow-x-auto scrollbar-hide touch-pan-x"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className={`flex ${isPaused ? '' : 'animate-marquee'}`}
            style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
          >
            {[...locations, ...locations].map((loc, i) => (
              <Link
                key={`${loc.name}-${i}`}
                to={loc.path}
                className="px-4 py-1.5 whitespace-nowrap font-medium text-xs text-muted-foreground hover:text-primary flex-shrink-0"
              >
                {loc.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
