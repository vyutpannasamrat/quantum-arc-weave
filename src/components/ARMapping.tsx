import { Eye, MapPin, Users, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

const arFeatures = [
  {
    icon: MapPin,
    title: "Resource Hubs",
    description: "See verified local resource-sharing points and community supply locations",
  },
  {
    icon: Users,
    title: "Project Status",
    description: "Track real-time updates on neighborhood initiatives and collaborative efforts",
  },
  {
    icon: AlertCircle,
    title: "Safety Feedback",
    description: "Access live community-verified safety information and support networks",
  },
];

const ARMapping = () => {
  return (
    <section className="py-24 px-6 relative overflow-hidden bg-gradient-to-b from-background to-muted/20">
      {/* Decorative grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20">
            <Eye className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">Live AR Experience</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="text-gradient-quantum">Augmented Reality</span>
            <br />
            Consensus Mapping
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Visualizes consensus and trust data layered onto physical locations via AR glasses or smartphones, 
            so communities can see and interact with live social dynamics and agreements in the environment around them.
          </p>
        </div>

        {/* AR Preview Mockup */}
        <div className="relative max-w-4xl mx-auto mb-16">
          <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-primary/30 shadow-quantum bg-gradient-to-br from-card to-muted/50 backdrop-blur-sm">
            {/* Simulated AR view */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full">
                {/* Central viewfinder */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-secondary/50 rounded-lg animate-pulse-slow">
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-secondary" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-secondary" />
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-secondary" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-secondary" />
                </div>

                {/* AR Markers */}
                <div className="absolute top-1/4 left-1/4 w-12 h-12 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center animate-float backdrop-blur-sm">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                
                <div className="absolute top-1/3 right-1/4 w-12 h-12 rounded-full bg-secondary/20 border-2 border-secondary flex items-center justify-center animate-float backdrop-blur-sm" style={{ animationDelay: '0.5s' }}>
                  <Users className="w-6 h-6 text-secondary" />
                </div>
                
                <div className="absolute bottom-1/3 left-1/3 w-12 h-12 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center animate-float backdrop-blur-sm" style={{ animationDelay: '1s' }}>
                  <AlertCircle className="w-6 h-6 text-accent" />
                </div>

                {/* Info overlay labels */}
                <div className="absolute top-1/4 left-1/4 ml-16 -mt-2">
                  <div className="bg-primary/90 backdrop-blur-sm text-primary-foreground px-3 py-1 rounded text-sm font-medium whitespace-nowrap">
                    Community Hub • 98% Trust
                  </div>
                </div>
                
                <div className="absolute top-1/3 right-1/4 mr-16">
                  <div className="bg-secondary/90 backdrop-blur-sm text-background px-3 py-1 rounded text-sm font-medium whitespace-nowrap">
                    Active Project • 42 Members
                  </div>
                </div>
                
                <div className="absolute bottom-1/3 left-1/3 ml-16">
                  <div className="bg-accent/90 backdrop-blur-sm text-accent-foreground px-3 py-1 rounded text-sm font-medium whitespace-nowrap">
                    Safety Zone • Verified
                  </div>
                </div>

                {/* Scan effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/5 to-transparent animate-pulse-slow" />
              </div>
            </div>
          </div>

          {/* Device frame indicator */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-card border border-border rounded-full text-sm text-muted-foreground">
            View through AR glasses or smartphone
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {arFeatures.map((feature, index) => (
            <Card 
              key={index}
              className="relative p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-secondary/50 transition-all duration-300 group"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                  <feature.icon className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ARMapping;
