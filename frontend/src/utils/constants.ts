const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
export const API_URL = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`;

export const WALLET_TYPES = [
  { value: 'cash', label: 'Tiền mặt', icon: '💵' },
  { value: 'bank', label: 'Ngân hàng', icon: '🏦' },
  { value: 'ewallet', label: 'Ví điện tử', icon: '📱' },
  { value: 'crypto', label: 'Crypto', icon: '₿' },
  { value: 'other', label: 'Khác', icon: '💳' },
]

export const TRANSACTION_TYPES = [
  { value: 'expense', label: 'Chi tiêu', color: '#ef4444' },
  { value: 'income', label: 'Thu nhập', color: '#10b981' },
  { value: 'transfer', label: 'Chuyển khoản', color: '#6366f1' },
]

export const REMINDER_TYPES = [
  { value: 'birthday', label: 'Sinh nhật', icon: '🎂' },
  { value: 'anniversary', label: 'Kỷ niệm', icon: '❤️' },
  { value: 'event', label: 'Sự kiện', icon: '📅' },
  { value: 'custom', label: 'Tùy chỉnh', icon: '⏰' },
]

export const DEFAULT_CATEGORIES = [
  { name: 'Ăn uống', icon: '🍜', color: '#f59e0b' },
  { name: 'Di chuyển', icon: '🚗', color: '#3b82f6' },
  { name: 'Mua sắm', icon: '🛍️', color: '#ec4899' },
  { name: 'Giải trí', icon: '🎮', color: '#8b5cf6' },
  { name: 'Sức khỏe', icon: '💊', color: '#10b981' },
  { name: 'Hóa đơn', icon: '📄', color: '#6b7280' },
  { name: 'Giáo dục', icon: '📚', color: '#0ea5e9' },
  { name: 'Lương', icon: '💰', color: '#10b981' },
  { name: 'Thưởng', icon: '🎁', color: '#f59e0b' },
  { name: 'Khác', icon: '📦', color: '#94a3b8' },
]

export const WALLET_GRADIENTS: Record<string, string> = {
  cash: 'from-emerald-500 to-teal-600',
  bank: 'from-blue-500 to-indigo-600',
  ewallet: 'from-purple-500 to-pink-600',
  crypto: 'from-orange-500 to-yellow-600',
  other: 'from-slate-500 to-slate-600',
}
