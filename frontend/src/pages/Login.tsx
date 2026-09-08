import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '@/utils/constants'
import { useAuthStore } from '@/store/auth'

export function Login() {
  const navigate = useNavigate()
  const { setAuth, isAuthenticated } = useAuthStore()

  useEffect(() => {
    // Check for token in URL params (from OAuth redirect)
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    
    if (token) {
      // Fetch user info... (Mocking for now)
      setAuth({ id: '1', email: 'user@example.com', name: 'User' }, token)
      navigate('/')
    } else if (isAuthenticated()) {
      navigate('/')
    }
  }, [navigate, setAuth, isAuthenticated])

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-8 p-4 bg-indigo-500/10 rounded-full">
        <div className="text-6xl">💰</div>
      </div>
      <h1 className="text-3xl font-bold text-slate-100 mb-2">Quản Lý Tài Chính</h1>
      <p className="text-slate-400 mb-12">Theo dõi chi tiêu thông minh và quản lý lịch trình cá nhân</p>
      
      <button
        onClick={handleGoogleLogin}
        className="flex items-center justify-center gap-3 bg-white text-slate-900 px-6 py-4 rounded-2xl font-medium w-full max-w-sm hover:bg-slate-100 active:scale-95 transition-all shadow-lg mb-4"
      >
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
        Tiếp tục với Google
      </button>

      <button
        onClick={() => {
          setAuth({ id: 'demo', email: 'demo@example.com', name: 'Demo User' }, 'demo_token')
          navigate('/')
        }}
        className="text-slate-400 hover:text-white transition-colors underline underline-offset-4"
      >
        Vào xem trước giao diện (Demo)
      </button>
    </div>
  )
}