import { NavLink } from 'react-router-dom'
import { Home, CreditCard, List, CalendarDays, Settings } from 'lucide-react'
import { clsx } from 'clsx'

const navItems = [
  { to: '/', icon: Home, label: 'Tổng quan' },
  { to: '/wallets', icon: CreditCard, label: 'Ví' },
  { to: '/transactions', icon: List, label: 'Giao dịch' },
  { to: '/calendar', icon: CalendarDays, label: 'Lịch' },
  { to: '/settings', icon: Settings, label: 'Cài đặt' },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-700/50 safe-bottom z-50">
      <div className="max-w-[430px] mx-auto flex items-center justify-around h-16 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              clsx(
                'flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all duration-150',
                isActive ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
              )
            }
          >
            {({ isActive }) => (
              <>
                <span className={clsx('transition-transform duration-150', isActive && 'scale-110')}>
                  <item.icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                </span>
                <span className="text-[10px] font-medium">{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 w-1 h-1 bg-indigo-400 rounded-full" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
