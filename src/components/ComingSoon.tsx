import { Card } from "@/components/ui/card";
import { Lock, Cpu, Workflow, Globe } from "lucide-react";

const visionFeatures = [
  {
    icon: Lock,
    title: "Quantum-Resistant Blockchain",
    description: "Post-quantum cryptographic protocols for future-proof security and decentralized token ledger",
    timeline: "Q2 2025",
    status: "research"
  },
  {
    icon: Cpu,
    title: "IoT Sensor Integration",
    description: "Automated verification through environmental sensors and smart device data feeds",
    timeline: "Q3 2025",
    status: "planning"
  },
  {
    icon: Workflow,
    title: "Reality-Linked Smart Contracts",
    description: "Autonomous execution of agreements based on verified real-world conditions and IoT triggers",
    timeline: "Q4 2025",
    status: "planning"
  },
  {
    icon: Globe,
    title: "Decentralized Governance DAO",
    description: "Community-controlled platform evolution through token-weighted voting mechanisms",
    timeline: "2026",
    status: "vision"
  },
];

const ComingSoon = () => {
  return (
    <section className="py-24 px-6 relative bg-muted/20">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block px-4 py-1 bg-secondary/10 border border-secondary/20 rounded-full text-sm font-semibold text-secondary mb-4">
            🔮 Vision & Roadmap
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">
            Building the <span className="text-gradient-quantum">Future</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced features in development to create a truly decentralized trust ecosystem
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {visionFeatures.map((feature, index) => (
            <Card
              key={index}
              className="p-6 space-y-4 border-dashed border-2 border-muted-foreground/20 hover:border-secondary/40 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-2 right-2 text-xs bg-secondary/20 text-secondary px-3 py-1 rounded-full font-semibold">
                {feature.timeline}
              </div>
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                <feature.icon className="h-6 w-6 text-secondary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Card className="inline-block p-8 max-w-2xl">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Our Development Philosophy</h3>
              <p className="text-muted-foreground">
                We believe in transparent development. While these advanced features are on our roadmap, 
                we're committed to delivering working technology first and conceptual features when they're ready. 
                Join our journey as we build a decentralized trust network brick by brick.
              </p>
              <div className="pt-4 flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                  Open Development
                </span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                  Community Driven
                </span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                  Real Technology
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ComingSoon;
