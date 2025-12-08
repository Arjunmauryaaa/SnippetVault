import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      {/* Background */}
      <div className="fixed inset-0 bg-hero-gradient" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-destructive/5 via-transparent to-transparent" />
      
      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Terminal className="w-6 h-6 text-primary-foreground" />
          </div>
        </div>
        
        <h1 className="text-8xl font-bold gradient-text mb-4">404</h1>
        <p className="text-2xl font-semibold mb-2">Page not found</p>
        <p className="text-muted-foreground mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Button asChild variant="hero" size="lg">
          <Link to="/">
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFound;
