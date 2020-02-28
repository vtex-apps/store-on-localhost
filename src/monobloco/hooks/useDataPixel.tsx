import { useEffect, useRef } from 'react'
import {usePixel} from '../components/new/PixelContext/PixelContext'
import { isEmpty } from 'ramda'

type Data = unknown[] | unknown

const useDataPixel = (data: Data, pageIdentifier: string = '', isLoading = false) => {
  const { push } = usePixel()
  const previousIdRef = useRef<string|null>(null)

  const previousId = previousIdRef.current

  useEffect(() => {
    if (pageIdentifier && !isLoading && previousId !== pageIdentifier) {
      if (!data || isEmpty(data)) {
        return
      }
      if (Array.isArray(data)) {
        data.forEach(push)
      } else {
        push(data as any)
      }

      previousIdRef.current = pageIdentifier
    }
  }, [data, isLoading, pageIdentifier, previousId, push])
}

export default useDataPixel
