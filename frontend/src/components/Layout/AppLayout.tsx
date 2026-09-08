import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'

export function AppLayout() {
  const [isAddOpen, setIsAddOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-16">
      <div className="max-w-[430px] mx-auto min-h-screen relative shadow-2xl bg-slate-900 border-x border-slate-800/50">
        <Outlet />
        
        <button 
          onClick={() => setIsAddOpen(true)}
          className="fixed bottom-20 right-4 sm:absolute sm:right-6 w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-[0_0_15px_rgba(79,70,229,0.5)] hover:bg-indigo-700 active:scale-90 transition-all z-40"
        >
          <Plus size={28} />
        </button>

        <BottomNav />
      </div>

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Thêm giao dịch thủ công">
        <AddTransactionForm onClose={() => setIsAddOpen(false)} />
      </Modal>
    </div>
  )
}

function AddTransactionForm({ onClose }: { onClose: () => void }) {
  const [type, setType] = useState<'expense' | 'income'>('expense')

  const expenseCategories = ['Ăn uống', 'Di chuyển', 'Mua sắm', 'Giải trí', 'Y tế', 'Hóa đơn', 'Giáo dục', 'Nhà cửa', 'Khác']
  const incomeCategories = ['Lương', 'Thưởng', 'Đầu tư', 'Bán đồ', 'Khác']

  const categories = type === 'expense' ? expenseCategories : incomeCategories

  return (
    <>
      <div className="flex bg-slate-900 rounded-xl p-1 mb-4">
        <button 
          onClick={() => setType('expense')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${type === 'expense' ? 'bg-red-500 text-white' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Chi tiêu
        </button>
        <button 
          onClick={() => setType('income')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${type === 'income' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Thu nhập
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label className="text-sm text-slate-400 mb-1 block">Số tiền</label>
          <input 
            type="number" 
            placeholder="0" 
            className={`w-full bg-slate-900 text-2xl font-bold p-3 rounded-xl outline-none ${type === 'expense' ? 'text-red-400' : 'text-emerald-400'}`} 
          />
        </div>
        <div>
          <label className="text-sm text-slate-400 mb-1 block">Danh mục</label>
          <select className="w-full bg-slate-900 p-3 rounded-xl outline-none text-slate-200 appearance-none cursor-pointer">
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-slate-400 mb-1 block">Ghi chú</label>
          <input type="text" placeholder={type === 'expense' ? "Ăn trưa, đổ xăng..." : "Nhận lương tháng..."} className="w-full bg-slate-900 p-3 rounded-xl outline-none text-slate-200" />
        </div>
        <button 
          className="w-full bg-indigo-600 text-white py-4 rounded-xl font-medium mt-4 active:scale-95 transition-all" 
          onClick={onClose}
        >
          Lưu giao dịch
        </button>
      </div>
    </>
  )
}
