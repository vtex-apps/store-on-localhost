import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import { Helmet } from 'react-helmet'
import { IntlProvider } from 'react-intl'

import NetworkStatusToast from './components/NetworkStatusToast'
import { ToastProvider } from './components/ToastProvider'
// import { OrderFormProvider } from './components/OrderManager/OrderForm'
import messages from './messages.json'

// import PWAContext from './components/new/StoreResources/PWAContext'
// 
// const { PWAProvider } = PWAContext
// 
// import OrderQueue from './components/new/OrderManager/OrderQueue'
// 
// const { OrderQueueProvider } = OrderQueue
// 
// import OrderItems from './components/new/OrderItems/OrderItems'
// 
// const { OrderItemsProvider } = OrderItems
// 
// import OrderManagerForm from './components/new/OrderManager/OrderForm'
// 
// const { OrderFormProvider: OrderFormProviderCheckout } = OrderManagerForm

// import UserDataPixel from './components/UserDataPixel'
// import PageViewPixel from './components/PageViewPixel'
// import OrderFormProvider from './components/OrderFormProvider'
// import NetworkStatusToast from './components/NetworkStatusToast'
// import WrapperContainer from './components/WrapperContainer'
// import { normalizeNavigation } from './utils/navigation'

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

const StoreWrapper = () => {
  const description = 'Store V3'
  const title = 'Store V3'
  const canonicalLink = `https://storetheme.vtex.com`

  return (
    <Fragment>
      <Helmet
        title={title}
        meta={[
          { name: 'description', content: description },
          { httpEquiv: 'Content-Type', content: CONTENT_TYPE },
        ]}
        link={[{ rel: 'canonical', href: encodeURI(canonicalLink) }]}
      />
      <IntlProvider messages={messages} locale="en">
        <ToastProvider positioning="window">
          <NetworkStatusToast />
          {/* <OrderFormProvider> */}
            {/* <OrderQueueProvider>
              <OrderFormProviderCheckout>
                <OrderItemsProvider>
                  <WrapperContainer className="vtex-store__template bg-base">
                    {children}
                  </WrapperContainer>
                </OrderItemsProvider>
              </OrderFormProviderCheckout>
            </OrderQueueProvider> */}
          {/* </OrderFormProvider> */}
        </ToastProvider>
      </IntlProvider>
    </Fragment>
  )
}

StoreWrapper.propTypes = {
  children: PropTypes.element,
}

export default StoreWrapper
