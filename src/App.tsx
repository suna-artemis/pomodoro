import Index from './pages/Index'
import { SystemInfoProvider } from './providers/SystemInfoProvider'
import PwaInstaller from './components/PwaInstaller'

interface AppProps {}

const App = (props: AppProps) => {
  const isMobile = new RegExp('Mobile').test(window.navigator.userAgent)

  return (
    <SystemInfoProvider value={{ isMobile }}>
      <Index />
      {/* <PwaInstaller /> */}
    </SystemInfoProvider>
  )
}

export default App
