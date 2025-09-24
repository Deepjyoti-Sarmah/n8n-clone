import type { NodeProps } from "@xyflow/react";
import { BaseNode } from "./BaseNode";
import { MessageCircle } from "lucide-react";

export function TelegramNode(props: NodeProps) {
  return (
    <BaseNode
      {...props}
      icon={<MessageCircle className="w-4 h-4 text-blue-500" />}
      title="Telegram"
      description="Send Telegram message"
      className="node-telegram"
    />
  );
}
