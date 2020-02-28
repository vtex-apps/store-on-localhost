import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { injectIntl } from 'react-intl'
import { ToastContext } from './ToastProvider'

function NetworkStatusToast({ intl }) {
  
  const [offline, setOffline] = useState(false)
  // Useful to dismissable toast flow.
  const [showingOffline, setShowingOffline] = useState(false)
  const { showToast, hideToast, toastState } = useContext(ToastContext)

  const toastConfig = useMemo(
    () => ({
      message: intl.formatMessage({
        id: 'store/store.network-status.offline',
      }),
      dismissable: true,
      duration: Infinity,
    }),
    [intl]
  )

  const updateStatus = useCallback(() => {
    if (navigator) {
      setOffline(navigator?.onLine || true)
    }
  }, [])

  useEffect(() => {
    if (window) {
      window.addEventListener('online', updateStatus)
      window.addEventListener('offline', updateStatus)
    }
    updateStatus()
    return function cleanUp() {
      if (window) {
        window.removeEventListener('online', updateStatus)
        window.removeEventListener('offline', updateStatus)
      }
    }
  }, [updateStatus])

  useEffect(() => {
    if (offline && !toastState.currentToast) {
      if (!showingOffline) {
        showToast(toastConfig)
      }
      setShowingOffline(!showingOffline)
    } else if (
      !offline &&
      toastState.isToastVisible &&
      toastState?.currentToast?.message === toastConfig.message
    ) {
      hideToast()
      setShowingOffline(false)
    }
  }, [offline, toastState, toastConfig, showingOffline, showToast, hideToast])

  return null
}

export default injectIntl(NetworkStatusToast)
