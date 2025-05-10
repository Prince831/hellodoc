
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface StatsRefreshButtonProps {
  onRefresh: () => void;
  loading: boolean;
}

export const StatsRefreshButton = ({ onRefresh, loading }: StatsRefreshButtonProps) => {
  const { toast } = useToast();
  
  const handleRefreshData = () => {
    toast({
      title: "Refreshing Dashboard",
      description: "Fetching the latest data...",
    });
    
    onRefresh();
    
    setTimeout(() => {
      toast({
        title: "Dashboard Updated",
        description: "Latest data has been loaded",
      });
    }, 1500);
  };
  
  return (
    <Button onClick={handleRefreshData} disabled={loading}>
      {loading ? (
        <>
          <span className="mr-2 h-4 w-4 animate-spin">⟳</span>
          Refreshing...
        </>
      ) : (
        <>Refresh Data</>
      )}
    </Button>
  );
};
