import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Thermometer, Droplets, Wind, CheckCircle2, ArrowRight } from "lucide-react";

const SmartContracts = () => {
  const iotTriggers = [
    {
      icon: Thermometer,
      sensor: "Temperature Sensor",
      value: "28°C",
      status: "active"
    },
    {
      icon: Droplets,
      sensor: "Water Quality",
      value: "95% Clean",
      status: "active"
    },
    {
      icon: Wind,
      sensor: "Air Quality Index",
      value: "Good",
      status: "active"
    }
  ];

  const contractExamples = [
    {
      trigger: "Community garden soil moisture < 30%",
      action: "Auto-release water reservoir",
      status: "Active",
      consensus: "98%"
    },
    {
      trigger: "100+ volunteers pledged for cleanup",
      action: "Unlock tool shed & allocate budget",
      status: "Pending",
      consensus: "87%"
    },
    {
      trigger: "Solar panel output > 500kWh surplus",
      action: "Distribute energy credits to community",
      status: "Triggered",
      consensus: "100%"
    }
  ];

  return (
    <section className="py-24 px-6 relative overflow-hidden bg-gradient-to-b from-background to-background/95">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
        <div className="absolute top-0 left-2/4 w-px h-full bg-gradient-to-b from-transparent via-accent/20 to-transparent" />
        <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
      </div>
      
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <Badge variant="outline" className="mb-4 border-primary/30">
            <Zap className="w-3 h-3 mr-1" />
            Autonomous Systems
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Reality-Linked Autonomous{" "}
            <span className="text-gradient-quantum">Smart Contracts</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Bridge the physical and digital worlds. Smart contracts execute automatically 
            based on real-world sensor data and community consensus validation.
          </p>
        </div>

        {/* IoT Sensors Grid */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live IoT Data Feeds
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {iotTriggers.map((trigger, index) => (
              <Card
                key={index}
                className="border-primary/20 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <trigger.icon className="w-6 h-6 text-primary" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {trigger.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{trigger.sensor}</p>
                  <p className="text-2xl font-bold">{trigger.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Smart Contract Examples */}
        <div>
          <h3 className="text-2xl font-semibold mb-6">Active Smart Contracts</h3>
          <div className="space-y-4">
            {contractExamples.map((contract, index) => (
              <Card
                key={index}
                className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all animate-fade-in group"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-[1fr,auto,1fr] gap-6 items-center">
                    {/* Trigger */}
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Trigger Condition</p>
                      <p className="font-medium">{contract.trigger}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Consensus:</span>
                        <Badge variant="outline" className="text-xs">
                          {contract.consensus}
                        </Badge>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex justify-center">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ArrowRight className="w-6 h-6 text-primary" />
                      </div>
                    </div>

                    {/* Action */}
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Automated Action</p>
                      <p className="font-medium">{contract.action}</p>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            contract.status === "Triggered"
                              ? "default"
                              : contract.status === "Active"
                              ? "secondary"
                              : "outline"
                          }
                          className="text-xs"
                        >
                          {contract.status === "Triggered" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {contract.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-12 text-center">
          <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur-sm inline-block">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-2">⚡ Smart Contract Guarantee</p>
              <p className="font-medium max-w-2xl">
                All contracts are verified by quantum-resistant ledger and require community consensus 
                before execution. Transparent, auditable, and trustworthy automation.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SmartContracts;
