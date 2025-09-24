// import { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { Menu, X, Zap } from "lucide-react";
// import { Button } from "./ui/button";
// import { cn } from "../lib/utils";

// const menuItems = [
//   { name: "Features", href: "#features" },
//   { name: "Pricing", href: "#pricing" },
//   { name: "Documentation", href: "#docs" },
// ];

// export function Navbar() {
//   const [menuState, setMenuState] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const location = useLocation();
//   const isLandingPage = location.pathname === "/";

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 50);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Don't show navbar on dashboard and workflow pages
//   if (!isLandingPage) {
//     return null;
//   }

//   return (
//     <header>
//       <nav
//         data-state={menuState && "active"}
//         className={cn(
//           "fixed z-20 w-full transition-all duration-300",
//           isScrolled &&
//             "bg-background/95 border-b border-border backdrop-blur-lg",
//         )}
//       >
//         <div className="mx-auto max-w-7xl px-6">
//           <div className="relative flex flex-wrap items-center justify-between gap-6 py-4 lg:gap-0">
//             <div className="flex w-full justify-between gap-6 lg:w-auto">
//               <Link
//                 to="/"
//                 aria-label="home"
//                 className="flex items-center space-x-2"
//               >
//                 <div className="flex items-center space-x-2">
//                   <div className="bg-primary rounded-lg p-2">
//                     <Zap className="h-6 w-6 text-primary-foreground" />
//                   </div>
//                   <span className="text-xl font-bold text-foreground">
//                     WorkflowAI
//                   </span>
//                 </div>
//               </Link>

//               <button
//                 onClick={() => setMenuState(!menuState)}
//                 aria-label={menuState ? "Close Menu" : "Open Menu"}
//                 className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
//               >
//                 <Menu className="data-[state=active]:rotate-180 data-[state=active]:scale-0 data-[state=active]:opacity-0 m-auto size-6 duration-200" />
//                 <X className="data-[state=active]:rotate-0 data-[state=active]:scale-100 data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
//               </button>

//               <div className="m-auto hidden size-fit lg:block">
//                 <ul className="flex gap-1">
//                   {menuItems.map((item, index) => (
//                     <li key={index}>
//                       <Button asChild variant="ghost" size="sm">
//                         <a
//                           href={item.href}
//                           className="text-base text-muted-foreground hover:text-foreground"
//                         >
//                           <span>{item.name}</span>
//                         </a>
//                       </Button>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>

//             <div className="data-[state=active]:block lg:data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border bg-background p-6 shadow-2xl md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none">
//               <div className="lg:hidden">
//                 <ul className="space-y-6 text-base">
//                   {menuItems.map((item, index) => (
//                     <li key={index}>
//                       <a
//                         href={item.href}
//                         className="text-muted-foreground hover:text-foreground block duration-150"
//                       >
//                         <span>{item.name}</span>
//                       </a>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//               <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
//                 <Button
//                   asChild
//                   variant="ghost"
//                   size="sm"
//                   className={cn(isScrolled && "lg:hidden")}
//                 >
//                   <Link to="/dashboard">
//                     <span>Dashboard</span>
//                   </Link>
//                 </Button>
//                 <Button
//                   asChild
//                   size="sm"
//                   className={cn(isScrolled && "lg:hidden")}
//                 >
//                   <Link to="/workflow/new">
//                     <span>Get Started</span>
//                   </Link>
//                 </Button>
//                 <Button
//                   asChild
//                   size="sm"
//                   className={cn(isScrolled ? "lg:inline-flex" : "hidden")}
//                 >
//                   <Link to="/workflow/new">
//                     <span>Get Started</span>
//                   </Link>
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </nav>
//     </header>
//   );
// }

import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Zap, Settings, LogOut, User, Key, Home, Menu, X } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Credentials", href: "/credentials", icon: Key },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl">WorkflowAI</span>
            </Link>

            {/* Desktop navigation */}
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive(item.href)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* New Workflow Button */}
            <Button
              onClick={() => navigate("/workflow/new")}
              size="sm"
              className="hidden sm:inline-flex"
            >
              <Zap className="h-4 w-4 mr-2" />
              New Workflow
            </Button>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {user?.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.email}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      Free Plan
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-border">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors",
                      isActive(item.href)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent",
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              <Button
                onClick={() => {
                  navigate("/workflow/new");
                  setMobileMenuOpen(false);
                }}
                size="sm"
                className="w-full mt-4"
              >
                <Zap className="h-4 w-4 mr-2" />
                New Workflow
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
