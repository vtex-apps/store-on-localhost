import { useEffect } from 'react'
import { usePixel } from '../../PixelContext/PixelContext'

const useCartIdPixel = (orderFormId?: string) => {
  const { push } = usePixel()

  useEffect(() => {
    if (!orderFormId) {
      return
    }

    push({
      event: 'cartId',
      cartId: orderFormId,
    } as any)
  }, [push, orderFormId])
}

export default useCartIdPixel
