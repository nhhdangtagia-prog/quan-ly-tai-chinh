import React from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  gradient?: boolean
}

export function Card({ className, gradient, children, ...props }: CardProps) {
  return (
    <div
      className={twMerge(
        clsx(
          'rounded-2xl p-4 shadow-lg',
          gradient ? 'bg-gradient-to-br from-indigo-500 to-indigo-700 text-white' : 'bg-slate-800 text-slate-100',
          props.onClick && 'cursor-pointer active:scale-[0.98] transition-transform'
        ),
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}