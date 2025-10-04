import type { Edge, Node } from "@xyflow/react";
import type { FlowNodeData } from "@/types/workflow";

export function getAncestorNodes(
  nodeId: string,
  edges: Edge[],
  nodes: Node<FlowNodeData>[],
): Node<FlowNodeData>[] {
  const visited = new Set<string>();
  const ancestors: Node<FlowNodeData>[] = [];

  function dfs(currentId: string) {
    edges
      .filter((edge) => edge.target === currentId)
      .forEach((edge) => {
        if (!visited.has(edge.source)) {
          visited.add(edge.source);
          const sourceNode = nodes.find((n) => n.id === edge.source);
          if (sourceNode) {
            ancestors.push(sourceNode);
            dfs(edge.source);
          }
        }
      });
  }

  dfs(nodeId);
  return ancestors;
}
