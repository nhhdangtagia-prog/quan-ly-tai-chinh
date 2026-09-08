import React, { useState } from 'react'
import { Mail, MessageCircle, LogOut, ChevronRight, User as UserIcon, Users, RefreshCw } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { useAuth } from '@/hooks/useAuth'
import { API_URL } from '@/utils/constants'

export function Settings() {
  const { logout, token } = useAuth()
  const [syncing, setSyncing] = useState(false)

  const handleSyncGmail = async () => {
    setSyncing(true)
    try {
      const res = await fetch(`${API_URL}/transactions/sync-gmail`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        alert("Đã gửi yêu cầu đồng bộ Gmail! Bạn sẽ nhận được thông báo qua Telegram khi hoàn tất.")
      }
    } catch (e) {
      console.error(e)
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="p-4 flex flex-col gap-4 pb-24">
      <header className="flex justify-between items-center mt-2 mb-6">
        <h1 className="text-2xl font-bold">Cài đặt</h1>
      </header>

      <div className="flex items-center gap-4 mb-4 px-2">
        <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-2xl">
          👤
        </div>
        <div>
          <h2 className="text-xl font-bold">User Name</h2>
          <p className="text-slate-400">user@example.com</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-medium text-slate-400 uppercase px-2 mt-2">Tích hợp</h3>
        
        <Card className="p-0 overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-slate-700/50 cursor-pointer hover:bg-slate-700/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 text-red-400 rounded-lg"><Mail size={20}/></div>
              <div>
                <p className="font-medium">Đọc email Gmail</p>
                <p className="text-xs text-slate-400">Tự động nhận diện giao dịch</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleSyncGmail}
                disabled={syncing}
                className="flex items-center gap-1 text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                <RefreshCw size={12} className={syncing ? 'animate-spin' : ''} /> {syncing ? 'Đang quét...' : 'Đồng bộ'}
              </button>
            </div>
          </div>

          <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-700/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg"><MessageCircle size={20}/></div>
              <div>
                <p className="font-medium">Telegram Bot</p>
                <p className="text-xs text-slate-400">Nhận thông báo và nhắc nhở</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-md">Chưa kết nối</span>
              <ChevronRight size={16} className="text-slate-500" />
            </div>
          </div>
        </Card>

        <h3 className="text-sm font-medium text-slate-400 uppercase px-2 mt-4">Gia đình & Chia sẻ</h3>
        <Card className="p-0 overflow-hidden">
          <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-700/30 transition-colors border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-500/10 text-pink-400 rounded-lg"><Users size={20}/></div>
              <div>
                <p className="font-medium">Quản lý thành viên</p>
                <p className="text-xs text-slate-400">Chia sẻ ví với Vợ/Chồng</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-md">Mới</span>
              <ChevronRight size={16} className="text-slate-500" />
            </div>
          </div>
        </Card>

        <h3 className="text-sm font-medium text-slate-400 uppercase px-2 mt-4">Khác</h3>
        
        <Card className="p-0 overflow-hidden">
          <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-700/30 transition-colors border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-700 text-slate-300 rounded-lg"><UserIcon size={20}/></div>
              <p className="font-medium">Chỉnh sửa hồ sơ</p>
            </div>
            <ChevronRight size={16} className="text-slate-500" />
          </div>
          
          <div 
            onClick={logout}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-red-500/10 transition-colors text-red-400"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg"><LogOut size={20}/></div>
              <p className="font-medium">Đăng xuất</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}