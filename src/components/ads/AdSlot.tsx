import { cn } from "@/lib/utils";

interface AdSlotProps {
  position: 'top' | 'middle-1' | 'middle-2' | 'bottom';
  className?: string;
}

export const AdSlot = ({ position, className }: AdSlotProps) => {
  return (
    <div 
      className={cn(
        "flex items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 px-4 py-8 text-center transition-colors",
        className
      )}
      data-ad-slot={position}
    >
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">
          Advertisement
        </p>
        <p className="text-xs text-muted-foreground/70">
          Ad Slot: {position}
        </p>
        {/* 
          Replace this div with your AdSense code:
          <ins className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
            data-ad-slot="XXXXXXXXXX"
            data-ad-format="auto"
            data-full-width-responsive="true">
          </ins>
        */}
      </div>
    </div>
  );
};
