import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6 px-6">
        <div className="space-y-2">
          <h1 className="text-8xl font-bold text-gradient-quantum">404</h1>
          <p className="text-2xl font-semibold">Page Not Found</p>
          <p className="text-muted-foreground max-w-md">
            The page you're looking for doesn't exist in the QuantumMesh network.
          </p>
        </div>
        <Button variant="quantum" asChild>
          <a href="/">
            <Home className="mr-2 h-4 w-4" />
            Return to Home
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
