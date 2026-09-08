import apiClient from './client'

export const authApi = {
  getMe: () => apiClient.get('/auth/me'),
  logout: () => apiClient.post('/auth/logout'),
  getTelegramLinkToken: () => apiClient.get('/auth/telegram/link-token'),
  linkGmail: () => apiClient.get('/auth/gmail'),
  unlinkGmail: () => apiClient.delete('/auth/gmail'),
}
