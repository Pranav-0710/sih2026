import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ConditionReport {
  id: string;
  monastery_id: string;
  monastery_name: string;
  description: string;
  photo_url: string | null;
  severity: string | null;
  severity_confidence: number | null;
  status: string;
  created_at: string;
}

const SEVERITY_ORDER: Record<string, number> = {
  "urgent structural damage": 0,
  "moderate wear": 1,
  "minor issue": 2,
  "no concern": 3,
};

const SEVERITY_COLORS: Record<string, string> = {
  "urgent structural damage": "#dc2626",
  "moderate wear": "#f97316",
  "minor issue": "#eab308",
  "no concern": "#16a34a",
};

const severityBadgeVariant = (severity: string | null) => {
  switch (severity) {
    case "urgent structural damage":
      return "destructive" as const;
    case "moderate wear":
      return "default" as const;
    default:
      return "secondary" as const;
  }
};

const Dashboard = () => {
  const [reports, setReports] = useState<ConditionReport[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchReports = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("condition_reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReports((data ?? []) as ConditionReport[]);
    } catch (error) {
      console.error("Error fetching condition reports:", error);
      toast({
        title: "Error",
        description: "Failed to load condition reports.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const rankedReports = [...reports].sort((a, b) => {
    const aRank = a.severity ? SEVERITY_ORDER[a.severity] ?? 4 : 5;
    const bRank = b.severity ? SEVERITY_ORDER[b.severity] ?? 4 : 5;
    if (aRank !== bRank) return aRank - bRank;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const bySeverity = Object.entries(
    reports.reduce((acc: Record<string, number>, r) => {
      const key = r.severity ?? "pending classification";
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const byMonastery = Object.entries(
    reports.reduce((acc: Record<string, number>, r) => {
      acc[r.monastery_name] = (acc[r.monastery_name] ?? 0) + 1;
      return acc;
    }, {})
  ).map(([name, count]) => ({ name, count }));

  const urgentCount = reports.filter((r) => r.severity === "urgent structural damage").length;
  const pendingCount = reports.filter((r) => !r.severity).length;

  return (
    <PageLayout>
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mt-8 mb-4">
          <h1 className="text-3xl font-bold">Conservation Priority Dashboard</h1>
          <Button variant="outline" size="sm" onClick={fetchReports} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Refresh
          </Button>
        </div>
        <p className="text-muted-foreground mb-6">
          Live, AI-triaged reports from tourists and locals — ranked by restoration priority.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {[
            { label: "Total Reports", value: reports.length, tone: "" },
            { label: "Urgent", value: urgentCount, tone: "text-destructive" },
            { label: "Monasteries Reported", value: byMonastery.length, tone: "" },
            { label: "Awaiting Classification", value: pendingCount, tone: "" },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardHeader>
                <CardTitle>{stat.label}</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-10 w-16" />
                ) : (
                  <p className={`text-4xl font-bold ${stat.tone}`}>{stat.value}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports by Severity</CardTitle>
            </CardHeader>
            <CardContent>
              {reports.length === 0 ? (
                <p className="text-sm text-muted-foreground">No reports yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={bySeverity} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                      {bySeverity.map((entry, index) => (
                        <Cell key={index} fill={SEVERITY_COLORS[entry.name] ?? "#94a3b8"} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Reports by Monastery</CardTitle>
            </CardHeader>
            <CardContent>
              {reports.length === 0 ? (
                <p className="text-sm text-muted-foreground">No reports yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={byMonastery}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Reports Ranked by Restoration Priority</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3 py-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-5 flex-1" />
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="h-5 w-14" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                ))}
              </div>
            ) : rankedReports.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">
                No condition reports have been submitted yet. Reports appear here in real time,
                ranked by AI-assessed severity.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Monastery</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Reported</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rankedReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.monastery_name}</TableCell>
                      <TableCell className="max-w-md truncate" title={report.description}>
                        {report.description}
                      </TableCell>
                      <TableCell>
                        {report.severity ? (
                          <Badge variant={severityBadgeVariant(report.severity)}>{report.severity}</Badge>
                        ) : (
                          <Badge variant="outline">pending</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {report.severity_confidence ? `${Math.round(report.severity_confidence * 100)}%` : "—"}
                      </TableCell>
                      <TableCell>{new Date(report.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
