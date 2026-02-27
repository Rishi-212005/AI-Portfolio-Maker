import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Sparkles, LogOut, Settings, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Templates", path: "/templates" },
  { label: "Case Study", path: "/case-study" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isLoggedIn = !!user;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("auth_user");
      if (stored) {
        const parsed = JSON.parse(stored) as { name?: string; email?: string };
        if (parsed && (parsed.name || parsed.email)) {
          setUser({
            name: parsed.name ?? "",
            email: parsed.email ?? "",
          });
        }
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setUser(null);
    setProfileOpen(false);
    navigate("/");
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "border-b border-border/50 bg-background/90 backdrop-blur-xl shadow-lg shadow-background/20" : "border-b border-border/30 bg-background/60 backdrop-blur-md"}`}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <span className="text-lg font-bold">
            Port<span className="gradient-text">Gen</span> AI
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link key={item.path + item.label} to={item.path}>
              <Button
                variant="ghost"
                size="sm"
                className={`text-sm transition-colors ${location.pathname === item.path ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"}`}
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-full bg-secondary/50 px-3 py-1.5 text-sm hover:bg-secondary transition-colors"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {user?.name
                    ?.split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((n) => n[0]?.toUpperCase())
                    .join("") || "U"}
                </div>
                <span className="text-sm font-medium">
                  {user?.name || user?.email || "User"}
                </span>
                <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${profileOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 glass-card rounded-xl overflow-hidden border border-border/50 shadow-xl"
                  >
                    <div className="p-3 border-b border-border/30">
                      <p className="text-sm font-semibold">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                    <div className="p-1">
                      <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
                        <Settings className="h-4 w-4" /> Settings
                      </button>
                      <button
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4" /> Log out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link to="/dashboard">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-border/50 bg-background/95 backdrop-blur-xl md:hidden overflow-hidden"
          >
            <div className="flex flex-col gap-2 p-4">
              {navItems.map((item) => (
                <Link key={item.path + item.label} to={item.path} onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className={`w-full justify-start ${location.pathname === item.path ? "text-primary" : ""}`}>{item.label}</Button>
                </Link>
              ))}
              {!isLoggedIn ? (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">Log in</Button>
                  </Link>
                  <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-primary text-primary-foreground">Get Started</Button>
                  </Link>
                </>
              ) : (
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive"
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" /> Log out
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
