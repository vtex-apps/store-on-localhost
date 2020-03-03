import CheckoutUtils from '../../CheckoutResources/Utils'
const { useCheckoutURL } = CheckoutUtils
import { useRuntime } from '../../../../../vtex.render-runtime'

export default function useCheckout() {
  const { url: checkoutUrl, major } = useCheckoutURL()
  const { navigate } = useRuntime()

  const goToCheckout = (url: string) => {
    if (major > 0 && url === checkoutUrl) {
      navigate({ to: url })
    } else {
      window.location.href = url
    }
  }

  return goToCheckout
}
