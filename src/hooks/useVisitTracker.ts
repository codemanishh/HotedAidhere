import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface VisitStats {
  today: number;
  total: number;
}

const formatCount = (num: number): string => {
  if (num >= 1000) {
    const k = num / 1000;
    return k % 1 === 0 ? `${k}K` : `${k.toFixed(1)}K`;
  }
  return num.toString();
};

export const useVisitTracker = () => {
  const [stats, setStats] = useState<VisitStats>({ today: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const trackVisit = async () => {
      // Generate or get visitor ID from localStorage
      let visitorId = localStorage.getItem("visitor_id");
      if (!visitorId) {
        visitorId = crypto.randomUUID();
        localStorage.setItem("visitor_id", visitorId);
      }

      // Record the visit
      await supabase.from("site_visits").insert({ visitor_id: visitorId });
    };

    const fetchStats = async () => {
      try {
        // Get today's start in UTC
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayISO = today.toISOString();

        // Fetch today's count
        const { count: todayCount } = await supabase
          .from("site_visits")
          .select("*", { count: "exact", head: true })
          .gte("visited_at", todayISO);

        // Fetch total count
        const { count: totalCount } = await supabase
          .from("site_visits")
          .select("*", { count: "exact", head: true });

        setStats({
          today: todayCount || 0,
          total: totalCount || 0,
        });
      } catch (error) {
        console.error("Error fetching visit stats:", error);
      } finally {
        setLoading(false);
      }
    };

    trackVisit();
    fetchStats();
  }, []);

  return { 
    stats, 
    loading, 
    formattedStats: {
      today: formatCount(stats.today),
      total: formatCount(stats.total)
    }
  };
};
