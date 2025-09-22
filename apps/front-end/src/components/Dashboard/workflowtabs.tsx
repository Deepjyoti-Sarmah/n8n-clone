import { useState } from "react";
import { cn } from "@/lib/utils";

interface TabsProps {
  className?: string;
}

const tabs = [
  { id: "workflows", label: "Workflows", active: true },
  { id: "credentials", label: "Credentials" },
  { id: "executions", label: "Executions" },
  { id: "data-tables", label: "Data tables", badge: "beta" },
];

export function WorkflowTabs({ className }: TabsProps) {
  const [activeTab, setActiveTab] = useState("workflows");

  return (
    <div className={cn("border-b border-border", className)}>
      <div className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "pb-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center space-x-2",
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
