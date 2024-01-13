import { useContext } from 'react'
import SystemInfoContext from '../providers/SystemInfoProvider'

interface HeaderProps {}
const Header = (props: HeaderProps) => {
  const { isMobile } = useContext(SystemInfoContext)

  return (
    <div className='rounded-sm'>{`欢迎来到南华的小站！is mobile: ${isMobile}`}</div>
  )
}

export default Header
