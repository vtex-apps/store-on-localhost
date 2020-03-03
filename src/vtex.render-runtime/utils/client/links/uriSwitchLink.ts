import { ApolloLink, NextLink, Operation } from 'apollo-link'
import { path } from 'ramda'
import { canUseDOM } from 'exenv'
import {
  ASTNode,
  DirectiveNode,
  OperationDefinitionNode,
  StringValueNode,
  visit,
} from 'graphql'

import { generateHash } from '../generateHash'
import { appendLocationSearch } from '../../location'

interface Assets {
  operationType: string
  queryScope?: string
}

const assetsFromQuery = (query: ASTNode) => {
  const assets: Assets = { operationType: 'mutation' }
  visit(query, {
    Directive(node: DirectiveNode) {
      if (node.name.value === 'context') {
        const scopeArg =
          node.arguments &&
          node.arguments.find(argNode => argNode.name.value === 'scope')
        if (scopeArg) {
          assets.queryScope = (scopeArg.value as StringValueNode).value
        }
      }
    },
    OperationDefinition(node: OperationDefinitionNode) {
      assets.operationType = node.operation
    },
  })
  return assets
}

export interface OperationContext {
  fetchOptions: any
  runtime: Pick<
    any,
    | 'appsEtag'
    | 'cacheHints'
    | 'components'
    | 'culture'
    | 'extensions'
    | 'messages'
    | 'pages'
  >
}

const equals = (a: string, b: string) =>
  a && b && a.toLowerCase() === b.toLowerCase()

const extractHints = (query: ASTNode, meta: any) => {
  const { operationType, queryScope } = assetsFromQuery(query)

  let hints
  if (equals(operationType, 'query')) {
    hints = meta ? meta : { scope: queryScope }
  } else {
    hints = { ...meta, scope: 'private' }
  }

  const {
    maxAge = 'long',
    scope = 'public',
    version = 1,
    provider,
    sender,
  } = hints
  return {
    maxAge: maxAge.toLowerCase(),
    operationType,
    scope: scope.toLowerCase(),
    version,
    provider,
    sender,
  }
}

export const createUriSwitchLink = (
  baseURI: string,
  initialRuntime: any
) =>
  new ApolloLink((operation: Operation, forward?: NextLink) => {
    operation.setContext((oldContext: OperationContext) => {
      const {
        fetchOptions = {},
        // Fetches from context for not fetching a stale version of runtime
        runtime: {
          appsEtag,
          cacheHints,
          culture: { locale },
        },
      } = oldContext
      const { extensions } = operation
      const {
        binding,
        workspace,
        route: { domain },
      } = initialRuntime
      const hash = generateHash(operation.query)
      const {
        maxAge,
        scope,
        version,
        operationType,
        provider,
        sender,
      } = extractHints(operation.query, cacheHints[hash])
      const requiresAuthorization = path(
        ['settings', `vtex.${domain}`, 'requiresAuthorization'],
        initialRuntime
      )
      const customScope = requiresAuthorization ? 'private' : scope
      const oldMethod = fetchOptions.method || 'POST'
      const protocol = canUseDOM ? 'https:' : 'http:'
      const method =
        equals(scope, 'private') && equals(operationType, 'query')
          ? 'POST'
          : oldMethod
      extensions.persistedQuery = {
        ...extensions.persistedQuery,
        sender,
        provider,
      }

      let query = `?workspace=${workspace}&maxAge=${maxAge}&appsEtag=${appsEtag}&domain=${domain}&locale=${locale}`
      if (binding && binding.id) {
        query = appendLocationSearch(query, { __bindingId: binding.id })
      }

      return {
        ...oldContext,
        scope: customScope,
        fetchOptions: { ...fetchOptions, method },
        uri: `${protocol}//${baseURI}/_v/${customScope}/graphql/v${version}${query}`,
      }
    })
    return forward ? forward(operation) : null
  })
