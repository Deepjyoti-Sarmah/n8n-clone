import React, { useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useReactFlow,
  ConnectionMode,
  BackgroundVariant,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useWorkflowStore } from "@/store/workflowStore";
import { GeminiNode } from "./nodes/GeminiNode";
import { TelegramNode } from "./nodes/TelegramNode";
import { EmailNode } from "./nodes/EmailNode";
import { NodeSidebar } from "./NodeSidebar";
import { NodeConfigPanel } from "./NodeConfigPanel";
import { WorkflowToolbar } from "./WorkflowToolbar";

const nodeTypes = {
  gemini: GeminiNode,
  telegram: TelegramNode,
  email: EmailNode,
};

function WorkflowEditorContent() {
  const {
    nodes,
    edges,
    selectedNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    selectNode,
  } = useWorkflowStore();

  const { screenToFlowPosition } = useReactFlow();

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: any) => {
      selectNode(node);
    },
    [selectNode],
  );

  const onPaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const nodeType = event.dataTransfer.getData("application/reactflow");

      if (!nodeType) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `${nodeType}-${Date.now()}`,
        type: nodeType,
        position,
        data: {
          config: {},
          credentialsId: "",
        },
      };

      useWorkflowStore.getState().addNode(newNode);
    },
    [screenToFlowPosition],
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Node Sidebar */}
      <NodeSidebar />

      {/* Main Editor */}
      <div className="flex-1 relative">
        <WorkflowToolbar />

        <div className="h-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            connectionMode={ConnectionMode.Strict}
            fitView
            attributionPosition="bottom-left"
            className="bg-background"
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={20}
              size={1}
              className="bg-muted/20"
            />
            <Controls className="bg-background border border-border shadow-md" />
            <MiniMap
              className="bg-background border border-border shadow-md"
              nodeColor="#94a3b8"
              maskColor="rgb(240, 242, 247, 0.7)"
            />
          </ReactFlow>
        </div>
      </div>

      {/* Node Configuration Panel */}
      {selectedNode && <NodeConfigPanel />}
    </div>
  );
}

export function WorkflowEditor() {
  return (
    <ReactFlowProvider>
      <WorkflowEditorContent />
    </ReactFlowProvider>
  );
}
