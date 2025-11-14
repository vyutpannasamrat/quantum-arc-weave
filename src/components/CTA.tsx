import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");

const CTA = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("early_access_signups")
        .insert([{ email: email.trim() }]);

      if (error) {
        if (error.code === "23505") {
          toast.error("This email is already registered for early access");
        } else {
          throw error;
        }
      } else {
        toast.success("Thanks! You're on the list for early access");
        setEmail("");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      toast.error("Something went wrong. Please try again");
    } finally {
      setIsSubmitting(false);
    }
  };

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

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              className="h-12 bg-background/50 border-border/50 focus:border-primary"
              required
            />
            <Button 
              type="submit"
              variant="quantum" 
              size="lg"
              disabled={isSubmitting}
              className="h-12 whitespace-nowrap"
            >
              {isSubmitting ? "Submitting..." : "Get Access"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <p className="text-xs text-muted-foreground">
            Early access spots are limited. Join now to secure your place in the network.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
