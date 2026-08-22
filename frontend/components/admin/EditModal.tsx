'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from './Button'
import { Input } from './Input'

interface EditModalProps {
  isOpen: boolean
  title: string
  item: Record<string, any> | null
  fields: Array<{
    name: string
    label: string
    type: 'text' | 'textarea' | 'select'
    options?: Array<{ value: string; label: string }>
  }>
  onClose: () => void
  onSave: (data: Record<string, any>) => Promise<void>
}

export function EditModal({ isOpen, title, item, fields, onClose, onSave }: EditModalProps) {
  const [formData, setFormData] = useState<Record<string, any>>(item || {})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)
      setError(null)
      await onSave(formData)
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen || !item) return null

  return (
    <div className="fixed inset-0 bg-ink-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-ink-800 border border-teal-700 border-opacity-20 rounded-md max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-teal-700 border-opacity-20 sticky top-0 bg-ink-800">
          <h2 className="text-xl font-outfit font-bold text-cream-50">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-ink-700 rounded transition-colors text-cream-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {success && (
            <div className="p-3 bg-green-900 bg-opacity-30 text-green-400 rounded text-sm font-poppins">
              ✓ Saved successfully
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-900 bg-opacity-30 text-red-400 rounded text-sm font-poppins">
              {error}
            </div>
          )}

          {fields.map((field) => (
            <div key={field.name}>
              {field.type === 'textarea' ? (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-poppins font-medium text-cream-50">
                    {field.label}
                  </label>
                  <textarea
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    rows={4}
                    className="px-3 py-2 rounded-md bg-ink-700 border border-teal-700 border-opacity-20 text-cream-50 placeholder-cream-50 placeholder-opacity-40 text-sm font-poppins transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              ) : field.type === 'select' ? (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-poppins font-medium text-cream-50">
                    {field.label}
                  </label>
                  <select
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    className="px-3 py-2 rounded-md bg-ink-700 border border-teal-700 border-opacity-20 text-cream-50 text-sm font-poppins transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select {field.label.toLowerCase()}</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <Input
                  label={field.label}
                  name={field.name}
                  type={field.type}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3 justify-end p-6 border-t border-teal-700 border-opacity-20 bg-ink-800 sticky bottom-0">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} isLoading={isLoading}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}
