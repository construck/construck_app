import HomeIcon from './../../assets/icons/Home'

export default function IconComponent({ name = 'home' }) {
  let IconName = null
  switch (name) {
    case 'home':
      IconName = HomeIcon({ height: '1em', width: '1em' })
      break
    default:
      console.warn(`Unknown icon name: ${name}`)
  }

  return <>{IconName}</>
}
