import React from 'react'
import { Card } from '@/components/ui/Card'
import { formatVND } from '@/utils/format'
import { TrendingDown, TrendingUp, Wallet as WalletIcon, Calendar } from 'lucide-react'

export function Dashboard() {
  return (
    <div className="p-4 flex flex-col gap-6 animate-in fade-in duration-300">
      <header className="flex justify-between items-center mt-2">
        <div>
          <p className="text-slate-400 text-sm">Xin chào 👋</p>
          <h1 className="text-2xl font-bold">User</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xl">
          👤
        </div>
      </header>

      <Card gradient className="py-6">
        <p className="text-indigo-100 font-medium mb-1">Tổng số dư</p>
        <h2 className="text-4xl font-bold mb-4">{formatVND(15420000)}</h2>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="flex items-center gap-3 p-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl"><TrendingUp size={20}/></div>
          <div>
            <p className="text-xs text-slate-400">Thu nhập</p>
            <p className="font-bold text-emerald-500">{formatVND(5000000)}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3 p-4">
          <div className="p-3 bg-red-500/10 text-red-500 rounded-xl"><TrendingDown size={20}/></div>
          <div>
            <p className="text-xs text-slate-400">Chi tiêu</p>
            <p className="font-bold text-red-500">{formatVND(2100000)}</p>
          </div>
        </Card>
      </div>

      <section>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-lg flex items-center gap-2">
            📊 Thống kê
          </h3>
          <button 
            onClick={() => window.location.href='/categories'}
            className="text-sm text-indigo-400 hover:text-indigo-300"
          >
            Xem chi tiết
          </button>
        </div>
        <Card className="p-4 flex flex-col items-center justify-center cursor-pointer" onClick={() => window.location.href='/categories'}>
          <div className="w-40 h-40 rounded-full border-[16px] border-indigo-500 border-r-emerald-500 border-b-pink-500 flex items-center justify-center shadow-inner">
            <div className="text-center">
              <p className="text-xs text-slate-400">Tháng này</p>
              <p className="font-bold text-lg">{formatVND(2100000)}</p>
            </div>
          </div>
          <p className="text-sm text-slate-400 mt-4 text-center">Bấm để xem biểu đồ chi tiết (Tròn/Cột)</p>
        </Card>
      </section>

      <section>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <WalletIcon size={18} className="text-indigo-400"/> Giao dịch gần đây
          </h3>
          <button 
            onClick={() => window.location.href='/transactions'}
            className="text-sm text-indigo-400 hover:text-indigo-300"
          >
            Xem tất cả
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {[1,2,3].map(i => (
            <Card key={i} className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">🍜</div>
                <div>
                  <p className="font-medium">Ăn sáng</p>
                  <p className="text-xs text-slate-400">Hôm nay</p>
                </div>
              </div>
              <p className="font-bold text-red-500">-{formatVND(50000)}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
          <Calendar size={18} className="text-indigo-400"/> Sắp tới
        </h3>
        <Card className="p-4 flex items-center gap-4 border-l-4 border-indigo-500">
          <div className="text-2xl">🎂</div>
          <div>
            <p className="font-medium">Sinh nhật Mẹ</p>
            <p className="text-sm text-slate-400">2 ngày nữa</p>
          </div>
        </Card>
      </section>
    </div>
  )
}