import { useState, useEffect } from "react";
import { Fuel, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import { db } from "../context/FireBase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

const FuelPage = () => {
  const [fuelData, setFuelData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [monthlyStats, setMonthlyStats] = useState([]);

  useEffect(() => {
    const fetchFuelData = async () => {
      try {
        setLoading(true);
        const fuelCollection = collection(db, "fuel");
        const fuelSnapshot = await getDocs(fuelCollection);
        
        const fuelEntries = await Promise.all(
          fuelSnapshot.docs.map(async (fuelDoc) => {
            const data = fuelDoc.data();
            
            // Get vehicle details directly from the fuel document
            const vehicleInfo = {
              vehicle: data.vehicle || "Unknown Vehicle",
              plate: data.plate || "N/A"
            };
            
            // Format date
            let formattedDate = "N/A";
            if (data.date && data.date.toDate) {
              formattedDate = data.date.toDate().toISOString().split('T')[0];
            } else if (typeof data.date === 'string') {
              formattedDate = data.date;
            }
            
            // Calculate efficiency trend (simple comparison with 8 km/L baseline)
            const efficiency = parseFloat(data.efficiency) || 0;
            const trend = efficiency >= 8 ? "up" : "down";
            
            return {
              id: fuelDoc.id,
              vehicle: vehicleInfo.vehicle,
              plate: vehicleInfo.plate,
              date: formattedDate,
              amount: `${data.amount || 0} L`,
              cost: `R ${data.cost || 0}`,
              efficiency: `${data.efficiency || 0} km/L`,
              trend: trend,
              rawCost: parseFloat(data.cost) || 0,
              rawAmount: parseFloat(data.amount) || 0,
              rawEfficiency: efficiency,
            };
          })
        );
        
        // Sort by date (most recent first)
        fuelEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        setFuelData(fuelEntries);
        
        // Calculate monthly statistics
        calculateMonthlyStats(fuelEntries);
        
      } catch (error) {
        console.error("Error fetching fuel data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFuelData();
  }, []);

  const calculateMonthlyStats = (entries) => {
    const monthMap = {};
    
    entries.forEach(entry => {
      const date = new Date(entry.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      
      if (!monthMap[monthKey]) {
        monthMap[monthKey] = {
          month: monthName,
          totalCost: 0,
          totalVolume: 0,
          totalEfficiency: 0,
          count: 0
        };
      }
      
      monthMap[monthKey].totalCost += entry.rawCost;
      monthMap[monthKey].totalVolume += entry.rawAmount;
      monthMap[monthKey].totalEfficiency += entry.rawEfficiency;
      monthMap[monthKey].count += 1;
    });
    
    const stats = Object.values(monthMap).map(stat => ({
      month: stat.month,
      total: `R ${stat.totalCost.toLocaleString()}`,
      volume: `${Math.round(stat.totalVolume)} L`,
      avg: `${(stat.totalEfficiency / stat.count).toFixed(1)} km/L`
    }));
    
    setMonthlyStats(stats.slice(0, 3)); // Show last 3 months
  };

  // Use the most recent month from monthlyStats for the top cards
  const currentMonthStats = monthlyStats.length > 0 ? monthlyStats[0] : null;
  
  const totalSpent = currentMonthStats 
    ? parseFloat(currentMonthStats.total.replace("R ", "").replace(/,/g, ""))
    : 0;
  const totalVolume = currentMonthStats 
    ? parseFloat(currentMonthStats.volume.replace(" L", "").replace(/,/g, ""))
    : 0;
  const avgEfficiency = currentMonthStats 
    ? parseFloat(currentMonthStats.avg.replace(" km/L", ""))
    : 0;
  
  const currentMonth = currentMonthStats ? currentMonthStats.month : "Current Month";

  const efficiencyData = fuelData.slice(0, 10).reverse().map(entry => ({
    date: entry.date,
    efficiency: entry.rawEfficiency,
  }));

  const costData = fuelData.slice(0, 10).reverse().map(entry => ({
    date: entry.date,
    cost: entry.rawCost,
  }));

  const volumeData = fuelData.slice(0, 10).reverse().map(entry => ({
    date: entry.date,
    amount: entry.rawAmount,
  }));

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading fuel data...</p>
        </div>
      </div>
    );
  }

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
                <p className="text-sm font-medium text-muted-foreground">Total Spent ({currentMonth})</p>
                <p className="text-3xl font-bold mt-2">R {totalSpent.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {monthlyStats.length > 0 ? monthlyStats[0].month : "No data"}
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
                <p className="text-3xl font-bold mt-2">{Math.round(totalVolume).toLocaleString()} L</p>
                <p className="text-sm text-muted-foreground mt-1">{currentMonth}</p>
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
                <p className="text-3xl font-bold mt-2">{avgEfficiency.toFixed(1)} km/L</p>
                <p className="text-sm text-muted-foreground mt-1">{currentMonth}</p>
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
            Fuel Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="efficiency" className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
              <TabsTrigger value="cost">Cost</TabsTrigger>
              <TabsTrigger value="volume">Volume</TabsTrigger>
            </TabsList>

            <TabsContent value="efficiency" className="pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={efficiencyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis label={{ value: "km/L", angle: -90, position: "insideLeft" }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="efficiency" stroke="#2563EB" strokeWidth={3} dot />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="cost" className="pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={costData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis label={{ value: "R", angle: -90, position: "insideLeft" }} />
                  <Tooltip />
                  <Bar dataKey="cost" fill="#DC2626" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="volume" className="pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={volumeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis label={{ value: "Liters", angle: -90, position: "insideLeft" }} />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#16A34A" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Fuel Entries</CardTitle>
          </CardHeader>
          <CardContent>
            {fuelData.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No fuel entries found</p>
            ) : (
              <div className="space-y-4">
                {fuelData.slice(0, 5).map((entry) => (
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
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyStats.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No monthly data available</p>
            ) : (
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FuelPage;