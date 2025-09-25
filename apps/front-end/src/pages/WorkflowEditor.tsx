import { useState, useCallback } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type NodeTypes,
  type Edge,
  type Node,
  type Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Zap,
  Plus,
  Save,
  Settings,
  Database,
  Mail,
  Webhook,
  GitBranch,
  Search,
  MessageCircle,
  Bot,
  Globe,
  Icon,
} from "lucide-react";

interface WorkflowNodeData {
  type: "trigger" | "action" | "ai" | "webhook" | "condition";
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  service?: string;
}

// Service Icons Components (using CSS for brand colors)
const GeminiIcon = () => (
  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
    <Bot className="h-3 w-3 text-white" />
  </div>
);

const TelegramIcon = () => (
  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
    <MessageCircle className="h-3 w-3 text-white" />
  </div>
);

const ResendIcon = () => (
  <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
    <Mail className="h-3 w-3 text-white" />
  </div>
);

// Custom Node Component - Much smaller and compact
const CustomNode = ({
  data,
  selected,
}: {
  data: WorkflowNodeData;
  selected: boolean;
}) => {
  const getServiceIcon = () => {
    switch (data.service) {
      case "gemini":
        return <GeminiIcon />;
      case "telegram":
        return <TelegramIcon />;
      case "resend":
        return <ResendIcon />;
      default:
        // const Icon = data.icon;
        return (
          <div
            className={`w-6 h-6 rounded-full ${data.color} flex items-center justify-center`}
          >
            <Icon className="h-3 w-3 text-white" />
          </div>
        );
    }
  };

  return (
    <div
      className={`bg-card border rounded-lg p-2 min-w-[120px] max-w-[140px] transition-all duration-200 hover:shadow-md ${
        selected ? "ring-2 ring-primary shadow-lg" : "shadow-sm"
      }`}
    >
      <div className="flex flex-col items-center gap-2">
        {getServiceIcon()}
        <div className="text-center">
          <div className="text-xs font-medium text-foreground leading-tight">
            {data.name}
          </div>
          {data.service && (
            <div className="text-[10px] text-muted-foreground capitalize">
              {data.service}
            </div>
          )}
        </div>
        {/* Connection points */}
        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-border rounded-full"></div>
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-border rounded-full"></div>
      </div>
    </div>
  );
};

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

