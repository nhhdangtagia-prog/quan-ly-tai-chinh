import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { walletsApi } from '@/api/wallets'

export function useWallets() {
  return useQuery({
    queryKey: ['wallets'],
    queryFn: async () => {
      const res = await walletsApi.getAll()
      return res.data
    },
  })
}

export function useCreateWallet() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: unknown) => walletsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['wallets'] }),
  })
}

export function useUpdateWallet() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => walletsApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['wallets'] }),
  })
}

export function useDeleteWallet() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => walletsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['wallets'] }),
  })
}
