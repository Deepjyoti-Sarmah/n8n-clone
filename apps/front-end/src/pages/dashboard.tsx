import { Sidebar } from "@/components/Dashboard/sidebar";
import { StatCard } from "@/components/Dashboard/stat-cards";
import { WorkflowList } from "@/components/Dashboard/workflow-list";
import { WorkflowTabs } from "@/components/Dashboard/workflowtabs";

export default function Dashboard() {
  const stats = [
    {
      title: "Prod. executions",
      subtitle: "Last 7 days",
      value: "0",
    },
    {
      title: "Failed prod. executions",
      subtitle: "Last 7 days",
      value: "0",
    },
    {
      title: "Failure rate",
      subtitle: "Last 7 days",
      value: "0%",
    },
    {
      title: "Time saved",
      subtitle: "Last 7 days",
      value: "— —",
    },
    {
      title: "Run time (avg.)",
      subtitle: "Last 7 days",
      value: "0s",
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="p-8 border-b border-border">
          <div className="mb-2">
            <h1 className="text-2xl font-bold text-foreground">Overview</h1>
            <p className="text-muted-foreground">
              All the workflows, credentials and data tables you have access to
            </p>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                subtitle={stat.subtitle}
                value={stat.value}
              />
            ))}
          </div>

          {/* Workflows Section */}
          <div className="space-y-6">
            <WorkflowTabs />
            <WorkflowList />
          </div>
        </div>
      </main>
    </div>
  );
}
