import React from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BaseNodeProps extends NodeProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  status?: "idle" | "running" | "success" | "error";
  className?: string;
}

export function BaseNode({
  icon,
  title,
  description,
  status = "idle",
  className,
  selected,
  // data,
}: BaseNodeProps) {
  const statusColors = {
    idle: "bg-gray-50 border-gray-200",
    running: "bg-blue-50 border-blue-200 animate-pulse",
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200",
  };

  return (
    <Card
      className={cn(
        "min-w-[200px] transition-all duration-200",
        statusColors[status],
        selected && "ring-2 ring-primary ring-offset-2",
        className,
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 border-2 border-white"
      />

      <div className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-white shadow-sm">{icon}</div>
          <div className="flex-1">
            <h3 className="font-medium text-sm">{title}</h3>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          {status !== "idle" && (
            <Badge variant={status === "error" ? "destructive" : "default"}>
              {status}
            </Badge>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 border-2 border-white"
      />
    </Card>
  );
}
