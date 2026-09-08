import React from 'react'
import { Card } from '@/components/ui/Card'
import { formatVND } from '@/utils/format'

export function Wallets() {
  const wallets = [
    { name: 'Vietcombank', type: 'bank', balance: 12000000, icon: '🏦', bg: 'bg-blue-600/20', border: 'border-blue-500/30', color: 'text-blue-400' },
    { name: 'Tiền mặt', type: 'cash', balance: 1420000, icon: '💵', bg: 'bg-emerald-600/20', border: 'border-emerald-500/30', color: 'text-emerald-400' },
    { name: 'MoMo', type: 'ewallet', balance: 2000000, icon: '📱', bg: 'bg-pink-600/20', border: 'border-pink-500/30', color: 'text-pink-400' },
  ]
  const totalBalance = wallets.reduce((acc, w) => acc + w.balance, 0)

  return (
    <div className="p-4 flex flex-col gap-4 pb-24">
      <header className="mt-2 mb-2">
        <h1 className="text-2xl font-bold mb-1">Ví của tôi</h1>
        <p className="text-slate-400 text-sm">Tổng tài sản thực tế đang có</p>
      </header>

      <Card gradient className="py-6 mb-2">
        <p className="text-indigo-100 font-medium mb-1">Tổng số dư tất cả các ví</p>
        <h2 className="text-4xl font-bold">{formatVND(totalBalance)}</h2>
      </Card>

      <h3 className="font-bold text-lg mt-2">Chi tiết từng ví</h3>
      <div className="flex flex-col gap-3">
        {wallets.map(w => (
          <Card key={w.name} className={`flex items-center gap-4 p-4 border ${w.border} ${w.bg}`}>
            <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center text-2xl">
              {w.icon}
            </div>
            <div className="flex-1">
              <p className="text-slate-300 font-medium">{w.name}</p>
              <p className={`font-bold text-xl ${w.color}`}>{formatVND(w.balance)}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}