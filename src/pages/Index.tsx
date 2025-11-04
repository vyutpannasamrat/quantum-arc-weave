import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import LiveFeatures from "@/components/LiveFeatures";
import ARMapping from "@/components/ARMapping";
import HowItWorks from "@/components/HowItWorks";
import ComingSoon from "@/components/ComingSoon";
import CTA from "@/components/CTA";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-20">
        <Hero />
        <LiveFeatures />
        <ARMapping />
        <HowItWorks />
        <ComingSoon />
        <CTA />
      </div>
      
      {/* Footer */}
      <footer className="border-t border-border/50 py-12 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-2xl font-bold">
              <span className="text-gradient-quantum">ImpactView</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 ImpactView. AI-powered community trust and verified collaboration.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Index;
