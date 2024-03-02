export default function Card({ title, children }) {
  return (
    <div className="mx-auto w-full max-w-4xl bg-white rounded-2xl border-4 border-gray-200 p-8">
      <h1>{title || ''}</h1>
      <div>{children}</div>
    </div>
  )
}
