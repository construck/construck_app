export const Header = ({ title = '', children }) => {
  return (
    <div className="flex h-12 items-start justify-end">
      <h2 className="flex-1">
        <span>{title}</span>
      </h2>
     {children}
    </div>
  )
}
