import React, { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { formatVND } from '@/utils/format'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip } from 'recharts'

export function Categories() {
  const [timeRange, setTimeRange] = useState('thang')
  const [type, setType] = useState('expense')

  const pieData = [
    { name: 'Ăn uống', value: 1500000, color: '#6366f1' },
    { name: 'Di chuyển', value: 600000, color: '#ec4899' },
    { name: 'Mua sắm', value: 400000, color: '#10b981' },
  ]

  const barData = [
    { name: 'T2', amount: 300000 },
    { name: 'T3', amount: 450000 },
    { name: 'T4', amount: 200000 },
    { name: 'T5', amount: 800000 },
    { name: 'T6', amount: 150000 },
    { name: 'T7', amount: 900000 },
    { name: 'CN', amount: 600000 },
  ]

  return (
    <div className="p-4 flex flex-col gap-4 pb-24">
      <header className="flex justify-between items-center mt-2 mb-2">
        <h1 className="text-2xl font-bold">Thống kê</h1>
      </header>

      {/* Tabs Bộ lọc thời gian */}
      <div className="flex bg-slate-800 rounded-xl p-1">
        {['ngay', 'tuan', 'thang'].map(range => (
          <button 
            key={range}
            onClick={() => setTimeRange(range)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${timeRange === range ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            {range === 'ngay' ? 'Ngày' : range === 'tuan' ? 'Tuần' : 'Tháng'}
          </button>
        ))}
      </div>

      <div className="flex bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
        <button onClick={() => setType('expense')} className={`flex-1 py-2 text-sm font-medium transition-colors ${type === 'expense' ? 'bg-red-500/20 text-red-400' : 'text-slate-400'}`}>Chi tiêu</button>
        <button onClick={() => setType('income')} className={`flex-1 py-2 text-sm font-medium transition-colors ${type === 'income' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'}`}>Thu nhập</button>
      </div>

      <Card className="p-4">
        <h3 className="text-sm text-slate-400 mb-4 text-center">Biểu đồ theo thời gian</h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <RechartsTooltip cursor={{fill: '#334155'}} contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px'}} />
              <Bar dataKey="amount" fill={type === 'expense' ? '#ef4444' : '#10b981'} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="flex flex-col items-center justify-center p-6">
        <h3 className="text-sm text-slate-400 mb-2 w-full text-left">Tỷ trọng danh mục</h3>
        <div className="h-40 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-xs text-slate-400">Tổng</p>
            <p className="font-bold">{formatVND(2500000)}</p>
          </div>
        </div>
      </Card>

      <div className="flex flex-col gap-3 mt-2">
        {pieData.map(item => (
          <Card key={item.name} className="p-4 flex justify-between items-center border-l-4" style={{borderLeftColor: item.color}}>
            <span className="font-medium">{item.name}</span>
            <span className="font-bold">{formatVND(item.value)}</span>
          </Card>
        ))}
      </div>
    </div>
  )
}