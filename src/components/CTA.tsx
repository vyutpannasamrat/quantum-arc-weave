import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-12 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="text-gradient-quantum">Join the Mesh</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Be part of the future of verified human collaboration. Get early access to QuantumMesh 
              and help shape the next generation of trust networks.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className="h-12 bg-background/50 border-border/50 focus:border-primary"
            />
            <Button 
              variant="quantum" 
              size="lg"
              className="h-12 whitespace-nowrap"
            >
              Get Access
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Early access spots are limited. Join now to secure your place in the network.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
