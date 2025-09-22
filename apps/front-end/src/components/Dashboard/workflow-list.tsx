import { Search, Filter, MoreHorizontal, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface WorkflowListProps {
  className?: string;
}

const workflows = [
  {
    id: 1,
    name: "My workflow",
    lastUpdated: "2 days ago",
    created: "19 September",
    status: "Inactive",
    isPersonal: true,
  },
];

export function WorkflowList({ className }: WorkflowListProps) {
  const navigate = useNavigate();
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring w-64"
            />
          </div>
          <select className="bg-input border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
            <option>Sort by last updated</option>
          </select>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        <Button
          className="hover:opacity-90 text-white "
          onClick={() => navigate("/workflow/new")}
        >
          Create Workflow
        </Button>
      </div>

      {/* Info Banner */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
            <span className="text-primary text-xs">⚡</span>
          </div>
          <div className="text-foreground">
            <span>Get started faster with our </span>
            <button className="text-primary underline">pre-built agents</button>
          </div>
        </div>
        <button className="text-muted-foreground hover:text-foreground">
          ×
        </button>
      </div>

      {/* Workflow Items */}
      <div className="space-y-3">
        {workflows.map((workflow) => (
          <div
            key={workflow.id}
            className="bg-card border border-border rounded-lg p-4 hover:bg-card/80 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-muted-foreground text-xs">📋</span>
                </div>
                <div>
                  <h3 className="text-card-foreground font-medium">
                    {workflow.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Last updated {workflow.lastUpdated} | Created{" "}
                    {workflow.created}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {workflow.isPersonal && (
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground text-sm">
                      Personal
                    </span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground text-sm">
                    {workflow.status}
                  </span>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-4">
        <span className="text-muted-foreground text-sm">Total 1</span>
        <div className="flex items-center space-x-4">
          <span className="text-muted-foreground text-sm">1</span>
          <select className="bg-input border border-border rounded px-2 py-1 text-sm">
            <option>50/page</option>
          </select>
        </div>
      </div>
    </div>
  );
}
