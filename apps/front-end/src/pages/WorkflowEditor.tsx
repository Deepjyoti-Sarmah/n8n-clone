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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Zap,
  Plus,
  Save,
  Play,
  Settings,
  Database,
  Mail,
  Webhook,
  GitBranch,
  Search,
} from "lucide-react";
import { BackButton } from "@/components/BackButton";

interface WorkflowNodeData {
  type: "trigger" | "action" | "condition" | "webhook";
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

// Custom Node Component
const CustomNode = ({
  data,
  selected,
}: {
  data: WorkflowNodeData;
  selected: boolean;
}) => {
  const Icon = data.icon;

  return (
    <Card
      className={`w-64 transition-all duration-200 hover:shadow-lg ${selected ? "ring-2 ring-primary" : ""}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${data.color}/20`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-base">{data.name}</CardTitle>
            <p className="text-xs text-muted-foreground">{data.description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">
            Status: <span className="text-green-500">Ready</span>
          </div>
          <div className="w-full h-1 bg-muted rounded">
            <div className="w-full h-1 bg-green-500 rounded"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

const WorkflowEditor = () => {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [workflowName, setWorkflowName] = useState("Untitled Workflow");

  const initialNodes: Node[] = [
    {
      id: "1",
      type: "custom",
      position: { x: 250, y: 50 },
      data: {
        type: "trigger",
        name: "Start",
        description: "Workflow starting point",
        icon: Zap,
        color: "bg-green-500",
      },
    },
  ];

  const initialEdges: Edge[] = [];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const availableNodes = [
    {
      id: "trigger-webhook",
      type: "trigger",
      name: "Webhook",
      description: "Trigger when webhook receives data",
      icon: Webhook,
      color: "bg-green-500",
    },
    {
      id: "action-email",
      type: "action",
      name: "Send Email",
      description: "Send email notifications",
      icon: Mail,
      color: "bg-blue-500",
    },
    {
      id: "action-database",
      type: "action",
      name: "Database Query",
      description: "Execute database operations",
      icon: Database,
      color: "bg-purple-500",
    },
    {
      id: "condition-if",
      type: "condition",
      name: "IF Condition",
      description: "Branch workflow based on conditions",
      icon: GitBranch,
      color: "bg-yellow-500",
    },
  ];

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const addNodeToCanvas = (nodeData: any) => {
    const newNode: Node = {
      id: `${nodeData.id}-${Date.now()}`,
      type: "custom",
      position: { x: Math.random() * 300 + 100, y: Math.random() * 300 + 100 },
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
      <div className="w-80 border-r border-border bg-card/50 flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-6 w-6 text-primary" />
            <h2 className="text-lg font-semibold">Workflow Nodes</h2>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search nodes..." className="pl-10" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {availableNodes.map((node) => (
              <Card
                key={node.id}
                className="cursor-pointer hover:shadow-md transition-all duration-200 border-border/50 hover:border-primary/50"
                onClick={() => addNodeToCanvas(node)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${node.color}/20`}>
                      <node.icon className={`h-4 w-4 text-white`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{node.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {node.description}
                      </p>
                    </div>
                    <Plus className="h-4 w-4 text-muted-foreground" />
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
        <div className="border-b border-border bg-card/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Input
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="text-lg font-semibold bg-transparent border-none shadow-none focus-visible:ring-0 px-0"
              />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Draft
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="default" size="sm">
                <Play className="h-4 w-4 mr-2" />
                Test
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
          >
            <Controls />
            <MiniMap />
            <Background />
          </ReactFlow>
        </div>
      </div>

      {/* Right Sidebar - Node Properties */}
      <div className="w-80 border-l border-border bg-card/50">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold">
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
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input
                  value={
                    (selectedNode.data as unknown as WorkflowNodeData)
                      ?.description || ""
                  }
                  className="mt-1"
                />
              </div>

              {(selectedNode.data as unknown as WorkflowNodeData)?.type ===
                "trigger" && (
                <div>
                  <label className="text-sm font-medium">
                    Trigger Settings
                  </label>
                  <div className="mt-2 space-y-2">
                    <Input placeholder="Webhook URL" />
                    <Input placeholder="HTTP Method" />
                  </div>
                </div>
              )}

              {(selectedNode.data as unknown as WorkflowNodeData)?.type ===
                "action" && (
                <div>
                  <label className="text-sm font-medium">
                    Action Configuration
                  </label>
                  <div className="mt-2 space-y-2">
                    <Input placeholder="API Endpoint" />
                    <Input placeholder="Request Body" />
                  </div>
                </div>
              )}

              <Button variant="default" className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a node to configure its properties</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkflowEditor;
