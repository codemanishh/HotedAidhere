import { Link } from "react-router-dom";
import { Download, SlidersHorizontal, X, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useVisitTracker } from "@/hooks/useVisitTracker";
import logo from "@/assets/logo.png";
const locations = [{
  name: "Bangalore Jobs",
  path: "/?location=bangalore"
}, {
  name: "Hyderabad Jobs",
  path: "/?location=hyderabad"
}, {
  name: "Chennai Jobs",
  path: "/?location=chennai"
}, {
  name: "Delhi Jobs",
  path: "/?location=delhi"
}, {
  name: "Pune Jobs",
  path: "/?location=pune"
}, {
  name: "Mumbai Jobs",
  path: "/?location=mumbai"
}, {
  name: "Kolkata Jobs",
  path: "/?location=kolkata"
}];
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
  }>;
}
export const Header = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [showLocations, setShowLocations] = useState(false);
  const { formattedStats, loading } = useVisitTracker();
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
    const {
      outcome
    } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowInstall(false);
    }
    setDeferredPrompt(null);
  };
  return <header className="sticky top-0 z-50 w-full animate-fade-in">
      {/* Main Header */}
      <div className="bg-gradient-to-r from-header via-header to-primary/90 shadow-lg">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-md group-hover:blur-lg transition-all" />
              <img src={logo} alt="Freshers Junction Logo" className="relative h-12 w-12 rounded-full bg-card p-0.5 shadow-md transition-transform group-hover:scale-110 group-hover:rotate-3" />
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
          
          <div className="flex items-center gap-3">
            {/* Visit Stats */}
            <div className="hidden sm:flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-header-foreground/10 text-header-foreground/90">
                <Eye className="h-3 w-3" />
                <span className="font-medium">Today:</span>
                <span className="font-bold">{loading ? "..." : formattedStats.today}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-header-foreground/10 text-header-foreground/90">
                <Eye className="h-3 w-3" />
                <span className="font-medium">Total:</span>
                <span className="font-bold">{loading ? "..." : formattedStats.total}</span>
              </div>
            </div>
            
            <nav className="flex items-center gap-3">
              <Link to="/" className="text-sm font-medium text-header-foreground/80 transition-colors hover:text-header-foreground hidden sm:block">
                Home
              </Link>
              {showInstall && <Button onClick={handleInstallClick} size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground gap-1.5 shadow-md hover:shadow-lg transition-all hover:scale-105">
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Install App</span>
                </Button>}
            </nav>
          </div>
        </div>
      </div>

      {/* Location Navigation Bar */}
      <div className="bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        {/* Desktop - static centered */}
        <div className="hidden md:block container">
          <nav className="flex items-center justify-center gap-2 py-3">
            {locations.map(loc => <Link key={loc.name} to={loc.path} className="group relative px-4 py-2 whitespace-nowrap rounded-lg transition-all duration-200 font-medium text-sm text-muted-foreground hover:text-primary">
                <span className="relative z-10">{loc.name}</span>
                <span className="absolute inset-0 bg-primary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary rounded-full group-hover:w-3/4 transition-all duration-300" />
              </Link>)}
          </nav>
        </div>
        
        {/* Mobile - Location button with dropdown */}
        <div className="md:hidden py-2 px-4">
          <div className="flex items-center justify-between">
            <button onClick={() => setShowLocations(!showLocations)} className="flex items-center gap-2 rounded-full bg-primary/10 text-primary font-medium text-sm border border-primary/20 hover:bg-primary/20 transition-all px-[9px] py-px">
              <SlidersHorizontal className="h-4 w-[12px]" />
              <span>Location</span>
            </button>
            
            {/* Mobile Visit Stats */}
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary">
                <Eye className="h-3 w-3" />
                <span className="font-medium">Today:</span>
                <span className="font-bold">{loading ? "..." : formattedStats.today}</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-muted-foreground">
                <Eye className="h-3 w-3" />
                <span className="font-medium">Total:</span>
                <span className="font-bold">{loading ? "..." : formattedStats.total}</span>
              </div>
            </div>
          </div>
          
          {/* Location dropdown */}
          {showLocations && <div className="mt-3 p-3 bg-card rounded-xl border border-border shadow-lg animate-fade-in">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Select Location</span>
                <button onClick={() => setShowLocations(false)} className="p-1 rounded-full hover:bg-muted transition-colors">
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {locations.map(loc => <Link key={loc.name} to={loc.path} onClick={() => setShowLocations(false)} className="px-3 py-2 rounded-lg text-sm font-medium text-foreground bg-muted/50 hover:bg-primary/10 hover:text-primary transition-all text-center">
                    {loc.name.replace(" Jobs", "")}
                  </Link>)}
              </div>
            </div>}
        </div>
      </div>
    </header>;
};