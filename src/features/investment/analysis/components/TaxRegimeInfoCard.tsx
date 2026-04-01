import { AlertTriangle, BadgeInfo } from "lucide-react";
import type { TaxRegimeOption } from "@/lib/investment/tax";

interface TaxRegimeInfoCardProps {
  option: TaxRegimeOption | null;
}

export function TaxRegimeInfoCard(props: TaxRegimeInfoCardProps) {
  if (!props.option) return null;

  return (
    <div className="analysis-cockpit-subcard p-5">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-sm font-semibold text-foreground">{props.option.label}</p>
        <span className="rounded-full border border-border/50 px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
          {props.option.complexity}
        </span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{props.option.longDescription}</p>
      <div className="mt-4 space-y-2">
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <BadgeInfo size={14} className="mt-0.5 text-primary" />
          <span>{props.option.shortDescription}</span>
        </div>
        {props.option.vigilance.map((item) => (
          <div key={item} className="flex items-start gap-2 text-xs text-amber-300">
            <AlertTriangle size={14} className="mt-0.5" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
