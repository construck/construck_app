// Variant: Primary, Secondary, Outline, Link
// Size: Small, Medium, Large
// Type: Button, Circle
export function Button({
  variant = 'primary',
  type,
  title = '',
  size = 'medium',
  children,
}) {
  return (
    <button
      className={`flex items-center justify-center space-x-1 bg-white rounded  ring-1 ring-zinc-300 shadow-sm cursor-pointer px-1 py-1 text-zinc-800 active:bg-gray-50 ${
        size === 'small' ? 'text-sm' : size === 'large' ? 'text-lg' : ''
      }`}
    >
      {title || children}
    </button>
  )
}
