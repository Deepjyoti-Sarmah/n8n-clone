import {
  Home,
  FileText,
  Variable,
  BarChart3,
  HelpCircle,
  Sparkles,
  Settings,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

const navigationItems = [
  { icon: Home, label: "Overview", active: true },
  { icon: FileText, label: "Templates" },
  { icon: Variable, label: "Variables" },
  { icon: BarChart3, label: "Insights" },
  { icon: HelpCircle, label: "Help" },
  { icon: Sparkles, label: "What's New" },
];

export function Sidebar({ className }: SidebarProps) {
  return (
    <aside
      className={cn(
        "w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-full flex-shrink-0",
        className,
      )}
    >
      {/* Logo */}
      <div className="px-6 py-6 border-b border-sidebar-border flex-shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-primary-foreground font-bold text-sm">
              n8n
            </span>
          </div>
          <span className="text-sidebar-foreground font-semibold text-lg truncate">
            Clone
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {navigationItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200",
              item.active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium truncate">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User Section */}
      <div className="px-4 py-4 border-t border-sidebar-border flex-shrink-0">
        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-sidebar-accent transition-colors duration-200 cursor-pointer">
          <div className="w-8 h-8 bg-sidebar-primary rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-sidebar-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sidebar-foreground text-sm font-medium truncate">
              local local
            </div>
            <div className="text-sidebar-foreground/60 text-xs">Admin</div>
          </div>
          <Settings className="w-4 h-4 text-sidebar-foreground/60 flex-shrink-0" />
        </div>
      </div>
    </aside>
  );
}
