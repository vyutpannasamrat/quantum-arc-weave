import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Upload, Loader2 } from "lucide-react";

const actionSchema = z.object({
  description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description must be less than 500 characters"),
  locationName: z.string().optional(),
  locationLat: z.number().optional(),
  locationLng: z.number().optional(),
});

type ActionFormValues = z.infer<typeof actionSchema>;

export default function SubmitAction() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<ActionFormValues>({
    resolver: zodResolver(actionSchema),
    defaultValues: {
      description: "",
      locationName: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5242880) {
        toast({
          title: "File too large",
          description: "Please select an image under 5MB",
          variant: "destructive",
        });
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const getLocation = () => {
    setIsGettingLocation(true);
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive",
      });
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        form.setValue("locationLat", position.coords.latitude);
        form.setValue("locationLng", position.coords.longitude);
        toast({
          title: "Location captured",
          description: `Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`,
        });
        setIsGettingLocation(false);
      },
      (error) => {
        toast({
          title: "Location error",
          description: error.message,
          variant: "destructive",
        });
        setIsGettingLocation(false);
      }
    );
  };

  const onSubmit = async (values: ActionFormValues) => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to submit actions",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      let imageUrl = null;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('action-images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('action-images')
          .getPublicUrl(fileName);
        
        imageUrl = publicUrl;
      }

      const { data: insertedAction, error: insertError } = await supabase
        .from('actions')
        .insert({
          user_id: user.id,
          description: values.description,
          location_name: values.locationName || null,
          location_lat: values.locationLat || null,
          location_lng: values.locationLng || null,
          image_url: imageUrl,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Call AI analysis
      setIsAnalyzing(true);
      toast({
        title: "Action submitted!",
        description: "AI is analyzing your action...",
      });

      try {
        const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-action', {
          body: {
            actionId: insertedAction.id,
            description: values.description,
            imageUrl: imageUrl,
            locationName: values.locationName
          }
        });

        if (analysisError) {
          console.error('Analysis error:', analysisError);
          toast({
            title: "Action submitted",
            description: "Your action was saved but AI analysis failed. Manual review will be performed.",
            variant: "destructive",
          });
        } else {
          setAnalysisResult(analysisData);
          
          // Update trust score
          await supabase.functions.invoke('update-trust-score', {
            body: {
              userId: user.id,
              qualityScore: analysisData.quality_score,
              sentimentScore: analysisData.sentiment_score,
              relevanceScore: analysisData.relevance_score,
              imageProvided: !!imageUrl,
              tokensEarned: analysisData.tokens_earned
            }
          });

          toast({
            title: "Action analyzed!",
            description: `You earned ${analysisData.tokens_earned} tokens! Quality score: ${(analysisData.quality_score * 100).toFixed(0)}%`,
          });
        }
      } catch (error: any) {
        console.error('AI analysis failed:', error);
      } finally {
        setIsAnalyzing(false);
      }

      // Navigate after a short delay to show results
      setTimeout(() => navigate("/profile"), 2000);
    } catch (error: any) {
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Submit Micro-Action</CardTitle>
            <CardDescription>
              Record your positive impact and earn tokens
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Action Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe what you did (e.g., Cleaned trash at the park, Helped elderly neighbor)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="locationName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location Name (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Central Park, Main Street, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel>Geo-Location</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={getLocation}
                    disabled={isGettingLocation}
                    className="w-full"
                  >
                    {isGettingLocation ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <MapPin className="mr-2 h-4 w-4" />
                    )}
                    {form.watch("locationLat") ? "Location Captured" : "Get Current Location"}
                  </Button>
                  {form.watch("locationLat") && (
                    <p className="text-sm text-muted-foreground">
                      Coordinates: {form.watch("locationLat")?.toFixed(4)}, {form.watch("locationLng")?.toFixed(4)}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <FormLabel>Proof Image</FormLabel>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-w-full h-48 object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>

                <Button type="submit" disabled={isSubmitting || isAnalyzing} className="w-full">
                  {isSubmitting || isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isAnalyzing ? "Analyzing with AI..." : "Submitting..."}
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Submit Action
                    </>
                  )}
                </Button>

                {analysisResult && (
                  <Card className="mt-4 border-green-500">
                    <CardHeader>
                      <CardTitle className="text-lg">AI Analysis Complete!</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Quality Score:</span>
                        <span className="font-semibold">{(analysisResult.quality_score * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Sentiment Score:</span>
                        <span className="font-semibold">{(analysisResult.sentiment_score * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Relevance Score:</span>
                        <span className="font-semibold">{(analysisResult.relevance_score * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Tokens Earned:</span>
                        <span className="font-semibold text-green-600">+{analysisResult.tokens_earned}</span>
                      </div>
                      {analysisResult.feedback && (
                        <div className="pt-2 border-t">
                          <p className="text-sm font-medium mb-1">AI Feedback:</p>
                          <p className="text-sm text-muted-foreground">{analysisResult.feedback}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
