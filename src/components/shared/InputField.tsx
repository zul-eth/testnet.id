type Props = {
  label?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: 'text' | 'number'
  disabled?: boolean
  required?: boolean
}

export default function InputField({
  label,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  disabled = false,
  required = false,
}: Props) {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-1 text-sm font-medium text-gray-600">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
          disabled
            ? 'bg-gray-100 cursor-not-allowed text-gray-400 border-gray-200'
            : 'border-gray-300 focus:ring-green-400'
        }`}
      />
    </div>
  )
}
