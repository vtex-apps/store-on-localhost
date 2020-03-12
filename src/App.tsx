import './App.css'

import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { createHttpLink } from 'apollo-link-http'
import { canUseDOM } from 'exenv'
import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { IntlProvider } from 'react-intl'

import HomeWrapper from './monobloco/HomeWrapper'
import StoreWrapper from './monobloco/StoreWrapper'
import staticRuntime from './runtime.json'
import { RenderContextProvider } from './vtex.render-runtime'

const runtime = {
  ...staticRuntime,
  getSettings: () => {},
  prefetchDefaultPages: () => {},
  addNavigationRouteModifier: () => {},
}

interface Props {
  client: ApolloClient<NormalizedCacheObject>
}

export const createOrHydrateApolloClient = () => {
  const httpLink = createHttpLink({
    fetch: window.fetch,
    credentials: 'include',
    useGETForQueries: false,
    uri: 'http://localhost:8001/_v/private/graphql/v1',
    includeExtensions: true
  })
  
  const inMemory = new InMemoryCache({
    addTypename: true,
  })

  if (canUseDOM && (window as any).__APOLLO_CACHE__) {
    console.log('Restoring apollo cache...')
    inMemory.restore((window as any).__APOLLO_CACHE__)
  }
  
  const client = new ApolloClient({
    link: ApolloLink.from([httpLink]),
    cache: inMemory,
    ssrMode: !canUseDOM,
    resolvers: {}
  })

  return client
}

export const App = ({ client }: Props) => (
  <ApolloProvider client={client}>
    <IntlProvider messages={runtime.messages} locale="en">
      <RenderContextProvider runtime={runtime}>
        <StoreWrapper>
          <HomeWrapper />
        </StoreWrapper>
      </RenderContextProvider>  
    </IntlProvider>
  </ApolloProvider>
)
