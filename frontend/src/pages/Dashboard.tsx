import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { formatVND } from '@/utils/format'
import { TrendingDown, TrendingUp, Wallet as WalletIcon, Calendar } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { apiFetch } from '@/utils/apiClient'

export function Dashboard() {
  const { user } = useAuthStore();
  const [totalBalance, setTotalBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  useEffect(() => {
    apiFetch('/wallets/').then(wallets => {
      setTotalBalance(wallets.reduce((acc: number, w: any) => acc + Number(w.balance), 0));
    }).catch(console.error);
    apiFetch('/transactions/').then(txs => {
      let inc = 0, exp = 0;
      txs.forEach((t: any) => {
        if (t.transaction_type === 'income') inc += Number(t.amount);
        if (t.transaction_type === 'expense') exp += Number(t.amount);
      });
      setIncome(inc);
      setExpense(exp);
    }).catch(console.error);
  }, []);

  return (
    <div className="p-4 flex flex-col gap-6 animate-in fade-in duration-300 pb-24">
      <header className="flex justify-between items-center mt-2">
        <div>
          <p className="text-slate-400 text-sm">Xin chào 👋</p>
          <h1 className="text-2xl font-bold">{user?.name || 'Sếp'}</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xl overflow-hidden">
          {user?.avatar_url ? <img src={user.avatar_url} /> : '👤'}
        </div>
      </header>

      <Card gradient className="py-6">
        <p className="text-indigo-100 font-medium mb-1">Tổng số dư</p>
        <h2 className="text-4xl font-bold mb-4">{formatVND(totalBalance)}</h2>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="flex items-center gap-3 p-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl"><TrendingUp size={20}/></div>
          <div>
            <p className="text-xs text-slate-400">Thu nhập</p>
            <p className="font-bold text-emerald-500">{formatVND(income)}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3 p-4">
          <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl"><TrendingDown size={20}/></div>
          <div>
            <p className="text-xs text-slate-400">Chi tiêu</p>
            <p className="font-bold text-rose-500">{formatVND(expense)}</p>
          </div>
        </Card>
      </div>

    </div>
  )
}
