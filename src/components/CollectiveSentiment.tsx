import { Brain, Users, BarChart3, Heart, MessageCircle, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

const CollectiveSentiment = () => {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold">
              Collective Sentiment & <span className="text-gradient-quantum">Ethics AI</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our AI aggregates and analyzes diverse community sentiments and ethical values from decentralized inputs—voice, text, and sensor data—to dynamically adjust trust scores and recommendations.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              This enables adaptive community governance models that evolve with the population's values and priorities, ensuring decisions reflect the collective will.
            </p>
            
            {/* Feature highlights */}
            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              <Card className="p-4 bg-card/50 backdrop-blur border-primary/20 hover:border-primary/40 transition-all">
                <MessageCircle className="w-8 h-8 text-primary mb-2" />
                <h3 className="font-semibold mb-1">Multi-Modal Analysis</h3>
                <p className="text-sm text-muted-foreground">Voice, text, and sensor data fusion</p>
              </Card>
              <Card className="p-4 bg-card/50 backdrop-blur border-primary/20 hover:border-primary/40 transition-all">
                <Heart className="w-8 h-8 text-primary mb-2" />
                <h3 className="font-semibold mb-1">Ethics-First</h3>
                <p className="text-sm text-muted-foreground">Values-driven decision making</p>
              </Card>
              <Card className="p-4 bg-card/50 backdrop-blur border-primary/20 hover:border-primary/40 transition-all">
                <TrendingUp className="w-8 h-8 text-primary mb-2" />
                <h3 className="font-semibold mb-1">Dynamic Trust</h3>
                <p className="text-sm text-muted-foreground">Real-time trust score adjustments</p>
              </Card>
              <Card className="p-4 bg-card/50 backdrop-blur border-primary/20 hover:border-primary/40 transition-all">
                <Users className="w-8 h-8 text-primary mb-2" />
                <h3 className="font-semibold mb-1">Adaptive Governance</h3>
                <p className="text-sm text-muted-foreground">Evolves with community priorities</p>
              </Card>
            </div>
          </div>

          {/* Visual representation */}
          <div className="relative h-[500px] flex items-center justify-center">
            {/* Central AI brain */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-quantum animate-pulse-slow">
                <Brain className="w-16 h-16 text-primary-foreground" />
              </div>
            </div>

            {/* Data input streams */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-primary/20 backdrop-blur border border-primary/40 flex items-center justify-center animate-float">
              <MessageCircle className="w-8 h-8 text-primary" />
            </div>
            <div className="absolute top-1/4 left-0 w-16 h-16 rounded-full bg-accent/20 backdrop-blur border border-accent/40 flex items-center justify-center animate-float" style={{ animationDelay: '0.5s' }}>
              <Users className="w-8 h-8 text-accent" />
            </div>
            <div className="absolute top-1/4 right-0 w-16 h-16 rounded-full bg-primary/20 backdrop-blur border border-primary/40 flex items-center justify-center animate-float" style={{ animationDelay: '1s' }}>
              <BarChart3 className="w-8 h-8 text-primary" />
            </div>

            {/* Output streams */}
            <div className="absolute bottom-1/4 left-0 w-16 h-16 rounded-full bg-accent/20 backdrop-blur border border-accent/40 flex items-center justify-center animate-float" style={{ animationDelay: '1.5s' }}>
              <Heart className="w-8 h-8 text-accent" />
            </div>
            <div className="absolute bottom-1/4 right-0 w-16 h-16 rounded-full bg-primary/20 backdrop-blur border border-primary/40 flex items-center justify-center animate-float" style={{ animationDelay: '2s' }}>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-accent/20 backdrop-blur border border-accent/40 flex items-center justify-center animate-float" style={{ animationDelay: '2.5s' }}>
              <Users className="w-8 h-8 text-accent" />
            </div>

            {/* Connecting lines animation */}
            <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.3 }}>
              <line x1="50%" y1="0" x2="50%" y2="50%" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="5,5">
                <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite" />
              </line>
              <line x1="0" y1="25%" x2="50%" y2="50%" stroke="hsl(var(--accent))" strokeWidth="2" strokeDasharray="5,5">
                <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite" />
              </line>
              <line x1="100%" y1="25%" x2="50%" y2="50%" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="5,5">
                <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite" />
              </line>
              <line x1="0" y1="75%" x2="50%" y2="50%" stroke="hsl(var(--accent))" strokeWidth="2" strokeDasharray="5,5">
                <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite" />
              </line>
              <line x1="100%" y1="75%" x2="50%" y2="50%" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="5,5">
                <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite" />
              </line>
              <line x1="50%" y1="100%" x2="50%" y2="50%" stroke="hsl(var(--accent))" strokeWidth="2" strokeDasharray="5,5">
                <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite" />
              </line>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollectiveSentiment;
