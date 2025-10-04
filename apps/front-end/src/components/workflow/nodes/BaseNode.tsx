// import React from "react";
// import { Handle, Position, type NodeProps } from "@xyflow/react";
// import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { cn } from "@/lib/utils";

// interface BaseNodeProps extends NodeProps {
//   icon: React.ReactNode;
//   title: string;
//   description?: string;
//   status?: "idle" | "running" | "success" | "error";
//   className?: string;
// }

// export function BaseNode({
//   icon,
//   title,
//   description,
//   status = "idle",
//   className,
//   selected,
//   // data,
// }: BaseNodeProps) {
//   const statusColors = {
//     idle: "bg-gray-50 border-gray-200",
//     running: "bg-blue-50 border-blue-200 animate-pulse",
//     success: "bg-green-50 border-green-200",
//     error: "bg-red-50 border-red-200",
//   };

//   return (
//     <Card
//       className={cn(
//         "min-w-[200px] transition-all duration-200",
//         statusColors[status],
//         selected && "ring-2 ring-primary ring-offset-2",
//         className,
//       )}
//     >
//       <Handle
//         type="target"
//         position={Position.Left}
//         className="w-3 h-3 border-2 border-white"
//       />

//       <div className="p-4">
//         <div className="flex items-center gap-3 mb-2">
//           <div className="p-2 rounded-lg bg-white shadow-sm">{icon}</div>
//           <div className="flex-1">
//             <h3 className="font-medium text-sm">{title}</h3>
//             {description && (
//               <p className="text-xs text-muted-foreground">{description}</p>
//             )}
//           </div>
//           {status !== "idle" && (
//             <Badge variant={status === "error" ? "destructive" : "default"}>
//               {status}
//             </Badge>
//           )}
//         </div>
//       </div>

//       <Handle
//         type="source"
//         position={Position.Right}
//         className="w-3 h-3 border-2 border-white"
//       />
//     </Card>
//   );
// }

import type { NodeStatus } from "@/hooks/useWorkflowEvents";
import type { FlowNodeData } from "@/types/workflow";
import { memo } from "react";
import { Handle, Position } from "@xyflow/react";

type CustomNodeProps = {
  data: FlowNodeData & { status?: NodeStatus };
  selected?: boolean;
};

const BaseNode = ({ data }: CustomNodeProps) => {
  if (!data) return null;

  const tooltipContent = `Node ID: ${data.id}
    Type: ${data.type}
    Use in config as : {{ $node.${data.id} }}
    ${data.type === "Gemini" ? "\nOutput: {{ $node." + data.id + ".text }}" : ""}
    `;

  let execDotColor = "bg-zinc-400";
  let execDotLabel = "Idle (not running)";
  if (data.status === "running") {
    execDotColor = "bg-yellow-500";
    execDotLabel = "Running";
  }

  if (data.status === "success") {
    execDotColor = "bg-green-500";
    execDotLabel = "Succeeded";
  }
  if (data.status === "failed") {
    execDotColor = "bg-red-500";
    execDotLabel = "Failed";
  }

  const credReady = !!data.credentialsId;
  const credsDotColor = credReady ? "bg-green-500" : "bg-yellow-500";
  const credsDotLabel = credReady ? "Credentials ready" : "Missing credentials";

  return (
    <div
      className="px-4 py-2 shadow-md rounded-md border group relative bg-card text-card-foreground"
      title={tooltipContent}
    >
      {/* Tooltip - only visible on hover */}
      <div
        className="absolute bottom-full left-0 mb-2 p-2 rounded text-sm whitespace-pre
          opacity-0 group-hover:opacity-100 transition-opacity
          bg-popover text-popover-foreground
          border border-border
          shadow-lg z-50
        "
      >
        {tooltipContent}
      </div>

      <div className="flex items-center justify-center relative">
        {/* Execution status dot (bottom-right) */}
        <div
          className={`absolute top-5 -right-3 w-2 h-2 rounded-full ${execDotColor}`}
          title={`Execution status: ${execDotLabel}`}
        >
          <div className={`w-2 h-2 rounded-full ${execDotColor}`} />
        </div>

        {/* Credentials status dot (top-right) */}
        <div
          className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${credsDotColor}`}
          title={`Credentials: ${credsDotLabel}`}
        />

        {/* Node icon and label */}
        <div className="relative">
          <img
            src={`/icons/${data.type}.svg`}
            alt={data.label}
            className="w-8 h-8"
          />
          <div className="absolute -bottom-1 -right-1 text-[10px] px-1 rounded-sm bg-muted text-muted-foreground">
            {String(data.id)}
          </div>
        </div>
      </div>

      {/* Connection handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-2 h-2 !bg-border"
      />

      <Handle
        type="source"
        position={Position.Right}
        className="w-2 h-2 !bg-border"
      />
    </div>
  );
};

export default memo(BaseNode);
