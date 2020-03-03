import { stringify } from 'query-string'
import { isEmpty } from 'ramda'
import { parse, format } from 'url'

// import navigationPageQuery from '../queries/navigationPage.graphql'
// import routePreviews from '../queries/routePreviews.graphql'
import { generateExtensions } from './blocks'
import { fetchWithRetry } from './fetch'
import { parseMessages } from './messages'

const navigationPageQuery: any = ''
const routePreviews: any = ''

const parsePageQueryResponse = (
  page: any
): any => {
  const {
    appsEtag,
    appsSettingsJSON,
    blocksJSON,
    blocksTreeJSON,
    contentMapJSON,
    cacheHintsJSON,
    componentsJSON,
    extensionsJSON,
    messages,
    pagesJSON,
    page: {
      blockId,
      canonicalPath,
      metaTags,
      pageContext: { id, type },
      routeId,
      title,
    },
  } = page

  const [
    blocks,
    blocksTree,
    contentMap,
    cacheHints,
    components,
    pages,
    settings,
  ] = [
    blocksJSON,
    blocksTreeJSON,
    contentMapJSON,
    cacheHintsJSON,
    componentsJSON,
    pagesJSON,
    appsSettingsJSON,
  ].map(json => JSON.parse(json))

  const extensions = isEmpty(blocksTree)
    ? JSON.parse(extensionsJSON)
    : generateExtensions(blocksTree, blocks, contentMap, pages[routeId])

  return {
    appsEtag,
    cacheHints,
    blocks,
    blocksTree,
    contentMap,
    components,
    extensions,
    matchingPage: {
      blockId,
      canonicalPath,
      metaTags,
      pageContext: { id, type },
      routeId,
      title,
    },
    messages: parseMessages(messages),
    pages,
    settings,
  }
}

const parseDefaultPagesQueryResponse = (
  defaultPages: any
): any => {
  const { componentsJSON } = defaultPages
  const components = JSON.parse(componentsJSON)
  return {
    components,
  }
}

const runtimeFields = [
  'appsEtag',
  'blocks',
  'blocksTree',
  'components',
  'contentMap',
  'extensions',
  'messages',
  'page',
  'pages',
  'query',
  'queryData',
  'route',
  'runtimeMeta',
  'settings',
].join(',')

export const fetchServerPage = async ({
  fetcher,
  path,
  query: rawQuery,
}: {
  path: string
  query?: Record<string, string>
  fetcher: any['fetch']
}): Promise<any> => {
  const parsedUrl = parse(path)
  parsedUrl.search = undefined
  parsedUrl.query = {
    ...rawQuery,
    __pickRuntime: runtimeFields,
  } as any
  const url = format(parsedUrl)
  const page: any = await fetchWithRetry(
    url,
    {
      credentials: 'same-origin',
      headers: {
        accept: 'application/json',
      },
    },
    fetcher
  ).then(({ response }) => response.json())
  const {
    blocksTree,
    blocks,
    contentMap,
    extensions: pageExtensions,
    pages,
    route,
    route: { routeId },
    queryData,
  } = page
  if (routeId === 'redirect') {
    window.location.href = route.path
  }

  const queryString = stringify(rawQuery || {})
  const routePath = `${path}${queryString ? '?' + queryString : queryString}`

  const extensions =
    !isEmpty(blocksTree) && blocksTree && blocks && contentMap
      ? generateExtensions(blocksTree, blocks, contentMap, pages[routeId])
      : pageExtensions

  return {
    ...page,
    extensions,
    matchingPage: {
      ...route,
      path: routePath,
    },
    queryData,
  }
}

export const fetchNavigationPage = ({
  apolloClient,
  routeId,
  declarer,
  production,
  paramsJSON,
  renderMajor,
  skipCache,
  query,
}: any) =>
  apolloClient
    .query({
      fetchPolicy: production && !skipCache ? 'cache-first' : 'network-only',
      query: navigationPageQuery,
      variables: {
        declarer,
        params: paramsJSON,
        production,
        query,
        renderMajor,
        routeId,
      },
    })
    .then(
      ({
        data: { navigationPage: pageData },
        errors,
      }) =>
        errors ? Promise.reject(errors) : parsePageQueryResponse(pageData)
    )

const getRoutesParam = (routeIds: string[], pages: any) => {
  return routeIds
    .filter(routeId => routeId in pages)
    .map(routeId => {
      const page = pages[routeId]
      return {
        declarer: page.declarer,
        routeId,
      }
    })
}

export const fetchDefaultPages = ({
  apolloClient,
  pages,
  routeIds,
  renderMajor,
}: any) => {
  return apolloClient
    .query({
      query: routePreviews,
      variables: { renderMajor, routes: getRoutesParam(routeIds, pages) },
    })
    .then(
      ({ data: { defaultPages }, errors }) => {
        return errors
          ? Promise.reject(errors)
          : parseDefaultPagesQueryResponse(defaultPages)
      }
    )
}
