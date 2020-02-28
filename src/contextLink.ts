import { ApolloLink, NextLink, Operation } from 'apollo-link'

export const contextLink = new ApolloLink((operation: Operation, forward?: NextLink) => {
  return forward ? forward(operation) : null
})