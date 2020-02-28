import { path, pathOr } from 'ramda'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { injectIntl } from 'react-intl'
import ToastContext from '../components/new/Styleguide/ToastContext'
import { useRuntime } from '../../vtex.render-runtime'

function NetworkStatusToast({ intl }) {
  const runtime = useRuntime()
  const [offline, setOffline] = useState(false)
  // Useful to dismissable toast flow.
  const [showingOffline, setShowingOffline] = useState(false)
  const { showToast, hideToast, toastState } = useContext(ToastContext)

  const toastConfig = useMemo(
    () => ({
      message: intl.formatMessage({
        id: 'store/store.network-status.offline',
      }),
      dismissable: pathOr(false, ['hints', 'mobile'], runtime),
      duration: Infinity,
    }),
    [intl, runtime]
  )

  const updateStatus = useCallback(() => {
    if (navigator) {
      setOffline(!pathOr(true, ['onLine'], navigator))
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
      path(['currentToast', 'message'], toastState) === toastConfig.message
    ) {
      hideToast()
      setShowingOffline(false)
    }
  }, [offline, toastState, toastConfig, showingOffline, showToast, hideToast])

  return null
}

export default injectIntl(NetworkStatusToast)
