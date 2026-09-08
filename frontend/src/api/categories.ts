import apiClient from './client'

export const categoriesApi = {
  getAll: () => apiClient.get('/categories'),
  create: (data: unknown) => apiClient.post('/categories', data),
  update: (id: string, data: unknown) => apiClient.put(`/categories/${id}`, data),
  delete: (id: string) => apiClient.delete(`/categories/${id}`),
}
