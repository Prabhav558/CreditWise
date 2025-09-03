import Hero from "@/components/Hero";
import CreditRiskAnalyzer from "@/components/CreditRiskAnalyzer";
import FloatingChatbot from "@/components/FloatingChatbot";
import Footer from "@/components/Footer";
import CSVIngest from "@/components/risk/CSVIngest";
import UserList from "@/components/risk/UserList";
import PDTrendChart from "@/components/risk/PDTrendChart";
import DeleteDataButton from "@/components/risk/DeleteDataButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getUsers, getUserTimeseries, TimeseriesData } from "@/lib/api";

// Create a QueryClient instance
const queryClient = new QueryClient();

function DefaulterTrackingContent() {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<string>("all");
  const queryClient = useQueryClient();

  useEffect(() => {
    document.title = "CreditWise - Defaulter Search & Tracking";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "CreditWise predicts borrower default risk using alternative data.");
  }, []);

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers
  });

  const { data: timeseriesData = [], isLoading: timeseriesLoading } = useQuery({
    queryKey: ['timeseries', selectedUser, timeRange],
    queryFn: () => {
      if (!selectedUser) return [];
      
      const now = new Date();
      let from: string | undefined;
      
      if (timeRange === "6m") {
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);
        from = sixMonthsAgo.toISOString().slice(0, 7);
      } else if (timeRange === "12m") {
        const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 12, 1);
        from = twelveMonthsAgo.toISOString().slice(0, 7);
      }
      
      return getUserTimeseries(selectedUser, from);
    },
    enabled: !!selectedUser
  });

  const handleCSVUploaded = () => {
    // Invalidate all queries to refresh both user list and timeseries data
    queryClient.invalidateQueries({ queryKey: ['users'] });
    queryClient.invalidateQueries({ queryKey: ['timeseries'] });
    
    // If a user is currently selected, refresh their specific timeseries data
    if (selectedUser) {
      queryClient.invalidateQueries({ queryKey: ['timeseries', selectedUser, timeRange] });
    }
  };

  const handleDataDeleted = () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
    queryClient.invalidateQueries({ queryKey: ['timeseries'] });
    setSelectedUser(null);
  };

  const latestData = timeseriesData[timeseriesData.length - 1];
  const getRiskBadgeVariant = (category: string) => {
    switch (category) {
      case 'Low': return 'default';
      case 'Medium': return 'secondary';
      case 'High': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <main>
      <Hero />
      
      {/* CSV Upload Section */}
      <section className="py-8 border-b">
        <div className="container">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Risk Analysis Dashboard</h2>
            <div className="flex gap-3">
              <DeleteDataButton onDeleted={handleDataDeleted} />
              <CSVIngest onUploaded={handleCSVUploaded} />
            </div>
          </div>
        </div>
      </section>

      {/* Main Dashboard */}
      <section className="py-8">
        <div className="container">
          <div className="grid grid-cols-12 gap-6">
            {/* User List - Left Panel */}
            <div className="col-span-12 lg:col-span-3">
              <div className="sticky top-4">
                <h3 className="text-lg font-semibold mb-4">Users ({users.length})</h3>
                {usersLoading ? (
                  <div className="h-96 flex items-center justify-center">
                    <div className="animate-pulse">Loading users...</div>
                  </div>
                ) : (
                  <UserList
                    users={users}
                    selectedUser={selectedUser}
                    onUserSelect={setSelectedUser}
                  />
                )}
              </div>
            </div>

            {/* Risk Analysis - Right Panel */}
            <div className="col-span-12 lg:col-span-9">
              {selectedUser ? (
                <div className="space-y-6">
                  {/* User Overview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>User: {selectedUser}</span>
                        {latestData && (
                          <Badge variant={getRiskBadgeVariant(latestData.risk_category)}>
                            {latestData.risk_category} Risk
                          </Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {latestData ? (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Latest PD Score</p>
                            <p className="text-2xl font-bold">{latestData.pd_percent.toFixed(1)}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Latest Month</p>
                            <p className="text-lg font-medium">{latestData.month}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No data available for this user</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Risk Over Time Chart */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Risk Over Time</CardTitle>
                        <Select value={timeRange} onValueChange={setTimeRange}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="6m">6 months</SelectItem>
                            <SelectItem value="12m">12 months</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {/* Risk Band Legend */}
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-chart-1/20 border border-chart-1/40 rounded"></div>
                          <span>Low (0-30%)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-chart-2/20 border border-chart-2/40 rounded"></div>
                          <span>Medium (30-60%)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-chart-3/20 border border-chart-3/40 rounded"></div>
                          <span>High (60%+)</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {timeseriesLoading ? (
                        <div className="h-64 flex items-center justify-center">
                          <div className="animate-pulse">Loading chart data...</div>
                        </div>
                      ) : (
                        <PDTrendChart data={timeseriesData} />
                      )}
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="h-64 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <p className="text-lg mb-2">Select a user to view risk analysis</p>
                      <p className="text-sm">Choose from the user list on the left</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Original Analyzer Section */}
      <section id="analyzer" className="pb-16 md:pb-24 border-t">
        <div className="container">
          <h2 className="text-2xl font-bold mb-6">Individual Risk Assessment</h2>
          <CreditRiskAnalyzer />
        </div>
      </section>
      
      <FloatingChatbot />
      <Footer />
    </main>
  );
}

const DefaulterTracking = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <DefaulterTrackingContent />
    </QueryClientProvider>
  );
};

export default DefaulterTracking;