import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentService } from "@/lib/api";

export function useAllPayments() {
  return useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const res = await paymentService.getAllPayments();
      return res.data?.payments ?? [];
    },
  });
}

export function useMyPayments(initialData) {
  return useQuery({
    queryKey: ["payments", "mine"],
    queryFn: async () => {
      const res = await paymentService.getMyPayments();
      return res.data?.payments ?? [];
    },
    initialData,
  });
}

export function useCreatePayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => paymentService.createPayment(data),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["payments", "mine"] });
    },
  });
}

export function useConfirmPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (paymentId) => paymentService.confirmPayment(paymentId),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["payments"] });
    },
  });
}

export function useFailPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (paymentId) => paymentService.failPayment(paymentId),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["payments"] });
    },
  });
}
