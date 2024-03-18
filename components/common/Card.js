export default function Card({ title = '', children }) {
  return (
    <div className="mx-auto w-full max-w-5xl rounded-lg border border-gray-200 bg-white p-5">
      <h2>{title}</h2>
      {children}
    </div>
  )
}
