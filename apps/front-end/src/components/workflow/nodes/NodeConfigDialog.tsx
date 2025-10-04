import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type {
  FlowNodeData,
  Workflow,
  WorkflowCredential,
} from "@/types/workflow";
import type { Node, Edge } from "@xyflow/react";
import { getAncestorNodes } from "@/utils/getAnscestorNodes";
import { useMemo, useState } from "react";

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

export default function NodeConfigDialog({
  node,
  credentials,
  onClose,
  onSave,
  workflow,
  nodes,
  edges,
}: NodeConfigDialogProps) {
  const [credentialId, setCredentialId] = useState<string>(
    node.data.credentialsId || "",
  );
  const [config, setConfig] = useState<Record<string, any>>(() => {
    const defaultConfig: Record<string, string> = {};

    switch (node.type) {
      case "ResendEmail":
        defaultConfig.to = node.data.config?.to || "";
        defaultConfig.subject = node.data.config?.subject || "";
        defaultConfig.body = node.data.config?.body || "";
        break;
      case "Telegram":
        defaultConfig.message = node.data.config?.message || "";
        break;
      case "Gemini":
        defaultConfig.prompt = node.data.config?.prompt || "";
        defaultConfig.memory = node.data.config?.memory ?? false;
        break;
      case "Slack":
        defaultConfig.channel = node.data.config?.channel || "";
        defaultConfig.message = node.data.config?.message || "";
        break;
    }

    return defaultConfig;
  });

  // Get available variables from ancestor nodes and webhook
  const availableVariables = useMemo(() => {
    const variables: VariableOption[] = [];

    // Add webhook variables if workflow is webhook-triggered
    if (workflow?.triggerType === "Webhook") {
      variables.push({
        label: "Webhook Body Data",
        value: "{{ $json.body }}",
        tooltip: "Access any data from the webhook body",
      });
    }

    // Get ancestor nodes (nodes that come before this one in the flow)
    const ancestorNodes = getAncestorNodes(node.id, edges, nodes);

    ancestorNodes.forEach((sourceNode) => {
      if (!sourceNode) return;

      let outputFields: string[] = [];
      switch (sourceNode.type) {
        case "Gemini":
          outputFields = [".text", ".query"];
          break;
        case "ResendEmail":
          outputFields = [".to", ".subject", ".body"];
          break;
        case "Telegram":
          outputFields = [".message"];
          break;
        case "Slack":
          outputFields = [".channel", ".text"];
          break;
      }

      outputFields.forEach((field) => {
        variables.push({
          label: `${sourceNode.id} (${sourceNode.data?.label || sourceNode.type})${field}`,
          value: `{{ $node.${sourceNode.id}${field} }}`,
          tooltip: `Node Type: ${sourceNode.type}\nPosition in Flow: ${sourceNode.id}`,
        });
      });
    });

    return variables;
  }, [nodes, edges, workflow, node.id]);

  // Get field configuration based on node type
  const getFieldInfo = (key: string) => {
    switch (node.type) {
      case "ResendEmail":
        switch (key) {
          case "to":
            return {
              label: "To Email",
              placeholder: "recipient@example.com or use variables",
              type: "text",
              helper: "Email address or variable from webhook/connected nodes",
            };
          case "subject":
            return {
              label: "Subject",
              placeholder: "Email subject with optional variables",
              type: "text",
              helper: "Can include variables for dynamic content",
            };
          case "body":
            return {
              label: "Body",
              placeholder: "Email body with optional variables",
              type: "textarea",
              helper: "Supports variables from webhook or connected nodes",
            };
        }
        break;
      case "Telegram":
        return {
          label: "Message",
          placeholder: "Message text with optional variables",
          type: "textarea",
          helper: "Can include variables for dynamic content",
        };
      case "Gemini":
        return {
          label: "Prompt",
          placeholder: "Prompt text with optional variables",
          type: "textarea",
          helper: "Can include variables from webhook or connected nodes",
        };
      case "Slack":
        switch (key) {
          case "channel":
            return {
              label: "Slack Channel Id",
              placeholder: "Enter your slack channel Id",
              type: "text",
              helper: "You can get slack channel id from slack api",
            };
          case "message":
            return {
              label: "Slack Message",
              placeholder: "Enter your slack message",
              type: "text",
              helper: "Enter the message you want your bot to send",
            };
        }
        break;
    }
    return {
      label: key,
      placeholder: `Enter ${key}`,
      type: "text",
      helper: "",
    };
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogTitle className="font-bold mb-4">
          Configure {node.type}
        </DialogTitle>

        <div className="space-y-4">
          {/* Credential Selection */}
          <div>
            <Label className="block mb-2">Credential</Label>
            <Select value={credentialId} onValueChange={setCredentialId}>
              <SelectTrigger>
                <SelectValue placeholder="Select Credential" />
              </SelectTrigger>
              <SelectContent>
                {credentials.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Node-specific configuration fields */}
          {Object.entries(config).map(([key, value]) => {
            // Skip memory field for Gemini - it's handled separately
            if (node.type === "Gemini" && key === "memory") {
              return null;
            }

            const fieldInfo = getFieldInfo(key);

            return (
              <div key={key}>
                <Label className="block mb-2 font-medium">
                  {fieldInfo.label}
                </Label>
                <div className="space-y-2">
                  {/* Input field (text or textarea) */}
                  {fieldInfo.type === "textarea" ? (
                    <Textarea
                      value={value}
                      onChange={(e) =>
                        setConfig({ ...config, [key]: e.target.value })
                      }
                      placeholder={fieldInfo.placeholder}
                      className="min-h-[280px]"
                    />
                  ) : (
                    <Input
                      type="text"
                      value={value}
                      onChange={(e) =>
                        setConfig({ ...config, [key]: e.target.value })
                      }
                      placeholder={fieldInfo.placeholder}
                    />
                  )}

                  {/* Helper text */}
                  {fieldInfo.helper && (
                    <p className="text-sm text-muted-foreground">
                      {fieldInfo.helper}
                    </p>
                  )}

                  {/* Variable selector dropdown */}
                  {availableVariables.length > 0 && (
                    <Select
                      onValueChange={(val) => {
                        if (!val) return;
                        const newValue = value ? `${value} ${val}` : val;
                        setConfig({ ...config, [key]: newValue });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Insert variable..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableVariables.map((v) => (
                          <SelectItem
                            key={v.value}
                            value={v.value}
                            title={v.tooltip || v.label}
                          >
                            {v.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            );
          })}

          {/* Memory toggle for Gemini */}
          {node.type === "Gemini" && (
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={config.memory === true}
                  onChange={(e) =>
                    setConfig({ ...config, memory: e.target.checked })
                  }
                />
                Enable Memory
              </label>
              <p className="text-sm text-muted-foreground">
                If enabled, Gemini will recall the latest 25 conversations for
                this workflow.
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-end gap-2 mt-6">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <Button
              onClick={() =>
                onSave({ ...node.data, credentialsId: credentialId, config })
              }
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
