export const Card = ({ title = '', size = 'lg', children }) => {
  return (
    <div
      className={`className="relative mx-auto w-full rounded-lg border border-gray-200 bg-white p-5 ${
        size === 'sm' ? 'max-w-md p-8' : size === 'md' ? 'b max-w-3xl' : 'max-w-5xl'
      }`}
    >
      <h2 className="text-2xl">{title}</h2>
      {children}
    </div>
  )
}
