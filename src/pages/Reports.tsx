import { FileText, Download, Calendar, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const availableReports = [
  {
    id: "1",
    name: "Fleet Performance Report",
    description: "Comprehensive overview of fleet efficiency and utilization",
    frequency: "Monthly",
    lastGenerated: "2025-10-15",
    status: "ready" as const,
  },
  {
    id: "2",
    name: "Fuel Consumption Analysis",
    description: "Detailed breakdown of fuel usage and costs per vehicle",
    frequency: "Weekly",
    lastGenerated: "2025-10-18",
    status: "ready" as const,
  },
  {
    id: "3",
    name: "Maintenance Schedule Report",
    description: "Upcoming and overdue maintenance tasks",
    frequency: "Daily",
    lastGenerated: "2025-10-21",
    status: "ready" as const,
  },
  {
    id: "4",
    name: "Driver Performance Report",
    description: "Driver statistics, ratings, and trip summaries",
    frequency: "Monthly",
    lastGenerated: "2025-10-01",
    status: "pending" as const,
  },
  {
    id: "5",
    name: "GPS Tracking Summary",
    description: "Vehicle locations, routes, and travel patterns",
    frequency: "Weekly",
    lastGenerated: "2025-10-18",
    status: "ready" as const,
  },
  {
    id: "6",
    name: "Cost Analysis Report",
    description: "Total operational costs breakdown by category",
    frequency: "Monthly",
    lastGenerated: "2025-10-15",
    status: "ready" as const,
  },
];

const statusConfig = {
  ready: { label: "Ready", className: "bg-success text-success-foreground" },
  pending: { label: "Generating", className: "bg-warning text-warning-foreground" },
};

const Reports = () => {
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">Generate and download fleet reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Date Range
          </Button>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
                <p className="text-3xl font-bold mt-2">24</p>
                <p className="text-sm text-muted-foreground mt-1">This month</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ready to Download</p>
                <p className="text-3xl font-bold mt-2">5</p>
                <p className="text-sm text-success mt-1">Available now</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
                <Download className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Scheduled</p>
                <p className="text-3xl font-bold mt-2">12</p>
                <p className="text-sm text-muted-foreground mt-1">Auto-generated</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Available Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {availableReports.map((report) => {
              const status = statusConfig[report.status];
              return (
                <div
                  key={report.id}
                  className="p-5 rounded-lg border bg-card hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-1">{report.name}</h4>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                    </div>
                    <Badge className={status.className}>{status.label}</Badge>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Frequency</p>
                      <p className="text-sm font-medium">{report.frequency}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Last Generated</p>
                      <p className="text-sm font-medium">{report.lastGenerated}</p>
                    </div>
                    <Button
                      size="sm"
                      disabled={report.status === "pending"}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
