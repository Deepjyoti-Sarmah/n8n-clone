import { useWorkflowStore } from "@/store/workflowStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Trash2, X } from "lucide-react";
import { useCredentialsStore } from "@/store/credentialsStore";

export function NodeConfigPanel() {
  const { selectedNode, updateNode, deleteNode, selectNode } =
    useWorkflowStore();
  const { credentials } = useCredentialsStore();

  if (!selectedNode) return null;

  const handleConfigUpdate = (key: string, value: any) => {
    updateNode(selectedNode.id, {
      config: {
        ...selectedNode.data.config,
        [key]: value,
      },
    });
  };

  const handleCredentialsChange = (credentialsId: string) => {
    updateNode(selectedNode.id, { credentialsId });
  };

  const handleDelete = () => {
    deleteNode(selectedNode.id);
    selectNode(null);
  };

  const renderNodeConfig = () => {
    switch (selectedNode.type) {
      case "gemini":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="prompt">Prompt</Label>
              <Textarea
                id="prompt"
                placeholder="Enter your AI prompt..."
                value={selectedNode.data.config.prompt || ""}
                onChange={(e) => handleConfigUpdate("to", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Email subject"
                value={selectedNode.data.config.subject || ""}
                onChange={(e) => handleConfigUpdate("subject", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="body">Body</Label>
              <Textarea
                id="body"
                placeholder="Email body..."
                value={selectedNode.data.config.body || ""}
                onChange={(e) => handleConfigUpdate("body", e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-sm text-muted-foreground">
            No configuration options available for this node type.
          </div>
        );
    }
  };

  // Filter credentials based on node type
  const getCredentialsForNodeType = (nodeType: string) => {
    const platformMap: Record<string, string> = {
      gemini: "Gemini",
      telegram: "Telegram",
      email: "ResendEmail",
    };

    return credentials.filter(
      (cred) => cred.platform === platformMap[nodeType],
    );
  };

  const nodeCredentials = getCredentialsForNodeType(selectedNode.type);

  return (
    <div className="w-80 bg-background border-l border-border p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Node Configuration</h2>
        <Button variant="ghost" size="sm" onClick={() => selectNode(null)}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">
            {selectedNode.type.charAt(0).toUpperCase() +
              selectedNode.type.slice(1)}{" "}
            Node
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Credentials Selection */}
          <div>
            <Label htmlFor="credentials">Credentials</Label>
            <Select
              value={selectedNode.data.credentialsId || ""}
              onValueChange={handleCredentialsChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select credentials" />
              </SelectTrigger>
              <SelectContent>
                {nodeCredentials.map((cred) => (
                  <SelectItem key={cred.id} value={cred.id}>
                    {cred.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Node-specific configuration */}
          {renderNodeConfig()}
        </CardContent>
      </Card>

      {/* Node Actions */}
      <Card>
        <CardContent className="pt-6">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="w-full"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Node
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
