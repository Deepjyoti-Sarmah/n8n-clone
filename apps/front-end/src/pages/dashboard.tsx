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
    <div className="flex h-screen bg-background">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="px-6 py-6 border-b border-border flex-shrink-0">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Overview
            </h1>
            <p className="text-muted-foreground">
              All the workflows, credentials and data tables you have access to
            </p>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="px-6 py-6 max-w-7xl mx-auto space-y-8">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
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
        </div>
      </main>
    </div>
  );
}
