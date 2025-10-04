import type {
  FlowNodeData,
  Workflow,
  WorkflowCredential,
} from "@/types/workflow";

import type { Node, Edge } from "@xyflow/react";

interface VariableOption {
  label: string;
  value: string;
  tooltip?: string;
}

type NodeConfigDialogProps = {
  node: Node<FlowNodeData>;
  credentials: WorkflowCredential[];
  workflow: Workflow | null;
  nodes: Node<FlowNodeData>[];
  edges: Edge[];
  onClose: () => void;
  onSave: (data: FlowNodeData) => void;
};
