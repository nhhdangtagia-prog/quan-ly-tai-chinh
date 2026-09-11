import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { formatVND, formatDate } from '@/utils/format';
import { apiFetch } from '@/utils/apiClient';

export function Transactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/transactions/').then(setTransactions).finally(() => setLoading(false));
  }, []);

  return (
    <div className='p-4 flex flex-col gap-4 pb-24'>
      <header className='mt-2 mb-2'>
        <h1 className='text-2xl font-bold mb-1'>Lịch sử giao dịch</h1>
        <p className='text-slate-400 text-sm'>Tất cả thu chi gần đây</p>
      </header>

      <div className='flex flex-col gap-3'>
        {loading && <p className='text-slate-500 text-center py-8'>Đang tải...</p>}
        {!loading && transactions.length === 0 && <p className='text-slate-500 text-center py-8'>Chưa có giao dịch nào.</p>}
        {transactions.map(t => (
          <Card key={t.id} className='p-4 flex items-center gap-4 border border-slate-700/50 bg-slate-800/50'>
            <div className='w-12 h-12 rounded-full flex items-center justify-center text-xl bg-slate-700'>
              {t.category?.icon || '📦'}
            </div>
            <div className='flex-1'>
              <p className='font-bold'>{t.description || t.category?.name || 'Giao dịch'}</p>
              <p className='text-sm text-slate-400'>{formatDate(t.transaction_date)}</p>
            </div>
            <p className={'font-bold ' + (t.transaction_type === 'expense' ? 'text-rose-500' : 'text-emerald-500')}>
              {t.transaction_type === 'expense' ? '-' : '+'}{formatVND(t.amount)}
            </p>
          </Card>
        ))}
      </div>
    </div>
  )
}
