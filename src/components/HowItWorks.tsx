const steps = [
  {
    number: "01",
    title: "Connect",
    description: "Join the mesh network using quantum-secured credentials that protect your identity while enabling verified participation.",
  },
  {
    number: "02",
    title: "Verify",
    description: "Take real-world actions that are cryptographically verified through AR interfaces and collective witness protocols.",
  },
  {
    number: "03",
    title: "Build Trust",
    description: "Earn reputation through verified contributions, building a transparent trust score that reflects your real-world impact.",
  },
  {
    number: "04",
    title: "Collaborate",
    description: "Participate in group decisions with weighted voting power based on verified expertise and trust within the network.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-primary/20 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary/20 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-primary/20 rounded-full" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="text-gradient-quantum">How It Works</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Four steps to join the future of verified human collaboration
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="relative group"
            >
              {/* Connection line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-[2px] bg-gradient-to-r from-primary/50 to-transparent" />
              )}
              
              <div className="space-y-4">
                <div className="relative">
                  <div className="text-6xl font-bold text-primary/20 group-hover:text-primary/30 transition-colors">
                    {step.number}
                  </div>
                  <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-primary to-secondary" />
                </div>
                <h3 className="text-2xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
