import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Camera, MapPin, Loader2, AlertCircle } from "lucide-react";
import { useARCamera } from "@/hooks/useARCamera";
import { useGeolocation } from "@/hooks/useGeolocation";
import { supabase } from "@/integrations/supabase/client";
import { calculateDistance, calculateMarkerPosition } from "@/utils/arCalculations";
import ARMarker from "@/components/ARMarker";
import { useToast } from "@/hooks/use-toast";

const ARView = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { videoRef, orientation, error: cameraError, permissionGranted, requestPermissions } = useARCamera();
  const { latitude, longitude, error: locationError, loading: locationLoading } = useGeolocation();
  
  const [nearbyActions, setNearbyActions] = useState<any[]>([]);
  const [selectedAction, setSelectedAction] = useState<any>(null);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (latitude && longitude) {
      fetchNearbyActions();
    }
  }, [latitude, longitude]);

  const fetchNearbyActions = async () => {
    if (!latitude || !longitude) return;

    try {
      const { data, error } = await supabase
        .from('actions')
        .select('*')
        .not('location_lat', 'is', null)
        .not('location_lng', 'is', null)
        .eq('status', 'verified');

      if (error) throw error;

      // Filter actions within 5km radius
      const nearby = data
        ?.filter((action) => {
          const distance = calculateDistance(
            latitude,
            longitude,
            action.location_lat!,
            action.location_lng!
          );
          return distance <= 5000; // 5km radius
        })
        .map((action) => ({
          ...action,
          distance: calculateDistance(
            latitude,
            longitude,
            action.location_lat!,
            action.location_lng!
          ),
        }))
        .sort((a, b) => a.distance - b.distance);

      setNearbyActions(nearby || []);
    } catch (error) {
      console.error('Error fetching nearby actions:', error);
      toast({
        title: "Error",
        description: "Failed to load nearby actions",
        variant: "destructive",
      });
    }
  };

  const handleStartAR = async () => {
    await requestPermissions();
  };

  if (cameraError || locationError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <Card className="p-8 max-w-md">
          <div className="flex flex-col items-center gap-4 text-center">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <h2 className="text-2xl font-bold">Permission Required</h2>
            <p className="text-muted-foreground">
              {cameraError || locationError}
            </p>
            <p className="text-sm text-muted-foreground">
              Please enable camera and location permissions in your browser settings to use AR view.
            </p>
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!permissionGranted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <Card className="p-8 max-w-md">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
              <Camera className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">AR Camera View</h2>
              <p className="text-muted-foreground">
                View nearby verified actions through your camera with augmented reality overlays
              </p>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>This feature requires:</p>
              <ul className="list-disc list-inside text-left">
                <li>Camera access</li>
                <li>Location access</li>
                <li>Device orientation sensors</li>
              </ul>
            </div>
            <Button onClick={handleStartAR} size="lg" className="w-full">
              <Camera className="mr-2 h-5 w-5" />
              Enable AR View
            </Button>
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (locationLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      {/* Camera Feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* AR Overlay Layer */}
      <div className="absolute inset-0 pointer-events-none">
        {latitude && longitude && orientation.alpha !== null && (
          <>
            {nearbyActions.map((action) => {
              const position = calculateMarkerPosition(
                latitude,
                longitude,
                orientation.alpha!,
                action.location_lat,
                action.location_lng,
                screenWidth
              );

              return (
                <div key={action.id} className="pointer-events-auto">
                  <ARMarker
                    action={action}
                    distance={action.distance}
                    position={position}
                    onClick={() => setSelectedAction(action)}
                  />
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Top UI Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-background/80 to-transparent z-20">
        <div className="flex items-center justify-between">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Exit AR
          </Button>
          <div className="bg-background/90 backdrop-blur-sm rounded-lg px-4 py-2 text-sm font-semibold">
            <MapPin className="inline h-4 w-4 mr-1 text-primary" />
            {nearbyActions.length} nearby
          </div>
        </div>
      </div>

      {/* Action Detail Modal */}
      {selectedAction && (
        <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
          <Card className="p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <h3 className="font-bold text-lg">{selectedAction.description}</h3>
                {selectedAction.location_name && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {selectedAction.location_name}
                  </p>
                )}
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-accent font-bold">
                    +{selectedAction.tokens_earned} tokens
                  </span>
                  <span className="text-muted-foreground">
                    {(selectedAction.distance / 1000).toFixed(1)}km away
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedAction(null)}
              >
                ✕
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Compass Indicator */}
      {orientation.alpha !== null && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-semibold z-20">
          {Math.round(orientation.alpha)}°
        </div>
      )}
    </div>
  );
};

export default ARView;
