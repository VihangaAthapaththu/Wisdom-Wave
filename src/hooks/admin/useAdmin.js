import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/lib/api";

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const res = await adminService.getStats();
      return res.data ?? {};
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
