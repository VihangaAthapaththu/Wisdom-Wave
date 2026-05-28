import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/lib";

export function useGetMe(options = {}) {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const resp = await authService.getMe();
      return resp?.data || resp;
    },
    retry: false,
    refetchOnWindowFocus: false,
    ...options,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ email, password }) =>
      authService.login(email, password),
    onSuccess: (data) => {
      qc.setQueryData(["auth", "me"], data?.data || data);
    },
  });
}

export function useRegister() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => authService.register(payload),
    onSuccess: (data) => qc.setQueryData(["auth", "me"], data?.data || data),
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => authService.logout(),
    onSuccess: () => {
      qc.removeQueries(["auth", "me"]);
    },
  });
}

export default null;
