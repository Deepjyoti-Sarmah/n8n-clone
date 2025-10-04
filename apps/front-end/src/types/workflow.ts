import type { Node, Edge } from "@xyflow/react";

export type Platfrom = "ResendEmail" | "Telegram" | "Gemini" | "Form" | "Slack";

export type TriggerType = "Webhook" | "Manual";
export type ExecStatus = "PENDING" | "RUNNING" | "SUCCESS" | "FAILED";

export interface WorkflowNode {
  id: string;
  type: Platfrom;
  config: Record<string, any>;
  credentialsId?: string;
  position?: { x: number; y: number };
}

export interface WorkflowWebhook {
  id?: string;
  title: string;
  metod: "GET" | "POST";
  secret?: string;
}

export interface Workflow {
  id: string;
  title: string;
  enabled: boolean;
  triggerType: TriggerType;
  nodes: Record<string, WorkflowNode>;
  connections: Record<string, string[]>;
  webhook?: WorkflowWebhook;
  webhookId?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowInput {
  title: string;
  triggerType: TriggerType;
  nodes: Record<string, WorkflowNode>;
  connections: Record<string, string[]>;
  webhook?: Omit<WorkflowWebhook, "id">;
  enabled?: boolean;
}

export interface WorkflowCredential {
  id: string;
  title: string;
  platform: Platfrom;
  data: Record<string, any>;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: ExecStatus;
  tasksDone?: number;
  totalTasks?: number;
  output?: any;
  logs?: any;
  createdAt: string;
  updatedAt: string;
}

export interface FlowNodeData {
  id: string;
  label: string;
  type: Platfrom;
  config: Record<string, any>;
  credentialsId?: string | null;
  status?: "idle" | "running" | "success" | "failed";
}

export const flowToWorkflowNodes = (
  nodes: Node<FlowNodeData>[],
): Record<string, WorkflowNode> => {
  return nodes.reduce(
    (acc, node) => {
      if (!node.data) return acc;
      acc[node.id] = {
        id: node.id,
        type: node.data.type,
        config: node.data.config,
        credentialsId: node.data.credentialsId || undefined,
        position: {
          x: Math.round(node.position.x),
          y: Math.round(node.position.y),
        },
      };
      return acc;
    },
    {} as Record<string, WorkflowNode>,
  );
};

export const flowToWOrkflowCOnnections = (
  edges: Edge[],
): Record<string, string[]> => {
  return edges.reduce(
    (acc, edge) => {
      if (!acc[edge.source]) {
        acc[edge.source] = [];
      }
      acc[edge.source].push(edge.target);
      return acc;
    },
    {} as Record<string, string[]>,
  );
};

export const workflowToFlowNodes = (
  workflow: Workflow | null,
): Node<FlowNodeData>[] => {
  if (!workflow || !workflow.nodes) return [];

  return Object.entries(workflow.nodes).map(([id, node], index) => ({
    id,
    type: node.type,
    position: node.position || { x: 250 * index, y: 100 },
    data: {
      id,
      label: `${node.type} ${index + 1}`,
      type: node.type,
      config: node.config || {},
      credentialsId: node.credentialsId,
      status: "idle",
    },
  }));
};
