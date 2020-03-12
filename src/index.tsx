import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'

import { App, createOrHydrateApolloClient } from './App'

const client = createOrHydrateApolloClient()

const rootElement = document.getElementById('root')

if ((window as any).__APOLLO_CACHE__) {
  console.log('hydating react ...')
  ReactDOM.hydrate(<App client={client}/>, rootElement)
} else {
  ReactDOM.render(<App client={client}/>, rootElement)
}
