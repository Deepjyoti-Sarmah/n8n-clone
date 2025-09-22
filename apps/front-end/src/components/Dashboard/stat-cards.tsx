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
        "bg-card border border-border rounded-lg p-6 space-y-2 min-h-[120px] flex flex-col justify-between",
        className,
      )}
    >
      <div className="space-y-1">
        <h3 className="text-card-foreground font-semibold text-sm leading-tight">
          {title}
        </h3>
        <p className="text-muted-foreground text-xs leading-relaxed">
          {subtitle}
        </p>
      </div>
      <div className="text-3xl font-bold text-card-foreground mt-auto">
        {value}
      </div>
    </div>
  );
}
