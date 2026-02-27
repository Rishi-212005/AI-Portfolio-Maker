import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex min-h-screen items-center justify-center px-4 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10"
          >
            <Search className="h-12 w-12 text-primary/60" />
          </motion.div>
          <h1 className="mb-2 text-7xl font-extrabold gradient-text">404</h1>
          <h2 className="mb-3 text-2xl font-bold">Page Not Found</h2>
          <p className="mb-8 text-muted-foreground">
            The page <code className="rounded bg-secondary px-2 py-0.5 text-sm font-mono text-primary">{location.pathname}</code> doesn't exist.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/">
              <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Home className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <Button variant="outline" className="gap-2 border-border/60" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
