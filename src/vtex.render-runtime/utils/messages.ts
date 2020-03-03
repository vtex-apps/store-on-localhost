import { pluck, zipObj } from 'ramda'

export const parseMessages = (messages: any[] | null) => {
  return messages && zipObj(pluck('key', messages), pluck('message', messages))
}
