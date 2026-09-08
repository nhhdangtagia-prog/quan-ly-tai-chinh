import apiClient from './client'

export const walletsApi = {
  getAll: () => apiClient.get('/wallets'),
  create: (data: unknown) => apiClient.post('/wallets', data),
  update: (id: string, data: unknown) => apiClient.put(`/wallets/${id}`, data),
  delete: (id: string) => apiClient.delete(`/wallets/${id}`),
  transfer: (data: unknown) => apiClient.post('/wallets/transfer', data),
}
