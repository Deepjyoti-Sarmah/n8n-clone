import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  className?: string;
}

export function StatCard({ title, value, subtitle, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-gradient-card border border-border rounded-lg p-6 space-y-2",
        className
      )}
    >
      <h3 className="text-card-foreground font-semibold text-sm">{title}</h3>
      <p className="text-card-foreground/60 text-xs">{subtitle}</p>
      <div className="text-3xl font-bold text-card-foreground">{value}</div>
    </div>
  );
}
