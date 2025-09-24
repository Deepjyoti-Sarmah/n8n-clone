import type { NodeProps } from "@xyflow/react";
import { BaseNode } from "./BaseNode";
import { Brain } from "lucide-react";

export function GeminiNode(props: NodeProps) {
  return (
    <BaseNode
      {...props}
      icon={<Brain className="w-4 h-4 text-blue-600" />}
      title="Gemini AI"
      description="AI-powered text generation"
      className="node-gemini"
    />
  );
}