const WorkflowEditor = () => {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [workflowName, setWorkflowName] = useState("My workflow 3");

  const initialNodes: Node[] = [
    {
      id: "1",
      type: "custom",
      position: { x: 200, y: 100 },
      data: {
        type: "trigger",
        name: "Chat Action",
        description: "Send a chat message",
        icon: MessageCircle,
        color: "bg-blue-500",
        service: "telegram",
      },
    },
    {
      id: "2",
      type: "custom",
      position: { x: 400, y: 50 },
      data: {
        type: "ai",
        name: "AI Agent",
        description: "AI processing",
        icon: Bot,
        color: "bg-gradient-to-r from-blue-500 to-purple-500",
        service: "gemini",
      },
    },
    {
      id: "3",
      type: "custom",
      position: { x: 600, y: 100 },
      data: {
        type: "action",
        name: "Send Email",
        description: "Send email",
        icon: Mail,
        color: "bg-black",
        service: "resend",
      },
    },
    {
      id: "4",
      type: "custom",
      position: { x: 400, y: 200 },
      data: {
        type: "ai",
        name: "Chat Model",
        description: "Gemini AI model",
        icon: Bot,
        color: "bg-gradient-to-r from-blue-500 to-purple-500",
        service: "gemini",
      },
    },
    {
      id: "5",
      type: "custom",
      position: { x: 500, y: 280 },
      data: {
        type: "action",
        name: "Memory",
        description: "Redis memory",
        icon: Database,
        color: "bg-red-500",
        service: "redis",
      },
    },
    {
      id: "6",
      type: "custom",
      position: { x: 700, y: 200 },
      data: {
        type: "action",
        name: "HTTP Request",
        description: "Make HTTP request",
        icon: Globe,
        color: "bg-purple-500",
      },
    },
  ];

  const initialEdges: Edge[] = [
    { id: "e1-2", source: "1", target: "2", type: "smoothstep" },
    { id: "e2-3", source: "2", target: "3", type: "smoothstep" },
    { id: "e2-4", source: "2", target: "4", type: "smoothstep" },
    { id: "e4-5", source: "4", target: "5", type: "smoothstep" },
    { id: "e3-6", source: "3", target: "6", type: "smoothstep" },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const availableNodes = [
    {
      id: "trigger-telegram",
      type: "trigger",
      name: "Telegram Bot",
      description: "Receive Telegram messages",
      icon: MessageCircle,
      color: "bg-blue-500",
      service: "telegram",
    },
    {
      id: "ai-gemini",
      type: "ai",
      name: "Gemini AI",
      description: "Google Gemini AI model",
      icon: Bot,
      color: "bg-gradient-to-r from-blue-500 to-purple-500",
      service: "gemini",
    },
    {
      id: "action-resend",
      type: "action",
      name: "Resend Email",
      description: "Send emails via Resend",
      icon: Mail,
      color: "bg-black",
      service: "resend",
    },
    {
      id: "trigger-webhook",
      type: "webhook",
      name: "Webhook",
      description: "HTTP webhook trigger",
      icon: Webhook,
      color: "bg-green-500",
    },
    {
      id: "action-database",
      type: "action",
      name: "Database",
      description: "Database operations",
      icon: Database,
      color: "bg-purple-500",
    },
    {
      id: "condition-if",
      type: "condition",
      name: "Condition",
      description: "Branch workflow logic",
      icon: GitBranch,
      color: "bg-yellow-500",
    },
  ];

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) => addEdge({ ...params, type: "smoothstep" }, eds)),
    [setEdges],
  );

  const addNodeToCanvas = (nodeData: any) => {
    const newNode: Node = {
      id: `${nodeData.id}-${Date.now()}`,
      type: "custom",
      position: { x: Math.random() * 200 + 300, y: Math.random() * 200 + 150 },
      data: nodeData,
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar - Node Palette */}
      <div className="w-72 border-r border-border bg-card/30 flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold">Workflow Nodes</h2>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search nodes..."
              className="pl-10 h-8"
              // size="sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="space-y-2">
            {availableNodes.map((node) => (
              <Card
                key={node.id}
                className="cursor-pointer hover:shadow-md transition-all duration-200 border-border/50 hover:border-primary/30"
                onClick={() => addNodeToCanvas(node)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-1.5 rounded-lg ${node.color}/20 flex-shrink-0`}
                    >
                      {node.service === "gemini" && <GeminiIcon />}
                      {node.service === "telegram" && <TelegramIcon />}
                      {node.service === "resend" && <ResendIcon />}
                      {!node.service && (
                        <node.icon className="h-4 w-4 text-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm">{node.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {node.description}
                      </p>
                    </div>
                    <Plus className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="border-b border-border bg-card/30 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Input
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="text-base font-semibold bg-transparent border-none shadow-none focus-visible:ring-0 px-0 h-auto"
              />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                Inactive
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                Share
              </Button>
              <Button
                variant="default"
                size="sm"
                className="bg-orange-500 hover:bg-orange-600"
              >
                Save
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            className="workflow-canvas"
            defaultEdgeOptions={{
              type: "smoothstep",
              style: { stroke: "hsl(var(--border))", strokeWidth: 2 },
            }}
          >
            <Controls className="bg-card border border-border" />
            <MiniMap
              className="bg-card border border-border"
              nodeColor="hsl(var(--primary))"
              nodeStrokeWidth={2}
            />
            <Background
              variant="dots"
              gap={20}
              size={1}
              color="hsl(var(--border))"
            />
          </ReactFlow>
        </div>
      </div>

      {/* Right Sidebar - Node Properties */}
      <div className="w-72 border-l border-border bg-card/30">
        <div className="p-4 border-b border-border">
          <h3 className="text-base font-semibold">
            {selectedNode
              ? `${(selectedNode.data as unknown as WorkflowNodeData)?.name || "Node"} Settings`
              : "Node Properties"}
          </h3>
        </div>

        <div className="p-4">
          {selectedNode ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Node Name</label>
                <Input
                  value={
                    (selectedNode.data as unknown as WorkflowNodeData)?.name ||
                    ""
                  }
                  className="mt-1 h-8"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input
                  value={
                    (selectedNode.data as unknown as WorkflowNodeData)
                      ?.description || ""
                  }
                  className="mt-1 h-8"
                />
              </div>

              {(selectedNode.data as unknown as WorkflowNodeData)?.service ===
                "telegram" && (
                <div>
                  <label className="text-sm font-medium">
                    Telegram Settings
                  </label>
                  <div className="mt-2 space-y-2">
                    <Input placeholder="Bot Token" className="h-8" />
                    <Input placeholder="Chat ID" className="h-8" />
                  </div>
                </div>
              )}

              {(selectedNode.data as unknown as WorkflowNodeData)?.service ===
                "gemini" && (
                <div>
                  <label className="text-sm font-medium">
                    Gemini AI Settings
                  </label>
                  <div className="mt-2 space-y-2">
                    <Input placeholder="API Key" className="h-8" />
                    <Input placeholder="Model" className="h-8" />
                  </div>
                </div>
              )}

              {(selectedNode.data as unknown as WorkflowNodeData)?.service ===
                "resend" && (
                <div>
                  <label className="text-sm font-medium">
                    Resend Configuration
                  </label>
                  <div className="mt-2 space-y-2">
                    <Input placeholder="API Key" className="h-8" />
                    <Input placeholder="From Email" className="h-8" />
                  </div>
                </div>
              )}

              <Button variant="default" className="w-full" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">
                Select a node to configure its properties
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkflowEditor;
