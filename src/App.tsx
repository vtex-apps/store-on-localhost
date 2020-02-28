import './App.css'

import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { createHttpLink } from 'apollo-link-http'
import { canUseDOM } from 'exenv'
import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { IntlProvider } from 'react-intl'

import staticRuntime from './runtime.json'
import { RenderContextProvider } from './vtex.render-runtime'
import StoreWrapper from './monobloco/StoreWrapper'

const runtime = {
  ...staticRuntime,
  getSettings: () => {},
  prefetchDefaultPages: () => {},
  addNavigationRouteModifier: () => {},
}

export const App = () => {
  const httpLink = createHttpLink({
    credentials: 'include',
    useGETForQueries: false,
    uri: 'https://storetheme.vtex.com/_v/private/graphql/v1',
    includeExtensions: true
  })

  const inMemory = new InMemoryCache({
    addTypename: true,
  })

  const client = new ApolloClient({
    link: ApolloLink.from([httpLink]),
    cache: inMemory,
    ssrMode: !canUseDOM,
  })
  
  return (
    <ApolloProvider client={client}>
      <IntlProvider messages={runtime.messages} locale="en">
        <RenderContextProvider runtime={runtime}>
          <StoreWrapper />
        </RenderContextProvider>  
      </IntlProvider>
    </ApolloProvider>
  );
}
