import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Play,
  Plus,
  Settings,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  Zap,
  Activity,
} from "lucide-react";
import { workflowsAPI, credentialsAPI } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Navbar } from "@/components/Navbar";

interface Workflow {
  id: string;
  title: string;
  enabled: boolean;
  triggerType: "Manual" | "Webhook";
  createdAt: string;
  execution?: {
    status: string;
    createdAt: string;
  }[];
}

export function Dashboard() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [credentials, setCredentials] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalWorkflows: 0,
    activeWorkflows: 0,
    totalExecutions: 0,
    successfulExecutions: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [workflowsRes, credentialsRes] = await Promise.all([
        workflowsAPI.getAll(),
        credentialsAPI.getAll(),
      ]);

      if (workflowsRes.success) {
        setWorkflows(workflowsRes.data.workflows);

        // Calculate stats
        const totalWorkflows = workflowsRes.data.workflows.length;
        const activeWorkflows = workflowsRes.data.workflows.filter(
          (w: Workflow) => w.enabled,
        ).length;
        const totalExecutions = workflowsRes.data.workflows.reduce(
          (acc: number, w: Workflow) => acc + (w.execution?.length || 0),
          0,
        );
        const successfulExecutions = workflowsRes.data.workflows.reduce(
          (acc: number, w: Workflow) =>
            acc +
            (w.execution?.filter((e) => e.status === "SUCCESS").length || 0),
          0,
        );

        setStats({
          totalWorkflows,
          activeWorkflows,
          totalExecutions,
          successfulExecutions,
        });
      }

      if (credentialsRes.success) {
        setCredentials(credentialsRes.data.credentials);
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkflow = () => {
    navigate("/workflow/new");
  };

  const handleEditWorkflow = (workflowId: string) => {
    navigate(`/workflow/${workflowId}`);
  };

  const handleDeleteWorkflow = async (workflowId: string) => {
    try {
      await workflowsAPI.delete(workflowId);
      loadDashboardData();
    } catch (error) {
      console.error("Failed to delete workflow:", error);
    }
  };

  const handleExecuteWorkflow = async (workflowId: string) => {
    try {
      await workflowsAPI.triggerManual(workflowId);
      // Refresh data to show new execution
      setTimeout(loadDashboardData, 1000);
    } catch (error) {
      console.error("Failed to execute workflow:", error);
    }
  };

  const StatCard = ({ title, value, description, icon: Icon, color }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Navbar />
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.email}</p>
        </div>
        <Button onClick={handleCreateWorkflow}>
          <Plus className="mr-2 h-4 w-4" />
          New Workflow
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Workflows"
          value={stats.totalWorkflows}
          description="All workflows created"
          icon={Zap}
          color="text-blue-600"
        />
        <StatCard
          title="Active Workflows"
          value={stats.activeWorkflows}
          description="Currently enabled"
          icon={Activity}
          color="text-green-600"
        />
        <StatCard
          title="Total Executions"
          value={stats.totalExecutions}
          description="All time executions"
          icon={Play}
          color="text-orange-600"
        />
        <StatCard
          title="Success Rate"
          value={
            stats.totalExecutions > 0
              ? Math.round(
                  (stats.successfulExecutions / stats.totalExecutions) * 100,
                ) + "%"
              : "0%"
          }
          description="Successful executions"
          icon={CheckCircle}
          color="text-green-600"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="workflows" className="space-y-4">
        <TabsList>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="credentials">Credentials</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-4">
          <div className="grid gap-4">
            {workflows.length === 0 ? (
              <Card className="p-8 text-center">
                <CardContent>
                  <Zap className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No workflows yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first workflow to get started with automation
                  </p>
                  <Button onClick={handleCreateWorkflow}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Workflow
                  </Button>
                </CardContent>
              </Card>
            ) : (
              workflows.map((workflow) => (
                <Card key={workflow.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">
                          {workflow.title}
                        </CardTitle>
                        <CardDescription>
                          Created{" "}
                          {new Date(workflow.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={workflow.enabled ? "default" : "secondary"}
                        >
                          {workflow.enabled ? "Active" : "Disabled"}
                        </Badge>
                        <Badge variant="outline">{workflow.triggerType}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {workflow.execution?.length || 0} executions
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          {workflow.execution?.filter(
                            (e) => e.status === "SUCCESS",
                          ).length || 0}{" "}
                          successful
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {workflow.triggerType === "Manual" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExecuteWorkflow(workflow.id)}
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Run
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditWorkflow(workflow.id)}
                        >
                          <Settings className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteWorkflow(workflow.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="credentials" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {credentials.map((credential) => (
              <Card key={credential.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{credential.title}</CardTitle>
                  <CardDescription>
                    <Badge variant="outline">{credential.platform}</Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Created{" "}
                    {new Date(credential.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest workflow executions and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflows
                  .flatMap((w) =>
                    (w.execution || []).map((e) => ({
                      ...e,
                      workflowTitle: w.title,
                    })),
                  )
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime(),
                  )
                  .slice(0, 10)
                  .map((execution, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 border rounded-lg"
                    >
                      <div className="flex-shrink-0">
                        {execution.status === "SUCCESS" ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : execution.status === "FAILED" ? (
                          <XCircle className="h-5 w-5 text-red-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-orange-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{execution.workflowTitle}</p>
                        <p className="text-sm text-muted-foreground">
                          {execution.status} •{" "}
                          {new Date(execution.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                {workflows.every(
                  (w) => !w.execution || w.execution.length === 0,
                ) && (
                  <p className="text-center text-muted-foreground py-8">
                    No recent activity
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
