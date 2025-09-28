import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-muted-foreground">404</h1>
        <p className="text-2xl font-semibold mt-4">Page Not Found</p>
        <p className="text-muted-foreground mt-2 mb-8">
          Sorry, the page you are looking for doesn't exist.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => window.history.back()} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          <Link to="/dashboard">
            <Button>
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
