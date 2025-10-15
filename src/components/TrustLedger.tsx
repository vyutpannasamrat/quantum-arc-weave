import { Shield, Lock, Network, CheckCircle } from "lucide-react";

const TrustLedger = () => {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Main content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Core Technology</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="text-gradient-quantum">Quantum-Resistant</span>
              <br />
              Trust Ledger
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              Uses quantum-inspired cryptographic algorithms to build an unbreakable ledger of real-world interactions—including social agreements, environmental actions, and local trade.
            </p>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              Guarantees trust and verification without centralized control or third-party intermediaries.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-sm">Decentralized Control</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-sm">Quantum-Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-sm">Immutable Records</span>
              </div>
            </div>
          </div>
          
          {/* Right side - Visual representation */}
          <div className="relative">
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Central node */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow-quantum animate-pulse-slow z-10">
                <Lock className="w-12 h-12 text-primary-foreground" />
              </div>
              
              {/* Orbiting nodes */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full animate-spin-slow">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-card border-2 border-primary/50 flex items-center justify-center backdrop-blur-sm">
                  <Network className="w-6 h-6 text-primary" />
                </div>
              </div>
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full animate-spin-slow" style={{ animationDelay: '0.5s', animationDirection: 'reverse' }}>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-card border-2 border-secondary/50 flex items-center justify-center backdrop-blur-sm">
                  <Shield className="w-6 h-6 text-secondary" />
                </div>
              </div>
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full animate-spin-slow" style={{ animationDelay: '1s' }}>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-card border-2 border-accent/50 flex items-center justify-center backdrop-blur-sm">
                  <CheckCircle className="w-6 h-6 text-accent" />
                </div>
              </div>
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full animate-spin-slow" style={{ animationDelay: '1.5s', animationDirection: 'reverse' }}>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-card border-2 border-primary/50 flex items-center justify-center backdrop-blur-sm">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
              </div>
              
              {/* Connection lines */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[2px] h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustLedger;
