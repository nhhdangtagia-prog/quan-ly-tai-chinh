import React, { useState } from 'react'
import { Plus, Bell } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'

export function Calendar() {
  const [isAddOpen, setIsAddOpen] = useState(false)

  return (
    <div className="p-4 flex flex-col gap-4 pb-24">
      <header className="flex justify-between items-center mt-2 mb-2">
        <h1 className="text-2xl font-bold">Lịch & Nhắc nhở</h1>
        <button 
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1 bg-indigo-600/20 text-indigo-400 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-600/30 transition-colors"
        >
          <Plus size={16} /> Thêm lịch
        </button>
      </header>

      <Card className="p-4 mb-2">
        <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-700 rounded-xl">
          Lịch tháng hiện tại (Placeholder)
        </div>
      </Card>

      <h3 className="font-bold text-lg">Sắp tới</h3>
      <div className="flex flex-col gap-3">
        <Card className="p-4 flex justify-between items-center border-l-4 border-pink-500 group">
          <div className="flex items-center gap-4">
            <div className="text-3xl">🎂</div>
            <div>
              <p className="font-bold">Sinh nhật Mẹ</p>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span>09/09 (2 ngày nữa)</span>
                <span className="flex items-center gap-1 text-xs bg-slate-700 px-1.5 py-0.5 rounded"><Bell size={10}/> Nhắc trước 1, 3 ngày</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 flex justify-between items-center border-l-4 border-indigo-500 group">
          <div className="flex items-center gap-4">
            <div className="text-3xl">💳</div>
            <div>
              <p className="font-bold">Đóng tiền nhà</p>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span>17/09 (10 ngày nữa)</span>
                <span className="flex items-center gap-1 text-xs bg-slate-700 px-1.5 py-0.5 rounded"><Bell size={10}/> Nhắc qua Telegram</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Modal Thêm Lịch / Nhắc nhở */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Thêm nhắc nhở mới">
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Loại sự kiện</label>
            <div className="flex bg-slate-900 rounded-xl p-1">
              <button className="flex-1 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg">🎂 Sinh nhật</button>
              <button className="flex-1 py-2 text-sm font-medium text-slate-400">💳 Thanh toán</button>
              <button className="flex-1 py-2 text-sm font-medium text-slate-400">📝 Khác</button>
            </div>
          </div>
          
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Tên sự kiện</label>
            <input type="text" placeholder="VD: Sinh nhật Bố..." className="w-full bg-slate-900 p-3 rounded-xl outline-none text-slate-200" />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Ngày diễn ra</label>
              <input type="date" className="w-full bg-slate-900 p-3 rounded-xl outline-none text-slate-200" style={{colorScheme: 'dark'}} />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Lặp lại</label>
              <select className="w-full bg-slate-900 p-3 rounded-xl outline-none text-slate-200 appearance-none">
                <option>Hàng năm</option>
                <option>Hàng tháng</option>
                <option>Không lặp lại</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-400 mb-2 block flex items-center gap-2"><Bell size={14}/> Cài đặt nhắc nhở</label>
            <div className="flex flex-wrap gap-2">
              <label className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-lg cursor-pointer border border-indigo-500/50">
                <input type="checkbox" className="accent-indigo-500" defaultChecked /> Đúng ngày
              </label>
              <label className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-lg cursor-pointer border border-indigo-500/50">
                <input type="checkbox" className="accent-indigo-500" defaultChecked /> Trước 1 ngày
              </label>
              <label className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-lg cursor-pointer border border-transparent">
                <input type="checkbox" className="accent-indigo-500" /> Trước 3 ngày
              </label>
              <label className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-lg cursor-pointer border border-transparent">
                <input type="checkbox" className="accent-indigo-500" /> Trước 7 ngày
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl mt-2">
            <div>
              <p className="font-medium">Nhắc qua Telegram</p>
              <p className="text-xs text-slate-400">Gửi tin nhắn vào bot khi đến hạn</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <button 
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-medium mt-2 active:scale-95 transition-all" 
            onClick={() => setIsAddOpen(false)}
          >
            Lưu nhắc nhở
          </button>
        </div>
      </Modal>
    </div>
  )
}