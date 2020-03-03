import React, { Fragment, useEffect } from 'react'
import Helmet from 'react-helmet'
import PropTypes from 'prop-types'

import PixelContext from './components/new/PixelContext/PixelContext'
import ToastProvider from './components/new/Styleguide/ToastProvider'
import PWAContext from './components/new/StoreResources/PWAContext'
import OrderQueue from './components/new/OrderManager/OrderQueue'
import OrderItems from './components/new/OrderItems/OrderItems'
import OrderManagerForm from './components/new/OrderManager/OrderForm'
import UserDataPixel from './components/UserDataPixel'
import PageViewPixel from './components/PageViewPixel'
import OrderFormProvider from './components/OrderFormProvider'
import NetworkStatusToast from './components/NetworkStatusToast'
import WrapperContainer from './components/WrapperContainer'

import { normalizeNavigation } from './utils/navigation'
import { useRuntime } from '../vtex.render-runtime'
// import { canUseDOM } from 'exenv'

const { OrderQueueProvider } = OrderQueue
const { PixelProvider } = PixelContext
const { PWAProvider } = PWAContext
const { OrderFormProvider: OrderFormProviderCheckout } = OrderManagerForm
const { OrderItemsProvider } = OrderItems

const APP_LOCATOR = 'vtex.store'
const CONTENT_TYPE = 'text/html; charset=utf-8'
const META_ROBOTS = 'index, follow'
const MOBILE_SCALING = 'width=device-width, initial-scale=1'

const systemToCanonical = ({ canonicalPath }) => {
  const canonicalHost =
    window.__hostname__ || (window.location && window.location.hostname)
  return {
    canonicalPath,
    canonicalHost,
  }
}

const StoreWrapper = ({ children }) => {
  const {
    amp,
    culture: { country, locale, currency },
    route,
    route: { metaTags, title: pageTitle },
    getSettings,
    rootPath = '',
    prefetchDefaultPages,
    addNavigationRouteModifier,
  } = useRuntime()
  // const isStorefrontIframe =
  //   canUseDOM && window.top !== window.self && window.top.__provideRuntime

  // const supportsServiceWorker = canUseDOM && 'serviceWorker' in navigator

  useEffect(() => {
    prefetchDefaultPages([
      'store.custom',
      'store.product',
      'store.search',
      'store.search#brand',
      'store.search#category',
      'store.search#configurable',
      'store.search#custom',
      'store.search#department',
      'store.search#subcategory',
      'store.search#subcategory-terms',
    ])
  }, [prefetchDefaultPages])

  useEffect(() => {
    addNavigationRouteModifier(normalizeNavigation)
  }, [addNavigationRouteModifier])

  const settings = getSettings(APP_LOCATOR) || {}
  const {
    titleTag,
    metaTagDescription,
    metaTagRobots,
    storeName,
    faviconLinks,
  } = settings

  const { canonicalHost, canonicalPath } = systemToCanonical(route)
  const description = (metaTags && metaTags.description) || metaTagDescription
  const title = pageTitle || titleTag

  // const [queryMatch] = route.path.match(/\?.*/) || ['?']

  const canonicalLink =
    canonicalHost &&
    canonicalPath &&
    `https://${canonicalHost}${rootPath}${canonicalPath}`

  return (
    <Fragment>
      <Helmet
        title={title}
        meta={[
          // viewport meta tag is already handled in render-server for AMP pages
          !amp && { name: 'viewport', content: MOBILE_SCALING },
          { name: 'description', content: description },
          { name: 'copyright', content: storeName },
          { name: 'author', content: storeName },
          { name: 'country', content: country },
          { name: 'language', content: locale },
          { name: 'currency', content: currency },
          { name: 'robots', content: metaTagRobots || META_ROBOTS },
          { httpEquiv: 'Content-Type', content: CONTENT_TYPE },
        ]
          .filter(Boolean)
          .filter(meta => meta.content && meta.content.length > 0)}
        // script={[
        //   supportsServiceWorker && {
        //     type: 'text/javascript',
        //     src: `${rootPath}/pwa/workers/register.js${queryMatch}&scope=${encodeURIComponent(
        //       rootPath
        //     )}`,
        //     defer: true,
        //   },
        // ].filter(Boolean)}
        link={[
          ...(faviconLinks || []),
          ...(!amp && canonicalLink
            ? [
                {
                  rel: 'canonical',
                  href: encodeURI(canonicalLink),
                },
              ]
            : []),
        ].filter(Boolean)}
      />
      <PixelProvider currency={currency}>
        <PWAProvider rootPath={rootPath}>
          <PageViewPixel title={title} />
          <UserDataPixel />
          <ToastProvider positioning="window">
            <NetworkStatusToast />
            <OrderFormProvider>
              <OrderQueueProvider>
                <OrderFormProviderCheckout>
                  <OrderItemsProvider>
                    <WrapperContainer className="vtex-store__template bg-base">
                      {children}
                    </WrapperContainer>
                  </OrderItemsProvider> 
                </OrderFormProviderCheckout>
              </OrderQueueProvider>
            </OrderFormProvider>
          </ToastProvider> 
        </PWAProvider>
      </PixelProvider>
    </Fragment>
  )
}

StoreWrapper.propTypes = {
  children: PropTypes.element,
}

export default StoreWrapper
