import apiClient from './client'

export const remindersApi = {
  getAll: () => apiClient.get('/reminders'),
  getUpcoming: () => apiClient.get('/reminders/upcoming'),
  create: (data: unknown) => apiClient.post('/reminders', data),
  update: (id: string, data: unknown) => apiClient.put(`/reminders/${id}`, data),
  delete: (id: string) => apiClient.delete(`/reminders/${id}`),
}
