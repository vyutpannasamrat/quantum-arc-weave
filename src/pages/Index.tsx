import Hero from "@/components/Hero";
import TrustLedger from "@/components/TrustLedger";
import ARMapping from "@/components/ARMapping";
import CollectiveSentiment from "@/components/CollectiveSentiment";
import MicroActions from "@/components/MicroActions";
import SmartContracts from "@/components/SmartContracts";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import CTA from "@/components/CTA";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <TrustLedger />
      <ARMapping />
      <CollectiveSentiment />
      <MicroActions />
      <SmartContracts />
      <Features />
      <HowItWorks />
      <CTA />
      
      {/* Footer */}
      <footer className="border-t border-border/50 py-12 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-2xl font-bold">
              <span className="text-gradient-quantum">QuantumMesh</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 QuantumMesh. Building the future of verified collaboration.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Index;
