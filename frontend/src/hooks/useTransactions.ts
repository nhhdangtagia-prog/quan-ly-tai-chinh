import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { transactionsApi } from '@/api/transactions'

export function useTransactions(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: async () => {
      const res = await transactionsApi.getAll(params)
      return res.data
    },
  })
}

export function useTransactionSummary(month: string) {
  return useQuery({
    queryKey: ['transactions', 'summary', month],
    queryFn: async () => {
      const res = await transactionsApi.getSummary(month)
      return res.data
    },
  })
}

export function useCreateTransaction() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: unknown) => transactionsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] })
      qc.invalidateQueries({ queryKey: ['wallets'] })
    },
  })
}

export function useUpdateTransaction() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => transactionsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] })
      qc.invalidateQueries({ queryKey: ['wallets'] })
    },
  })
}

export function useDeleteTransaction() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => transactionsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] })
      qc.invalidateQueries({ queryKey: ['wallets'] })
    },
  })
}

export function useSyncEmail() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => transactionsApi.syncEmail(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['transactions'] }),
  })
}
