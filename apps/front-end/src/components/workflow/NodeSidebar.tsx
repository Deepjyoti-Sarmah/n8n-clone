import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Brain, MessageCircle, Mail } from "lucide-react";

const nodeCategories = [
  {
    title: "AI & LLM",
    nodes: [
      {
        type: "gemini",
        title: "Gemini AI",
        description: "AI-powered text generation",
        icon: Brain,
        color: "text-blue-600",
      },
    ],
  },
  {
    title: "Communication",
    nodes: [
      {
        type: "telegram",
        title: "Telegram",
        description: "Send message to Telegram",
        icon: MessageCircle,
        color: "text-blue-500",
      },
      {
        type: "email",
        title: "Email",
        description: "Send emails via Resend",
        icon: Mail,
        color: "text-green-600",
      },
    ],
  },
];

export function NodeSidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="w-80 bg-background border-r border-border p-4 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Workflow Nodes</h2>
        <p className="text-sm text-muted-foreground">
          Drag and drop nodes to build your workflow
        </p>
      </div>

      {nodeCategories.map((category, categoryIndex) => (
        <Card key={categoryIndex} className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">{category.title}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {category.nodes.map((node, nodeIndex) => (
                <div
                  key={nodeIndex}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 cursor-grab active:cursor-grabbing transition-colors"
                  draggable
                  onDragStart={(event) => onDragStart(event, node.type)}
                >
                  <div className="p-2 rounded-md bg-muted">
                    <node.icon className={`w-4 h-4 ${node.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{node.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {node.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
