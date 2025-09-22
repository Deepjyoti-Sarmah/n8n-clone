import { 
    Home,
    FileText,
    Variable,
    BarChart3,
    HelpCircle,
    Sparkles,
    Settings,
    User
  } from 'lucide-react';
  import { cn } from '@/lib/utils';
  
  interface SidebarProps {
    className?: string;
  }
  
  const navigationItems = [
    { icon: Home, label: 'Overview', active: true },
    { icon: FileText, label: 'Templates' },
    { icon: Variable, label: 'Variables' },
    { icon: BarChart3, label: 'Insights' },
    { icon: HelpCircle, label: 'Help' },
    { icon: Sparkles, label: "What's New" },
  ];
  
  export function Sidebar({ className }: SidebarProps) {
    return (
      <aside className={cn("w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-screen", className)}>
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-n8n rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">n8n</span>
            </div>
            <span className="text-sidebar-foreground font-semibold text-lg">n8n Clone</span>
          </div>
        </div>
  
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.label}
              className={cn(
                "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200",
                item.active 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
  
        {/* User Section */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-sidebar-accent transition-colors duration-200 cursor-pointer">
            <div className="w-8 h-8 bg-sidebar-primary rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-sidebar-primary-foreground" />
            </div>
            <div className="flex-1">
              <div className="text-sidebar-foreground text-sm font-medium">local local</div>
              <div className="text-sidebar-foreground/60 text-xs">Admin</div>
            </div>
            <Settings className="w-4 h-4 text-sidebar-foreground/60" />
          </div>
        </div>
      </aside>
    );
  }
