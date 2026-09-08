import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { remindersApi } from '@/api/reminders'

export function useReminders() {
  return useQuery({
    queryKey: ['reminders'],
    queryFn: async () => (await remindersApi.getAll()).data,
  })
}

export function useUpcomingReminders() {
  return useQuery({
    queryKey: ['reminders', 'upcoming'],
    queryFn: async () => (await remindersApi.getUpcoming()).data,
  })
}

export function useCreateReminder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: unknown) => remindersApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reminders'] }),
  })
}

export function useUpdateReminder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => remindersApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reminders'] }),
  })
}

export function useDeleteReminder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => remindersApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reminders'] }),
  })
}
