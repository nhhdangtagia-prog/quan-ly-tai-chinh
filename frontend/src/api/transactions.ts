import apiClient from './client'

export const transactionsApi = {
  getAll: (params?: Record<string, unknown>) => apiClient.get('/transactions', { params }),
  create: (data: unknown) => apiClient.post('/transactions', data),
  update: (id: string, data: unknown) => apiClient.put(`/transactions/${id}`, data),
  delete: (id: string) => apiClient.delete(`/transactions/${id}`),
  syncEmail: () => apiClient.post('/transactions/sync-email'),
  getSummary: (month: string) => apiClient.get('/transactions/summary', { params: { month } }),
}
