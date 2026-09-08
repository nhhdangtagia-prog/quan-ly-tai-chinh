import React, { useState } from 'react'
import { Plus, RefreshCw, Filter, Edit2, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { formatVND } from '@/utils/format'

export function Transactions() {
  const [filter, setFilter] = useState('all')

  const transactions = [
    { id: 1, type: 'expense', name: 'Ăn sáng', wallet: 'Vietcombank', amount: 50000, date: 'Hôm nay', auto: true, icon: '🍜' },
    { id: 2, type: 'income', name: 'Lương tháng 9', wallet: 'Vietcombank', amount: 25000000, date: 'Hôm qua', auto: false, icon: '💰' },
    { id: 3, type: 'expense', name: 'Đổ xăng', wallet: 'Tiền mặt', amount: 80000, date: 'Hôm qua', auto: false, icon: '⛽' }
  ]

  return (
    <div className="p-4 flex flex-col gap-4 pb-24">
      <header className="flex justify-between items-center mt-2 mb-2">
        <h1 className="text-2xl font-bold">Giao dịch</h1>
        <button className="p-2 text-indigo-400 hover:bg-indigo-500/10 rounded-full transition-colors">
          <RefreshCw size={20} />
        </button>
      </header>

      <div className="flex gap-2 mb-2 overflow-x-auto no-scrollbar">
        {['all', 'income', 'expense'].map((t) => (
          <button 
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === t ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            {t === 'all' ? 'Tất cả' : t === 'income' ? 'Thu nhập' : 'Chi tiêu'}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {['Hôm nay', 'Hôm qua'].map(dateGroup => (
          <div key={dateGroup}>
            <h3 className="text-sm font-medium text-slate-400 mb-3 px-1">{dateGroup}</h3>
            <div className="flex flex-col gap-3">
              {transactions.filter(t => t.date === dateGroup && (filter === 'all' || filter === t.type)).map(t => (
                <Card key={t.id} className="p-0 overflow-hidden group">
                  <div className="p-4 flex justify-between items-center bg-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-lg">{t.icon}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{t.name}</p>
                          {t.auto && <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">Auto</span>}
                        </div>
                        <p className="text-xs text-slate-400">{t.wallet}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${t.type === 'expense' ? 'text-red-500' : 'text-emerald-500'}`}>
                        {t.type === 'expense' ? '-' : '+'}{formatVND(t.amount)}
                      </p>
                    </div>
                  </div>
                  {/* Hành động sửa/xóa ẩn hiện */}
                  <div className="bg-slate-700/50 px-4 py-2 flex justify-end gap-4 border-t border-slate-700">
                    <button className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"><Edit2 size={14}/> Sửa</button>
                    <button className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300"><Trash2 size={14}/> Xóa</button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}