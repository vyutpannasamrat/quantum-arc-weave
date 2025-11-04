import { Card } from "@/components/ui/card";
import { Brain, Award, Users, Camera, Shield, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Action Analysis",
    description: "Real-time sentiment, quality, and relevance scoring powered by advanced AI models",
    status: "live"
  },
  {
    icon: Camera,
    title: "AR Location View",
    description: "View nearby verified actions through your camera with augmented reality overlays",
    status: "live"
  },
  {
    icon: Shield,
    title: "Trust Score System",
    description: "Dynamic scoring based on verified actions, peer validation, and community feedback",
    status: "live"
  },
  {
    icon: Award,
    title: "Impact Token Economy",
    description: "Earn tokens for verified contributions, redeemable within the ecosystem",
    status: "live"
  },
  {
    icon: Users,
    title: "Community Voting",
    description: "Transparent consensus mechanism for topics and ethical priorities",
    status: "live"
  },
  {
    icon: TrendingUp,
    title: "Action Verification",
    description: "Peer-to-peer validation system with multi-factor verification",
    status: "live"
  },
];

const LiveFeatures = () => {
  return (
    <section className="py-24 px-6 relative" id="features">
      <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
      
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block px-4 py-1 bg-primary/10 border border-primary/20 rounded-full text-sm font-semibold text-primary mb-4">
            ✅ Live & Working
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">
            Powered by <span className="text-gradient-quantum">Real Technology</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            These features are fully implemented and available right now
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 space-y-4 hover:shadow-lg transition-all duration-300 border-primary/20 hover:border-primary/40"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full font-semibold">
                    LIVE
                  </span>
                </div>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LiveFeatures;
