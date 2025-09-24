// import { useLocation } from "react-router-dom";
// import { useEffect } from "react";

// export function NotFound() {
//   const location = useLocation();

//   useEffect(() => {
//     console.error(
//       "404 Error: User attempted to access non-existent route:",
//       location.pathname,
//     );
//   }, [location.pathname]);

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-100">
//       <div className="text-center">
//         <h1 className="mb-4 text-4xl font-bold">404</h1>
//         <p className="mb-4 text-xl text-gray-600">Oops! Page not found</p>
//         <a href="/" className="text-blue-500 underline hover:text-blue-700">
//           Return to Home
//         </a>
//       </div>
//     </div>
//   );
// }
//
//

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
