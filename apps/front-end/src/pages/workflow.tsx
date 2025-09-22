import { useCallback, useState } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Edge,
  type Node,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "@/components/ui/button";
import { Play, Save, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/Dashboard/sidebar";
import { Badge } from "@/components/ui/badge";

// Custom node component
const CustomNode = ({ data }: { data: any }) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-card border border-border min-w-[150px]">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
          {data.icon}
        </div>
        <div className="font-bold text-sm text-card-foreground">
          {data.title}
        </div>
      </div>
      <div className="text-xs text-muted-foreground">{data.subtitle}</div>
    </div>
  );
};

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

// Initial nodes
const initialNodes: Node[] = [
  {
    id: "1",
    type: "custom",
    position: { x: 250, y: 250 },
    data: {
      title: "Gmail Trigger",
      subtitle: "Gmail Trigger",
      icon: "📧",
    },
  },
];

const initialEdges: Edge[] = [];

export default function Workflow() {
  const navigate = useNavigate();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [activeTab, setActiveTab] = useState("editor");

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onAddNode = useCallback(() => {
    const newNode: Node = {
      id: `${nodes.length + 1}`,
      type: "custom",
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 400 + 100,
      },
      data: {
        title: "New Node",
        subtitle: "Click to configure",
        icon: "⚡",
      },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [nodes.length, setNodes]);

  const tabs = [
    { id: "editor", label: "Editor" },
    { id: "executions", label: "Executions" },
    { id: "evaluations", label: "Evaluations" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">👤 Personal</span>
              <span className="text-foreground font-medium">My workflow 2</span>
              <Button variant="ghost" size="sm" className="text-xs">
                + Add tag
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              Inactive
              <div className="w-2 h-2 rounded-full bg-muted-foreground" />
            </Badge>
            <Button variant="ghost" size="sm">
              Share
            </Button>
            <Button size="sm">
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </header>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex px-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Workflow Canvas */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            className="bg-background"
            fitView
          >
            <Controls className="bg-card border border-border" />
            <MiniMap className="bg-card border border-border" />
            <Background gap={12} size={1} />
          </ReactFlow>

          {/* Add Node Button */}
          <div className="absolute top-4 right-4">
            <Button onClick={onAddNode} className="flex items-center gap-2">
              ➕ Add Node
            </Button>
          </div>

          {/* Empty State */}
          {nodes.length === 1 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="w-20 h-20 border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">➕</span>
                </div>
                <p className="text-muted-foreground">Add first step...</p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                🔍
              </Button>
              <Button variant="ghost" size="sm">
                🔍
              </Button>
              <Button variant="ghost" size="sm">
                ⚙️
              </Button>
            </div>

            <Button className="flex items-center gap-2 bg-destructive hover:bg-destructive/90">
              <Play className="h-4 w-4" />
              Execute workflow
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
