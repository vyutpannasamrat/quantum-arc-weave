import { MapPin, Award, CheckCircle } from "lucide-react";
import { formatDistance } from "@/utils/arCalculations";

interface ARMarkerProps {
  action: {
    id: string;
    description: string;
    tokens_earned: number | null;
    location_name: string | null;
    status: string;
  };
  distance: number;
  position: { left: number; visible: boolean };
  onClick: () => void;
}

const ARMarker = ({ action, distance, position, onClick }: ARMarkerProps) => {
  if (!position.visible) return null;

  return (
    <div
      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer z-10 animate-float"
      style={{ left: `${position.left}px` }}
      onClick={onClick}
    >
      <div className="flex flex-col items-center gap-2 bg-background/90 backdrop-blur-sm border border-primary/50 rounded-lg p-3 shadow-lg hover:scale-110 transition-transform">
        {/* Icon based on status */}
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          {action.status === 'verified' ? (
            <CheckCircle className="h-5 w-5 text-primary" />
          ) : (
            <MapPin className="h-5 w-5 text-primary" />
          )}
        </div>

        {/* Distance */}
        <div className="text-xs font-semibold text-primary">
          {formatDistance(distance)}
        </div>

        {/* Tokens */}
        {action.tokens_earned && (
          <div className="flex items-center gap-1 text-xs">
            <Award className="h-3 w-3 text-accent" />
            <span className="font-bold text-accent">{action.tokens_earned}</span>
          </div>
        )}

        {/* Location name (truncated) */}
        {action.location_name && (
          <div className="text-xs text-muted-foreground max-w-[120px] truncate">
            {action.location_name}
          </div>
        )}
      </div>
    </div>
  );
};

export default ARMarker;
