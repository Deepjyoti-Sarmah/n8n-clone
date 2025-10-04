import { useEffect, useRef, useState } from "react";

export type NodeStatus = "idle" | "running" | "success" | "failed";

export interface WorkflowEvent {
  type: string;
  workflowId: string;
  executionId?: string;
  nodeId?: string;
  nodeType?: string;
  error?: string;
  status?: string;
  taskDone?: number;
  totalTasks?: number;
  timestamp?: number;
}

export function useWorkflowEvents(workflowId: string | undefined) {
  const [events, setEvents] = useState<WorkflowEvent[]>([]);
  const [nodeStatuses, setNodeStatuses] = useState<Record<string, NodeStatus>>(
    {},
  );
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!workflowId) return;

    const WS_URL = import.meta.env.VITR_WS_URL || "ws://localhost:8082";
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);

      ws.send(
        JSON.stringify({
          type: "subscribe_workflow",
          workflowId,
        }),
      );
    };

    ws.onmessage = (msg) => {
      try {
        const event = JSON.parse(msg.data);

        if (event.workflowId === workflowId || event.type === "connected") {
          setEvents((prev) => [...prev, event]);

          if (event.type === "node_started" && event.nodeId) {
            setNodeStatuses((prev) => ({
              ...prev,
              [event.nodeId]: "running",
            }));
          }

          if (event.type === "node_succeeded" && event.nodeId) {
            setNodeStatuses((prev) => ({
              ...prev,
              [event.nodeId]: "success",
            }));
          }

          if (event.type === "node_failed" && event.nodeId) {
            setNodeStatuses((prev) => ({
              ...prev,
              [event.nodeId]: "failed",
            }));
          }

          if (event.type === "execution_finished") {
            setTimeout(() => {
              setNodeStatuses({});
            }, 3000);
          }
        }
      } catch (error) {
        console.error("Invalid WebSocket message:", msg.data, error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "unsubscribe",
            workflowId,
          }),
        );
      }
      ws.close();
    };
  }, [workflowId]);

  const clearEvents = () => {
    setEvents([]);
    setNodeStatuses({});
  };

  return {
    events,
    nodeStatuses,
    isConnected,
    clearEvents,
  };
}
