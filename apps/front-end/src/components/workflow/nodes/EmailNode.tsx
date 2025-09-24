import type { NodeProps } from "@xyflow/react";
import { BaseNode } from "./BaseNode";
import { Mail } from "lucide-react";

export function EmailNode(props: NodeProps) {
  return (
    <BaseNode
      {...props}
      icon={<Mail className="w-4 h-4 text-green-600" />}
      title="Email"
      description="Send email via Resend"
      className="node-email"
    />
  );
}
