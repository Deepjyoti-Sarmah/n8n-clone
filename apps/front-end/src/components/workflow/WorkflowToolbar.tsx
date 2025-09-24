import { Button } from "@/components/ui/button";
import { useWorkflowStore } from "@/store/workflowStore";
import { Save, Play, Square, Download } from "lucide-react";
import { workflowsAPI } from "@/lib/api";
import { useParams } from "react-router-dom";

export function WorkflowToolbar() {
  const { nodes, edges, isExecuting, setExecutionState, resetWorkflow } =
    useWorkflowStore();
  const { workflowId } = useParams();

  const handleSave = async () => {
    if (!workflowId) return;

    try {
      const workflowData = {
        nodes: nodes.reduce(
          (acc, node) => {
            acc[node.id] = {
              id: node.id,
              type: node.type,
              config: node.data.config || {},
              credentialsId: node.data.credentialsId || "",
              position: node.position,
            };
            return acc;
          },
          {} as Record<string, any>,
        ),
        connections: edges.reduce(
          (acc, edge) => {
            if (!acc[edge.source]) {
              acc[edge.source] = [];
            }
            acc[edge.source].push(edge.target);
            return acc;
          },
          {} as Record<string, string[]>,
        ),
      };

      await workflowsAPI.update(workflowId, workflowData);
    } catch (error) {
      console.error("Failed to save workflow:", error);
    }
  };

  const handleExecute = async () => {
    if (!workflowId || isExecuting) return;

    try {
      setExecutionState(true);
      await workflowsAPI.triggerManual(workflowId);
    } catch (error) {
      console.error("Failed to execute workflow:", error);
    } finally {
      setExecutionState(false);
    }
  };

  const handleExport = () => {
    const workflowData = {
      nodes: nodes.reduce(
        (acc, node) => {
          acc[node.id] = {
            id: node.id,
            type: node.type,
            config: node.data.config || {},
            credentialsId: node.data.credentialsId || "",
            position: node.position,
          };
          return acc;
        },
        {} as Record<string, any>,
      ),
      edges: edges.reduce(
        (acc, edge) => {
          if (!acc[edge.source]) {
            acc[edge.source] = [];
          }
          acc[edge.source].push(edge.target);
          return acc;
        },
        {} as Record<string, string[]>,
      ),
    };

    const dataStr = JSON.stringify(workflowData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = "workflow.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
      <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm border border-border rounded-lg p-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
          disabled={nodes.length === 0}
        >
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>

        <Button
          variant="default"
          size="sm"
          onClick={handleExecute}
          disabled={nodes.length === 0 || isExecuting}
        >
          {isExecuting ? (
            <>
              <Square className="w-4 h-4 mr-2" />
              Running...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Execute
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          disabled={nodes.length === 0}
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>

        <Button variant="outline" size="sm" onClick={resetWorkflow}>
          Clear
        </Button>
      </div>
    </div>
  );
}
