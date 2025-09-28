// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Zap, Settings, LogOut, User, Key, Home } from "lucide-react";
// import { useAuthStore } from "@/store/authStore";
// import { cn } from "@/lib/utils";

// const navigation = [
//   { name: "Dashboard", href: "/dashboard", icon: Home },
//   { name: "Credentials", href: "/credentials", icon: Key },
// ];

// export function Navbar() {
//   const { user, logout } = useAuthStore();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleLogout = () => {
//     logout();
//     navigate("/");
//   };

//   const isActive = (href: string) => location.pathname === href;

//   return (
//     <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ">
//       <div className="px-6 lg:px-8 h-16 flex items-center justify-between max-w-7xl mx-auto ">
//         {/* Left section - Logo & Navigation */}
//         <div className="flex items-center ">
//           {/* Logo */}
//           <Link to="/dashboard" className="flex items-center gap-2 mr-6">
//             <Zap className="h-6 w-6 text-primary" />
//             <span className="font-bold text-lg">WorkflowAI</span>
//           </Link>

//           {/* Desktop navigation */}
//           <nav className="hidden md:flex md:items-center md:gap-1">
//             {navigation.map((item) => {
//               const Icon = item.icon;
//               return (
//                 <Link
//                   key={item.name}
//                   to={item.href}
//                   className={cn(
//                     "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
//                     isActive(item.href)
//                       ? "bg-primary/10 text-primary"
//                       : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
//                   )}
//                 >
//                   <Icon className="h-4 w-4" />
//                   <span>{item.name}</span>
//                 </Link>
//               );
//             })}
//           </nav>
//         </div>

//         {/* Right section - Actions & User */}
//         <div className="flex items-center gap-3">
//           <Button
//             onClick={() => navigate("/workflow/new")}
//             size="sm"
//             className="hidden sm:inline-flex"
//           >
//             <Zap className="h-4 w-4 mr-2" />
//             New Workflow
//           </Button>

//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="relative h-8 w-8 rounded-full"
//               >
//                 <Avatar className="h-8 w-8">
//                   <AvatarFallback className="text-sm">
//                     {user?.email?.charAt(0).toUpperCase() || "U"}
//                   </AvatarFallback>
//                 </Avatar>
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent className="w-56" align="end" forceMount>
//               <div className="flex items-center justify-start gap-2 p-2">
//                 <div className="flex flex-col space-y-0.5">
//                   <p className="text-sm font-medium leading-none truncate">
//                     {user?.email}
//                   </p>
//                   <p className="text-xs leading-none text-muted-foreground">
//                     Free Plan
//                   </p>
//                 </div>
//               </div>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem onClick={() => navigate("/profile")}>
//                 <User className="mr-2 h-4 w-4" />
//                 <span>Profile</span>
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => navigate("/settings")}>
//                 <Settings className="mr-2 h-4 w-4" />
//                 <span>Settings</span>
//               </DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem onClick={handleLogout}>
//                 <LogOut className="mr-2 h-4 w-4" />
//                 <span>Logout</span>
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>
//     </nav>
//   );
// }
//
//
import { Link, useNavigate } from "react-router-dom";
import { Zap, Home, Key, LogOut, User } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to landing page after logout
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-800">
      <div className="px-6 h-16 flex items-center justify-between max-w-7xl mx-auto">
        {/* Left section - Logo & Navigation */}
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-blue-500" />
            <span className="font-bold text-lg">WorkflowAI</span>
          </Link>
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/credentials"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <Key className="h-4 w-4" />
              <span>Credentials</span>
            </Link>
          </div>
        </div>

        {/* Right section - Actions & User */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/workflow/new")}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            <Zap className="h-4 w-4" />
            New Workflow
          </button>

          <div className="group relative">
            <button className="flex items-center gap-2 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800">
              <User className="h-5 w-5" />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
              <div className="p-2 border-b border-neutral-200 dark:border-neutral-700">
                <p className="text-sm font-medium truncate">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-700"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
