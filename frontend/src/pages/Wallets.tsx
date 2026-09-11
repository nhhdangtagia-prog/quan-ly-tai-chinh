import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { formatVND } from '@/utils/format'
import { apiFetch } from '@/utils/apiClient'
import { WALLET_TYPES } from '@/utils/constants'
import { Plus, Pencil, Trash } from 'lucide-react'

export function Wallets() {
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [type, setType] = useState('cash');
  const [balance, setBalance] = useState('');

  const loadWallets = async () => {
    try {
      const data = await apiFetch('/wallets/');
      setWallets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWallets();
  }, []);

  const openAdd = () => {
    setEditId(null); setShowAdd(true); setName(''); setType('cash'); setBalance('');
  };

  const openEdit = (w: any) => {
    setEditId(w.id); setShowAdd(true); setName(w.name); setType(w.wallet_type); setBalance(w.balance.toString());
  };

  const handleDelete = async (id: string) => {
    if(!confirm('Xóa ví này?')) return;
    try {
      await apiFetch(/wallets/, { method: 'DELETE' });
      loadWallets();
    } catch(err) { alert('Lỗi xóa ví'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const typeInfo = WALLET_TYPES.find(t => t.value === type);
    const payload = {
      name, wallet_type: type, balance: Number(balance) || 0, icon: typeInfo?.icon || '💳', color: '#6366f1'
    };
    try {
      if (editId) {
        await apiFetch(/wallets/, { method: 'PUT', body: JSON.stringify(payload) });
      } else {
        await apiFetch('/wallets/', { method: 'POST', body: JSON.stringify(payload) });
      }
      setShowAdd(false);
      loadWallets();
    } catch (err) {
      alert('Lỗi lưu ví!');
    }
  };

  const totalBalance = wallets.reduce((acc, w) => acc + Number(w.balance), 0);

  return (
    <div className="p-4 flex flex-col gap-4 pb-24">
      <header className="mt-2 mb-2 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-1">Ví của tôi</h1>
          <p className="text-slate-400 text-sm">Tổng tài sản thực tế đang có</p>
        </div>
        <button onClick={showAdd ? () => setShowAdd(false) : openAdd} className="p-2 bg-indigo-500 rounded-full text-white">
          <Plus size={24} className={showAdd ? 'rotate-45 transition-transform' : 'transition-transform'} />
        </button>
      </header>

      {showAdd && (
        <Card className="p-4 border border-indigo-500/30 mb-4">
          <h3 className="font-bold mb-3">{editId ? 'Sửa thông tin ví' : 'Thêm ví mới'}</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input required placeholder="Tên ví (vd: Vietcombank)" className="p-3 rounded-lg bg-slate-800 text-white" value={name} onChange={e => setName(e.target.value)} />
            <select className="p-3 rounded-lg bg-slate-800 text-white" value={type} onChange={e => setType(e.target.value)}>
              {WALLET_TYPES.map(t => <option key={t.value} value={t.value}>{t.icon} {t.label}</option>)}
            </select>
            <input type="number" required placeholder="Số dư hiện tại (VNĐ)" className="p-3 rounded-lg bg-slate-800 text-white" value={balance} onChange={e => setBalance(e.target.value)} />
            <button type="submit" className="bg-indigo-500 py-3 rounded-lg font-bold mt-2">Lưu lại</button>
          </form>
        </Card>
      )}

      <Card gradient className="py-6 mb-2">
        <p className="text-indigo-100 font-medium mb-1">Tổng số dư tất cả các ví</p>
        <h2 className="text-4xl font-bold">{loading ? '...' : formatVND(totalBalance)}</h2>
      </Card>

      <h3 className="font-bold text-lg mt-2">Chi tiết từng ví</h3>
      <div className="flex flex-col gap-3">
        {wallets.length === 0 && !loading && <p className="text-slate-500 text-center py-8">Chưa có ví nào. Hãy bấm nút + để thêm ví mới nhé!</p>}
        {wallets.map(w => (
          <Card key={w.id} className={lex items-center gap-4 p-4 border border-slate-700/50 bg-slate-800/50}>
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-2xl">
              {w.icon}
            </div>
            <div className="flex-1">
              <p className="text-slate-300 font-medium">{w.name}</p>
              <p className="font-bold text-xl text-indigo-400">{formatVND(Number(w.balance))}</p>
            </div>
            <button onClick={() => openEdit(w)} className="p-2 text-slate-400 hover:text-white"><Pencil size={18}/></button>
            <button onClick={() => handleDelete(w.id)} className="p-2 text-rose-400 hover:text-rose-500"><Trash size={18}/></button>
          </Card>
        ))}
      </div>
    </div>
  )
}
