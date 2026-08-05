import React, { useState } from 'react'
import styles from './PasswordField.module.css'

interface PasswordFieldProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  value,
  onChange,
  placeholder,
  required,
}) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className={styles.container}>
      <input
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Enter password'}
        required={required}
        className={styles.input}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className={styles.toggleButton}
        title={showPassword ? 'Hide password' : 'Show password'}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? '👁️‍🗨️' : '👁️'}
      </button>
    </div>
  )
}

export default PasswordField
