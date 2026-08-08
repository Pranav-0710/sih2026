import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, Camera, Loader2, ShieldAlert, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { locations as monasteries } from "@/data/monasteries";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const severityStyles: Record<string, string> = {
  "urgent structural damage": "bg-destructive text-destructive-foreground",
  "moderate wear": "bg-orange-500 text-white",
  "minor issue": "bg-yellow-500 text-black",
  "no concern": "bg-green-600 text-white",
};

const ReportCondition = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [monasteryId, setMonasteryId] = useState("");
  const [description, setDescription] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ severity: string; confidence: number } | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const captureLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: t("emergency.locationNotSupported", "Location not supported"),
        description: t("emergency.locationNotSupportedDesc", "Your browser doesn't support geolocation"),
        variant: "destructive",
      });
      return;
    }
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lon: position.coords.longitude });
        setIsGettingLocation(false);
        toast({ title: t("emergency.locationCaptured", "Location captured") });
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsGettingLocation(false);
        toast({
          title: t("report.locationErrorTitle", "Couldn't get location"),
          description: t("report.locationErrorDesc", "You can still submit the report without it."),
          variant: "destructive",
        });
      }
    );
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: t("report.authRequired", "Sign in required"),
        description: t("report.authRequiredDesc", "Please sign in to submit a condition report."),
        variant: "destructive",
      });
      return;
    }
    if (!monasteryId) {
      toast({ title: t("report.selectMonastery", "Select a monastery"), variant: "destructive" });
      return;
    }
    if (description.trim().length < 10) {
      toast({
        title: t("report.descTooShort", "Description too short"),
        description: t("report.descTooShortDesc", "Please describe the issue in a bit more detail."),
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    setResult(null);

    try {
      let photoUrl: string | null = null;

      if (photoFile) {
        const ext = photoFile.name.split(".").pop();
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("condition-reports")
          .upload(path, photoFile);

        if (uploadError) throw new Error(`Photo upload failed: ${uploadError.message}`);

        const { data: publicUrlData } = supabase.storage
          .from("condition-reports")
          .getPublicUrl(path);
        photoUrl = publicUrlData.publicUrl;
      }

      const monastery = monasteries.find((m) => m.id === monasteryId);

      const { data: inserted, error: insertError } = await supabase
        .from("condition_reports")
        .insert([
          {
            monastery_id: monasteryId,
            monastery_name: monastery?.name ?? monasteryId,
            description: description.trim(),
            photo_url: photoUrl,
            lat: coords?.lat ?? null,
            lon: coords?.lon ?? null,
            reporter_id: user.id,
          },
        ])
        .select()
        .single();

      if (insertError) throw new Error(insertError.message);

      // Run AI severity classification on the freshly submitted report.
      const { data: classifyData, error: classifyError } = await supabase.functions.invoke(
        "classify-condition",
        { body: { reportId: inserted.id, description: description.trim() } }
      );

      if (classifyError) {
        console.error("Classification failed:", classifyError);
        toast({
          title: t("report.submitted", "Report submitted"),
          description: t("report.submittedNoClassify", "Saved, but AI severity classification didn't complete. An admin will review it."),
        });
      } else if (classifyData?.success) {
        setResult({
          severity: classifyData.result.severity,
          confidence: classifyData.result.confidence,
        });
        toast({ title: t("report.submittedAndClassified", "Report submitted and classified") });
      }

      setDescription("");
      setPhotoFile(null);
      setPhotoPreview(null);
      setCoords(null);
    } catch (error) {
      console.error("Error submitting condition report:", error);
      toast({
        title: t("report.submissionFailed", "Submission failed"),
        description: error instanceof Error ? error.message : t("report.tryAgain", "Please try again."),
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="text-center mb-8">
          <ShieldAlert className="mx-auto h-10 w-10 text-heritage mb-3" />
          <h1 className="text-3xl font-bold text-foreground mb-2">{t("report.title", "Report a Condition Issue")}</h1>
          <p className="text-muted-foreground">
            {t("report.subtitle", "Spotted damage, erosion, or overcrowding at a monastery? Your report helps Sikkim's Department of Cultural Affairs & Heritage prioritize restoration.")}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("report.newReport", "New Report")}</CardTitle>
            <CardDescription>
              {t("report.newReportDesc", "Reports are reviewed by an AI severity model immediately after submission.")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>{t("report.monasteryLabel", "Monastery")}</Label>
              <Select value={monasteryId} onValueChange={setMonasteryId}>
                <SelectTrigger>
                  <SelectValue placeholder={t("report.selectMonasteryPlaceholder", "Select a monastery")} />
                </SelectTrigger>
                <SelectContent>
                  {monasteries.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {t("monasteries." + m.id + ".name", m.name)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t("report.descriptionLabel", "Description")}</Label>
              <Textarea
                placeholder={t("report.descriptionPlaceholder", "Describe what you observed — e.g. cracked wall, water damage to murals, overcrowding near the shrine...")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <Label>{t("report.photoLabel", "Photo (optional)")}</Label>
              <div className="flex items-center gap-3">
                <Button type="button" variant="outline" asChild>
                  <label className="cursor-pointer">
                    <Camera className="mr-2 h-4 w-4" />
                    {photoFile ? t("report.changePhoto", "Change photo") : t("report.addPhoto", "Add photo")}
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                  </label>
                </Button>
                {photoPreview && (
                  <img src={photoPreview} alt="Preview" className="h-16 w-16 rounded object-cover" />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t("report.locationLabel", "Location (optional)")}</Label>
              <Button type="button" variant="outline" onClick={captureLocation} disabled={isGettingLocation}>
                {isGettingLocation ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <MapPin className="mr-2 h-4 w-4" />
                )}
                {coords ? `${coords.lat.toFixed(5)}, ${coords.lon.toFixed(5)}` : t("report.captureLocation", "Capture current location")}
              </Button>
            </div>

            {result && (
              <div className="rounded-lg border p-4 flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{t("report.aiAssessment", "AI severity assessment")}</p>
                  <Badge className={severityStyles[result.severity] ?? ""}>
                    {result.severity} ({Math.round(result.confidence * 100)}% confidence)
                  </Badge>
                </div>
              </div>
            )}

            <Button className="w-full" size="lg" onClick={handleSubmit} disabled={submitting}>
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {t("report.submitReport", "Submit Report")}
            </Button>

            {!user && (
              <p className="text-sm text-center text-muted-foreground">
                <button className="underline" onClick={() => navigate("/auth")}>
                  {t("common.signIn", "Sign in")}
                </button>{" "}
                {t("report.toSubmitReport", "to submit a report.")}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default ReportCondition;
