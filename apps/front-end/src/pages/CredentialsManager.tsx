import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Key,
  Mail,
  MessageCircle,
  Brain,
  Loader2,
} from "lucide-react";
import { credentialsAPI } from "@/lib/api";
import { useCredentialsStore } from "@/store/credentialsStore";
// import { useToast } from "@/hooks/use-toast";

const platformIcons = {
  Gemini: Brain,
  Telegram: MessageCircle,
  ResendEmail: Mail,
};

const platformColors = {
  Gemini: "text-blue-600",
  Telegram: "text-blue-500",
  ResendEmail: "text-green-600",
};

interface CredentialForm {
  title: string;
  platform: "Gemini" | "Telegram" | "ResendEmail";
  data: {
    geminiApiKey?: string;
    botToken?: string;
    chatId?: string;
    apiKey?: string;
    resendDomainMail?: string;
  };
}

export function CredentialsManager() {
  const {
    credentials,
    isLoading,
    setCredentials,
    addCredential,
    updateCredential,
    deleteCredential,
    setLoading,
  } = useCredentialsStore();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formData, setFormData] = useState<CredentialForm>({
    title: "",
    platform: "Gemini",
    data: {},
  });
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  // const { toast } = useToast();

  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = async () => {
    try {
      setLoading(true);
      const response = await credentialsAPI.getAll();
      if (response.success) {
        setCredentials(response.data.credentials);
      }
    } catch (error) {
      console.error("Failed to load credentials:", error);
      toast({
        title: "Error",
        description: "Failed to load credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      let response;
      if (selectedCredential) {
        // Update existing credential
        response = await credentialsAPI.update(selectedCredential.id, formData);
        if (response.success) {
          updateCredential(selectedCredential.id, response.data.credentials);
          setShowEditDialog(false);
          toast({
            title: "Success",
            description: "Credential updated successfully",
          });
        }
      } else {
        // Create new credential
        response = await credentialsAPI.create(formData);
        if (response.success) {
          addCredential(response.data.credentials);
          setShowAddDialog(false);
          toast({
            title: "Success",
            description: "Credential created successfully",
          });
        }
      }

      if (!response.success) {
        setError(response.error?.message || "Failed to save credential");
      }
    } catch (error: any) {
      setError(
        error.response?.data?.error?.message || "Failed to save credential",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCredential) return;

    try {
      setSubmitting(true);
      const response = await credentialsAPI.delete(selectedCredential.id);
      if (response.success) {
        deleteCredential(selectedCredential.id);
        setShowDeleteDialog(false);
        setSelectedCredential(null);
        toast({
          title: "Success",
          description: "Credential deleted successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete credential",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const openAddDialog = () => {
    setFormData({
      title: "",
      platform: "Gemini",
      data: {},
    });
    setError("");
    setSelectedCredential(null);
    setShowAddDialog(true);
  };

  const openEditDialog = (credential: any) => {
    setFormData({
      title: credential.title,
      platform: credential.platform,
      data:
        credential.platform === "Gemini"
          ? { geminiApiKey: "••••••••••••••••" }
          : credential.platform === "Telegram"
            ? { botToken: "••••••••••••••••", chatId: "••••••••••••••••" }
            : { apiKey: "••••••••••••••••", resendDomainMail: "" },
    });
    setError("");
    setSelectedCredential(credential);
    setShowEditDialog(true);
  };

  const openDeleteDialog = (credential: any) => {
    setSelectedCredential(credential);
    setShowDeleteDialog(true);
  };

  const toggleShowSecret = (credentialId: string) => {
    setShowSecrets((prev) => ({
      ...prev,
      [credentialId]: !prev[credentialId],
    }));
  };

  const renderCredentialForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="e.g., My Gemini API"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="platform">Platform</Label>
        <Select
          value={formData.platform}
          onValueChange={(value: any) =>
            setFormData((prev) => ({ ...prev, platform: value, data: {} }))
          }
          disabled={!!selectedCredential}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Gemini">Gemini AI</SelectItem>
            <SelectItem value="Telegram">Telegram Bot</SelectItem>
            <SelectItem value="ResendEmail">Resend Email</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Platform-specific fields */}
      {formData.platform === "Gemini" && (
        <div className="space-y-2">
          <Label htmlFor="geminiApiKey">API Key</Label>
          <Input
            id="geminiApiKey"
            type="password"
            placeholder="Enter Gemini API key"
            value={formData.data.geminiApiKey || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                data: { ...prev.data, geminiApiKey: e.target.value },
              }))
            }
            required
          />
        </div>
      )}

      {formData.platform === "Telegram" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="botToken">Bot Token</Label>
            <Input
              id="botToken"
              type="password"
              placeholder="Enter Telegram bot token"
              value={formData.data.botToken || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  data: { ...prev.data, botToken: e.target.value },
                }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="chatId">Chat ID</Label>
            <Input
              id="chatId"
              placeholder="Enter chat ID"
              value={formData.data.chatId || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  data: { ...prev.data, chatId: e.target.value },
                }))
              }
              required
            />
          </div>
        </>
      )}

      {formData.platform === "ResendEmail" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter Resend API key"
              value={formData.data.apiKey || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  data: { ...prev.data, apiKey: e.target.value },
                }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="resendDomainMail">Domain Email (Optional)</Label>
            <Input
              id="resendDomainMail"
              type="email"
              placeholder="e.g., noreply@yourdomain.com"
              value={formData.data.resendDomainMail || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  data: { ...prev.data, resendDomainMail: e.target.value },
                }))
              }
            />
          </div>
        </>
      )}

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setShowAddDialog(false);
            setShowEditDialog(false);
          }}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {selectedCredential ? "Update" : "Create"} Credential
        </Button>
      </DialogFooter>
    </form>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Credentials</h1>
          <p className="text-muted-foreground">
            Manage your API keys and authentication credentials securely
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Credential
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Credential</DialogTitle>
              <DialogDescription>
                Add a new API credential for your workflows
              </DialogDescription>
            </DialogHeader>
            {renderCredentialForm()}
          </DialogContent>
        </Dialog>
      </div>

      {/* Credentials Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {credentials.length === 0 ? (
          <div className="col-span-full">
            <Card className="p-8 text-center">
              <CardContent>
                <Key className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No credentials yet</h3>
                <p className="text-muted-foreground mb-4">
                  Add your first credential to start connecting services
                </p>
                <Button onClick={openAddDialog}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Credential
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          credentials.map((credential) => {
            const Icon =
              platformIcons[
                credential.platform as keyof typeof platformIcons
              ] || Key;
            const iconColor =
              platformColors[
                credential.platform as keyof typeof platformColors
              ] || "text-gray-600";

            return (
              <Card key={credential.id} className="relative">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <Icon className={`h-5 w-5 ${iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {credential.title}
                      </CardTitle>
                      <CardDescription>
                        <Badge variant="outline">{credential.platform}</Badge>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Created{" "}
                      {new Date(credential.createdAt).toLocaleDateString()}
                    </div>

                    {/* Masked credential info */}
                    <div className="space-y-1">
                      {credential.platform === "Gemini" && (
                        <div className="flex items-center justify-between text-sm">
                          <span>API Key:</span>
                          <div className="flex items-center gap-2">
                            <code className="text-xs">
                              {showSecrets[credential.id]
                                ? "sk-••••••••••••••••"
                                : "••••••••••••••••"}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleShowSecret(credential.id)}
                            >
                              {showSecrets[credential.id] ? (
                                <EyeOff className="h-3 w-3" />
                              ) : (
                                <Eye className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                      )}

                      {credential.platform === "Telegram" && (
                        <>
                          <div className="flex items-center justify-between text-sm">
                            <span>Bot Token:</span>
                            <div className="flex items-center gap-2">
                              <code className="text-xs">
                                {showSecrets[credential.id]
                                  ? "••••••••••••••••"
                                  : "••••••••••••••••"}
                              </code>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleShowSecret(credential.id)}
                              >
                                {showSecrets[credential.id] ? (
                                  <EyeOff className="h-3 w-3" />
                                ) : (
                                  <Eye className="h-3 w-3" />
                                )}
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>Chat ID:</span>
                            <code className="text-xs">••••••••••••••••</code>
                          </div>
                        </>
                      )}

                      {credential.platform === "ResendEmail" && (
                        <div className="flex items-center justify-between text-sm">
                          <span>API Key:</span>
                          <div className="flex items-center gap-2">
                            <code className="text-xs">
                              {showSecrets[credential.id]
                                ? "re_••••••••••••••••"
                                : "••••••••••••••••"}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleShowSecret(credential.id)}
                            >
                              {showSecrets[credential.id] ? (
                                <EyeOff className="h-3 w-3" />
                              ) : (
                                <Eye className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(credential)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDeleteDialog(credential)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Credential</DialogTitle>
            <DialogDescription>
              Update your credential information
            </DialogDescription>
          </DialogHeader>
          {renderCredentialForm()}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Credential</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedCredential?.title}"?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={submitting}
            >
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
