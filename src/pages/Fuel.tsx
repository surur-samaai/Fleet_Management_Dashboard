import { Fuel, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const fuelData = [
  {
    id: "1",
    vehicle: "Ford Transit",
    plate: "ABC-123",
    date: "2025-10-20",
    amount: "45.5 L",
    cost: "R 850",
    efficiency: "8.5 km/L",
    trend: "up" as const,
  },
  {
    id: "2",
    vehicle: "Nissan NV200",
    plate: "GHI-321",
    date: "2025-10-19",
    amount: "38.2 L",
    cost: "R 715",
    efficiency: "9.2 km/L",
    trend: "up" as const,
  },
  {
    id: "3",
    vehicle: "Mercedes Sprinter",
    plate: "XYZ-789",
    date: "2025-10-18",
    amount: "52.0 L",
    cost: "R 975",
    efficiency: "7.8 km/L",
    trend: "down" as const,
  },
  {
    id: "4",
    vehicle: "Isuzu NPR",
    plate: "JKL-654",
    date: "2025-10-17",
    amount: "68.5 L",
    cost: "R 1,285",
    efficiency: "6.5 km/L",
    trend: "down" as const,
  },
];

const monthlyStats = [
  { month: "October", total: "R 45,230", volume: "2,420 L", avg: "8.2 km/L" },
  { month: "September", total: "R 42,150", volume: "2,250 L", avg: "8.5 km/L" },
  { month: "August", total: "R 38,900", volume: "2,080 L", avg: "8.3 km/L" },
];

const FuelPage = () => {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Fuel Management</h1>
        <p className="text-muted-foreground mt-1">Track and analyze fuel consumption</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Spent (Oct)</p>
                <p className="text-3xl font-bold mt-2">R 45,230</p>
                <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  7.3% from last month
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Fuel className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Volume</p>
                <p className="text-3xl font-bold mt-2">2,420 L</p>
                <p className="text-sm text-muted-foreground mt-1">This month</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Fuel className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Efficiency</p>
                <p className="text-3xl font-bold mt-2">8.2 km/L</p>
                <p className="text-sm text-success mt-1 flex items-center gap-1">
                  <TrendingDown className="h-4 w-4" />
                  Improved
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fuel className="h-5 w-5 text-primary" />
            Fuel Consumption Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center bg-muted/30 rounded-lg">
            <p className="text-muted-foreground">Chart visualization will be implemented</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Fuel Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fuelData.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{entry.vehicle}</h4>
                        <Badge variant="outline" className="text-xs">
                          {entry.plate}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Date:</span>
                          <span className="ml-2 font-medium">{entry.date}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Amount:</span>
                          <span className="ml-2 font-medium">{entry.amount}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Cost:</span>
                          <span className="ml-2 font-medium">{entry.cost}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Efficiency:</span>
                          <span className={`ml-2 font-medium ${
                            entry.trend === "up" ? "text-success" : "text-warning"
                          }`}>
                            {entry.efficiency}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyStats.map((stat) => (
                <div
                  key={stat.month}
                  className="p-4 rounded-lg border bg-card"
                >
                  <h4 className="font-semibold mb-3">{stat.month}</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Total Cost</p>
                      <p className="font-bold text-lg">{stat.total}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Volume</p>
                      <p className="font-bold text-lg">{stat.volume}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Avg Efficiency</p>
                      <p className="font-bold text-lg">{stat.avg}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FuelPage;
