"use client";

import { RoleStats } from "@/components/admin/RoleStats";
import { RoleStatsDashboard } from "@/components/admin/RoleStatsDashboard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, BarChart, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function RoleStatsPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setRefreshTrigger((prev) => prev + 1);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Role Statistics Dashboard</h1>
          <p className="text-gray-500 mt-2">
            View the distribution of user roles across the platform. This
            dashboard provides real-time statistics on admin, student, and
            normal user counts.
          </p>
        </div>
        <Button
          variant="outline"
          className="flex items-center gap-2 self-start"
          onClick={handleManualRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw
            className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          {isRefreshing ? "Refreshing..." : "Refresh Stats"}
        </Button>
      </div>

      <div className="grid gap-6">
        <Tabs defaultValue="detailed" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="detailed" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              Detailed View
            </TabsTrigger>
            <TabsTrigger value="standard" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Standard View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="detailed">
            <RoleStatsDashboard
              refreshInterval={30000}
              showDetailedStats={true}
              key={`detailed-${refreshTrigger}`}
            />
          </TabsContent>

          <TabsContent value="standard">
            <RoleStats
              refreshInterval={30000}
              key={`standard-${refreshTrigger}`}
            />
          </TabsContent>
        </Tabs>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">About Role Management</CardTitle>
            <CardDescription>
              Understanding role distribution in your system
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-gray-600 space-y-4">
            <p>
              The role statistics dashboard provides insights into how users are
              distributed across different roles in your system. This
              information is crucial for maintaining proper access control and
              security.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-red-50 rounded-md">
                <h3 className="font-medium text-red-800 mb-2">Admin Users</h3>
                <p className="text-red-700">
                  Admin users have full access to all administrative functions.
                  Keep the number of admin users to a minimum for better
                  security.
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-md">
                <h3 className="font-medium text-blue-800 mb-2">
                  Student Users
                </h3>
                <p className="text-blue-700">
                  Student users have access to learning materials and course
                  content. This is typically the second largest user group.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium text-gray-800 mb-2">Normal Users</h3>
                <p className="text-gray-700">
                  Normal users have standard access to the platform. This is
                  typically the largest user group in the system.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
