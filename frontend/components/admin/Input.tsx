import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export function Input({ label, error, hint, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-poppins font-medium text-cream-50">{label}</label>}
      <input
        className={`px-3 py-2 rounded-md bg-ink-700 border border-teal-700 border-opacity-20 text-cream-50 placeholder-cream-50 placeholder-opacity-40 text-sm font-poppins transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${error ? 'border-red-900 border-opacity-100' : ''} ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-400 font-poppins">{error}</span>}
      {hint && <span className="text-xs text-cream-50 text-opacity-60 font-poppins">{hint}</span>}
    </div>
  )
}
