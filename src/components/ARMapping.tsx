import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, MapPin, Navigation as NavIcon, Smartphone } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ARMapping = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background -z-10" />
      <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />

      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient-quantum">Augmented Reality</span> View
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See verified community actions overlaid on the real world through your camera
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Demo Preview */}
          <div className="relative">
            <Card className="aspect-[9/16] bg-gradient-to-b from-muted/50 to-background border-primary/30 overflow-hidden relative">
              {/* Simulated phone camera view */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />
              
              {/* Simulated AR markers */}
              <div className="absolute top-1/4 left-1/3 animate-float">
                <div className="bg-background/90 backdrop-blur-sm border border-primary/50 rounded-lg p-3 shadow-lg">
                  <MapPin className="h-6 w-6 text-primary mb-1" />
                  <div className="text-xs font-bold">+50 tokens</div>
                  <div className="text-xs text-muted-foreground">250m</div>
                </div>
              </div>

              <div className="absolute top-1/2 right-1/4 animate-float" style={{ animationDelay: '0.5s' }}>
                <div className="bg-background/90 backdrop-blur-sm border border-primary/50 rounded-lg p-3 shadow-lg">
                  <MapPin className="h-6 w-6 text-primary mb-1" />
                  <div className="text-xs font-bold">+75 tokens</div>
                  <div className="text-xs text-muted-foreground">420m</div>
                </div>
              </div>

              <div className="absolute bottom-1/3 left-1/4 animate-float" style={{ animationDelay: '1s' }}>
                <div className="bg-background/90 backdrop-blur-sm border border-primary/50 rounded-lg p-3 shadow-lg">
                  <MapPin className="h-6 w-6 text-primary mb-1" />
                  <div className="text-xs font-bold">+100 tokens</div>
                  <div className="text-xs text-muted-foreground">680m</div>
                </div>
              </div>

              {/* Compass indicator */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-semibold border border-primary/30">
                <NavIcon className="inline h-4 w-4 mr-1" />
                185°
              </div>

              {/* Bottom info */}
              <div className="absolute bottom-4 left-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg p-4 border border-primary/30">
                <div className="text-sm font-semibold mb-1">Community Garden Cleanup</div>
                <div className="text-xs text-muted-foreground">Verified • 500m away • +50 tokens</div>
              </div>
            </Card>
          </div>

          {/* Right: Features & CTA */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Card className="p-6 border-primary/20 hover:border-primary/40 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Camera className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Live Camera Overlay</h3>
                    <p className="text-muted-foreground text-sm">
                      Point your camera at your surroundings to see verified actions appear in real-time
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-primary/20 hover:border-primary/40 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Geolocation Based</h3>
                    <p className="text-muted-foreground text-sm">
                      Actions are positioned based on your location and device orientation
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-primary/20 hover:border-primary/40 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Smartphone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Mobile Optimized</h3>
                    <p className="text-muted-foreground text-sm">
                      Works on modern smartphones with camera and GPS support (HTTPS required)
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <Button 
              onClick={() => navigate('/ar-view')} 
              variant="quantum" 
              size="lg"
              className="w-full text-lg"
            >
              <Camera className="mr-2 h-5 w-5" />
              Launch AR View
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ARMapping;
