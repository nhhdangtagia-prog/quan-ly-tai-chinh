import { clsx } from 'clsx'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'income' | 'expense' | 'info' | 'warning' | 'auto'
  size?: 'sm' | 'md'
}

const variants = {
  default: 'bg-slate-700 text-slate-300',
  income: 'bg-emerald-500/20 text-emerald-400',
  expense: 'bg-red-500/20 text-red-400',
  info: 'bg-indigo-500/20 text-indigo-400',
  warning: 'bg-amber-500/20 text-amber-400',
  auto: 'bg-blue-500/20 text-blue-400',
}

const sizes = {
  sm: 'text-[10px] px-1.5 py-0.5',
  md: 'text-xs px-2 py-1',
}

export function Badge({ children, variant = 'default', size = 'sm' }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-md font-medium',
        variants[variant],
        sizes[size]
      )}
    >
      {children}
    </span>
  )
}
