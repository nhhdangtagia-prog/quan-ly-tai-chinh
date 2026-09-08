import { useAuthStore } from '@/store/auth'
import { useNavigate } from 'react-router-dom'

export function useAuth() {
  const { user, token, setAuth, setUser, logout, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return { user, token, setAuth, setUser, logout: handleLogout, isAuthenticated }
}
