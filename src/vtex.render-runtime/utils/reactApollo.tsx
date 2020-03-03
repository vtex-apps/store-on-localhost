import React, { PureComponent } from 'react'
import { Query, Mutation } from 'react-apollo'
import { compose } from 'ramda'

const noop = () => {}

class RenderRuntimeQuery extends PureComponent<{
  children: (result: any) => JSX.Element | null
}> {
  public render() {
    const { children, ...rest } = this.props

    return (
      <Query {...(rest as any)}>
        {(result: any) => {
          if (result.networkStatus === 1 && result.data === undefined) {
            result.data = {} as any
            result.refetch = noop as any
          }
          return children(result)
        }}
      </Query>
    )
  }
}

class RenderRuntimeMutation extends PureComponent<{
  children: (mutateFunction: any, result: any) => JSX.Element | null
}> {
  public render() {
    const { children, ...rest } = this.props

    return (
      <Mutation {...(rest as any)}>
        {(mutateFunction: any, result: any) => {
          return children(mutateFunction, result)
        }}
      </Mutation>
    )
  }
}

export const createCustomReactApollo = () => {
  // eslint-disable-next-line no-unused-vars
  const { Query, Mutation, ...rest } = window.ReactApollo
  return {
    ...rest,
    Query: RenderRuntimeQuery,
    Mutation: RenderRuntimeMutation,
    compose,
  }
}
