import axios, { AxiosRequestConfig } from 'axios'
import { join } from 'path'
import LRU from 'lru-cache'
import crypto from 'crypto'

import { Request, Response } from '../typings'

interface Cached {
  data: any
  headers: Record<string, string>
  status: number
}

const HOST = 'storetheme.vtex.com'
const PROTOCOL = 'https'
const CACHE = new LRU<string, Cached>({
  max: 1e3
})

const http = axios.create({
  baseURL: `${PROTOCOL}://${HOST}`,
  timeout: 5e3,
})

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const awaitForOperationName = async (operationName: string) => {
  
  let amount = 0
  if (operationName === 'pwaData') {
    amount = 0
  } else if (operationName === 'orderForm') {
    amount = 0
  } else if (operationName === 'orderFormCheckout') {
    amount = 0
  }

  console.log(`[${operationName}]: Awaiting ${amount}ms`)
  await delay(amount)
}

const toMD5 = (input: string) => crypto.createHash('md5').update(input).digest('hex')

const optionsToCacheKey = (config: AxiosRequestConfig): string => [
  `url:${config.url}`,
  `data:${toMD5(JSON.stringify(config.data))}`,
  `headers:${toMD5(JSON.stringify(config.headers))}`
].join('--')

export const proxy = async (req: Request, res: Response) => {
  try {
    const body = req.body
    const operationName = body?.operationName
  
    await awaitForOperationName(operationName)
  
    const options: AxiosRequestConfig = {
      method: 'POST',
      url: join(req.baseUrl, req.url),
      headers: {
        ...req.headers,
        host: HOST,
      },
      data: body,
      validateStatus: () => true
    }
  
    const key = optionsToCacheKey(options)
    const isCached = CACHE.has(key)

    if (!isCached) {
      console.log('[MISS]', options.data?.operationName)
      const { headers, status, data } = await http.request(options)

      if (!isCached && status === 200) {
        CACHE.set(key, {
          headers,
          status,
          data,
        })
      }
    } else {
      console.log('[HIT]', options.data?.operationName)
    }

    const { headers, status, data } = CACHE.get(key)
    
    Object.keys(headers).forEach(header => {
      res.set(header, headers[header])
    })

    res.status(status)
    res.send(data)
    
  } catch (err) {
    console.error(err)
    res.status(500)
    res.send(err)
  }
}