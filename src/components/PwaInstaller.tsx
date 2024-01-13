import { useCallback, useEffect, useState } from 'react'

interface PwaInstallerProps {}
const PwaInstaller = (props: PwaInstallerProps) => {
  const [shouldShowBtn, setShouldShowBtn] = useState(false)

  const installPromptCallback = useCallback((e: Event) => {
    global.deferredPrompt = e
    setShouldShowBtn(true)
  }, [])

  useEffect(() => {
    global.addEventListener('beforeinstallprompt', installPromptCallback)
  }, [])

  return (
    <div>
      {shouldShowBtn && (
        <button
          children={'将 POMODORO 安装为 APP~'}
          onClick={() => {
            setShouldShowBtn(false)
            global.deferredPrompt.prompt()
            global.deferredPrompt.userChoice.then((choiceResult) => {
              global.removeEventListener(
                'beforeinstallprompt',
                installPromptCallback,
              )
            })
          }}
        />
      )}
    </div>
  )
}

export default PwaInstaller
