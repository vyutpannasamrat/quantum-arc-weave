import { Card } from "@/components/ui/card";
import { Eye, Lock, Users, Network } from "lucide-react";

const features = [
  {
    icon: Eye,
    title: "Augmented Reality",
    description: "Overlay digital trust layers onto the physical world, enabling verified real-world interactions and transparent collaboration spaces.",
  },
  {
    icon: Lock,
    title: "Quantum Cryptography",
    description: "Future-proof security with quantum-inspired encryption protocols that ensure your data and transactions remain secure against emerging threats.",
  },
  {
    icon: Users,
    title: "Collective Intelligence",
    description: "Harness the power of group decision-making with weighted consensus mechanisms that amplify wisdom and filter noise.",
  },
  {
    icon: Network,
    title: "Trust Network",
    description: "Build reputation through verified actions in the physical world, creating a decentralized web of trust that's transparent and tamper-proof.",
  },
];

const Features = () => {
  return (
    <section className="py-24 px-6 relative">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="text-gradient-quantum">Core Technologies</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Four pillars that enable verified, transparent, and meaningful human collaboration
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="relative p-8 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 group overflow-hidden"
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-secondary/0 group-hover:from-primary/5 group-hover:via-accent/5 group-hover:to-secondary/5 transition-all duration-500" />
              
              <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
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

export default Features;
