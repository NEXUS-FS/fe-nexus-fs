import { useState } from "react";
import { StorageTrendChart } from "@/components/dashboard/StorageTrendChart";
import { ProviderHealthCard } from "@/components/dashboard/ProviderHealthCard";
import { FileTypeDistribution } from "@/components/dashboard/FileTypeDistribution";
import { useStorageTrend, useProviderHealth, useFileTypes } from "@/hooks/dashboard/useDashboard";
import type { StoragePeriod } from "@/types";

export function DashboardStorage() {
    const [storagePeriod, setStoragePeriod] = useState<StoragePeriod>("30d")
    const { data: trendData, isLoading: trendLoading } = useStorageTrend(storagePeriod)
    const { providers, isLoading: providersLoading } = useProviderHealth()
    const { fileTypes, isLoading: fileTypesLoading } = useFileTypes()

    return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <ProviderHealthCard
          providers={providers}
          onManage={() => console.log("Manage connections")}
          isLoading={providersLoading}
        />

        <FileTypeDistribution 
          fileTypes={fileTypes} 
          isLoading={fileTypesLoading}
        />
      </div>

      <StorageTrendChart
        data={trendData}
        period={storagePeriod}
        onPeriodChange={setStoragePeriod}
        isLoading={trendLoading}
      />
    </div>
  );
}