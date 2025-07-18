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
    <div className="container mx-auto py-8 px-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-6 bg-blue-50/80 rounded-xl shadow-sm px-6 py-5 border border-blue-200">
        <div>
          <h1 className="text-4xl font-extrabold text-blue-800 tracking-tight mb-1">
            Role Statistics Dashboard
          </h1>
          <p className="text-blue-700 mt-1 text-base max-w-2xl">
            View the distribution of user roles across the platform. This dashboard provides real-time statistics on admin, student, and normal user counts.
          </p>
        </div>
        <Button
          variant="outline"
          className={`flex items-center gap-2 self-start md:self-auto px-5 py-2.5 rounded-lg border-blue-300 shadow-sm transition-colors hover:bg-blue-100 focus:ring-2 focus:ring-blue-300 ${isRefreshing ? "cursor-not-allowed opacity-70" : ""}`}
          onClick={handleManualRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw
            className={`h-5 w-5 ${isRefreshing ? "animate-spin text-blue-600" : "text-blue-500"}`}
          />
          <span className="font-medium text-blue-800">
            {isRefreshing ? "Refreshing..." : "Refresh Stats"}
          </span>
        </Button>
      </div>

      <div className="grid gap-6">
        <Tabs defaultValue="detailed" className="w-full">
          <TabsList className="flex w-full mb-6 bg-blue-100/60 rounded-xl shadow-inner border border-blue-200 overflow-hidden">
            <TabsTrigger
              value="detailed"
              className="flex-1 flex items-center justify-center gap-2 py-3 px-0 text-lg font-semibold rounded-none transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 data-[state=active]:bg-white data-[state=active]:text-blue-900 data-[state=active]:shadow data-[state=active]:z-10 data-[state=inactive]:text-blue-700 data-[state=inactive]:hover:bg-blue-50"
            >
              <BarChart className="h-5 w-5" />
              Detailed View
            </TabsTrigger>
            <TabsTrigger
              value="standard"
              className="flex-1 flex items-center justify-center gap-2 py-3 px-0 text-lg font-semibold rounded-none transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 data-[state=active]:bg-white data-[state=active]:text-blue-900 data-[state=active]:shadow data-[state=active]:z-10 data-[state=inactive]:text-blue-700 data-[state=inactive]:hover:bg-blue-50"
            >
              <PieChart className="h-5 w-5" />
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

        <Card className="my-8 shadow-lg border border-blue-100 bg-white/90">
          <CardHeader className="pb-2 border-b border-blue-100">
            <CardTitle className="text-xl font-bold text-blue-900 flex items-center gap-2">
              
              About Role Management
            </CardTitle>
            <CardDescription className="text-blue-700 mt-1 mb-4">
              Understanding role distribution in your system
            </CardDescription>
          </CardHeader>
          <CardContent className="text-base text-gray-700 space-y-6 pt-4">
            <p className="leading-relaxed">
              The role statistics dashboard provides insights into how users are
              distributed across different roles in your system. This
              information is crucial for maintaining proper access control and
              security.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block w-3 h-3 bg-red-400 rounded-full" />
                  <h3 className="font-semibold text-red-800 text-lg">Admin Users</h3>
                </div>
                <p className="text-red-700">
                  Admin users have full access to all administrative functions.
                  <br />
                  <span className="font-medium text-red-900">Tip:</span> Keep the number of admin users to a minimum for better security.
                </p>
              </div>
              <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block w-3 h-3 bg-blue-400 rounded-full" />
                  <h3 className="font-semibold text-blue-800 text-lg">Student Users</h3>
                </div>
                <p className="text-blue-700">
                  Student users have access to learning materials and course content.
                  <br />
                  <span className="font-medium text-blue-900">Note:</span> This is typically the second largest user group.
                </p>
              </div>
              <div className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block w-3 h-3 bg-gray-400 rounded-full" />
                  <h3 className="font-semibold text-gray-800 text-lg">Normal Users</h3>
                </div>
                <p className="text-gray-700">
                  Normal users have standard access to the platform.
                  <br />
                  <span className="font-medium text-gray-900">Info:</span> This is typically the largest user group in the system.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
