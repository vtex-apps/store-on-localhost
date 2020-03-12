import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express'

export interface Response extends ExpressResponse { 
  startTime: (name: string, desc: string) => void
  endTime: (name: string) => void
}

export interface Request extends ExpressRequest {}