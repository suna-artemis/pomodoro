import { createContext } from 'react'

const initSystemInfo = { isMobile: false }

const SystemInfoContext = createContext(initSystemInfo)

export const SystemInfoProvider = SystemInfoContext.Provider

export default SystemInfoContext
