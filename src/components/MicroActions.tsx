import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, Gift, Users, TrendingUp } from "lucide-react";

const MicroActions = () => {
  const actions = [
    { icon: "🌱", label: "Plant Tree", tokens: "+5" },
    { icon: "♻️", label: "Recycle", tokens: "+2" },
    { icon: "🤝", label: "Help Neighbor", tokens: "+8" },
    { icon: "🚲", label: "Bike to Work", tokens: "+3" },
  ];

  const benefits = [
    {
      icon: Gift,
      title: "Local Benefits",
      description: "Exchange tokens for goods and services in your community"
    },
    {
      icon: Users,
      title: "Social Capital",
      description: "Build reputation and trust within your neighborhood"
    },
    {
      icon: TrendingUp,
      title: "Community Influence",
      description: "Aggregate tokens into voting power for local decisions"
    }
  ];

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <Badge variant="outline" className="mb-4 border-primary/30">
            <Coins className="w-3 h-3 mr-1" />
            Impact Economy
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Micro-Action & Impact{" "}
            <span className="text-gradient-quantum">Tokenization</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform everyday positive actions into verifiable impact tokens. 
            Build social capital and influence community decisions through meaningful contributions.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Token Creation Visual */}
          <div className="relative">
            <Card className="border-primary/20 bg-card/50 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <Coins className="w-6 h-6 text-primary" />
                  Verify & Earn Tokens
                </h3>
                
                {/* Action Cards */}
                <div className="space-y-4">
                  {actions.map((action, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg bg-background/80 border border-border/50 hover:border-primary/50 transition-all hover:scale-[1.02] cursor-pointer animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{action.icon}</div>
                        <span className="font-medium">{action.label}</span>
                      </div>
                      <Badge variant="secondary" className="font-mono">
                        {action.tokens} tokens
                      </Badge>
                    </div>
                  ))}
                </div>

                {/* Token Counter Visual */}
                <div className="mt-8 p-6 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Your Impact Tokens</p>
                      <p className="text-4xl font-bold text-gradient-quantum">1,247</p>
                    </div>
                    <Coins className="w-16 h-16 text-primary/30 animate-pulse-slow" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Benefits */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold mb-8">Token Benefits</h3>
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all animate-fade-in hover:scale-[1.02]"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <benefit.icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-2">{benefit.title}</h4>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Call to Action */}
            <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur-sm">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-2">🎯 Impact Multiplier</p>
                <p className="font-medium">
                  Complete 10 verified actions this week to unlock a 2x token bonus!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MicroActions;
