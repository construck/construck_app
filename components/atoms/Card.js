export const Card = ({ title = '', children }) => {
  return (
    <div className="relative mx-auto w-full max-w-5xl rounded-lg border border-gray-200 bg-white p-5">
      <h2 className="text-2xl">{title}</h2>
      {children}
    </div>
  )
}
