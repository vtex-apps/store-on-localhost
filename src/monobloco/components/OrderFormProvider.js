import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { compose } from 'ramda'
import { loader } from 'graphql.macro'
import OrderFormContext from './new/StoreResources/OrderFormContext'

const addToCart = loader('./new/StoreResources/mutations/addToCart.gql')
const updateItems = loader('./new/StoreResources/mutations/updateItems.gql')
const updateOrderFormProfile = loader('./new/StoreResources/mutations/updateOrderFormProfile.gql')
const updateOrderFormShipping = loader('./new/StoreResources/mutations/updateOrderFormShipping.gql')
const updateOrderFormCheckin = loader('./new/StoreResources/mutations/updateOrderFormCheckin.gql')
const orderForm = loader('./new/StoreResources/queries/orderForm.gql')

const { Provider } = OrderFormContext

class OrderFormProvider extends Component {
  state = {
    orderFormContext: {
      message: { isSuccess: null, text: null },
      loading: true,
      orderForm: {},
      refetch: () => {},
      addItem: this.props.addItem,
      updateToastMessage: this.handleMessageUpdate,
      updateOrderForm: this.props.updateOrderForm,
      updateAndRefetchOrderForm: this.handleUpdateAndRefetchOrderForm,
      updateOrderFormProfile: this.props.updateOrderFormProfile,
      updateOrderFormShipping: this.props.updateOrderFormShipping,
      updateOrderFormCheckin: this.props.updateOrderFormCheckin,
    },
  }

  static getDerivedStateFromProps(props, state) {
    if (!props.data.loading && !props.data.error) {
      const orderFormContext = props.data

      orderFormContext.message = state.orderFormContext.message

      return {
        orderFormContext,
      }
    }

    return state
  }

  handleUpdateAndRefetchOrderForm = vars => {
    return this.props.updateOrderForm(vars).then(() => {
      return this.props.data.refetch()
    })
  }

  handleMessageUpdate = message => {
    const context = this.state.orderFormContext
    context.message = message

    this.setState({ orderFormContext: context })
  }

  render() {
    const state = this.state

    state.orderFormContext.updateToastMessage = this.handleMessageUpdate
    state.orderFormContext.updateAndRefetchOrderForm = this.handleUpdateAndRefetchOrderForm
    state.orderFormContext.updateOrderForm = this.props.updateOrderForm
    state.orderFormContext.addItem = this.props.addItem
    state.orderFormContext.updateOrderFormProfile = this.props.updateOrderFormProfile
    state.orderFormContext.updateOrderFormShipping = this.props.updateOrderFormShipping
    state.orderFormContext.updateOrderFormCheckin = this.props.updateOrderFormCheckin

    return <Provider value={this.state}>{this.props.children}</Provider>
  }
}

const options = {
  options: () => ({
    ssr: false,
  }),
}

export default compose(
  graphql(orderForm, options),
  graphql(addToCart, { name: 'addItem' }),
  graphql(updateItems, { name: 'updateOrderForm' }),
  graphql(updateOrderFormProfile, { name: 'updateOrderFormProfile' }),
  graphql(updateOrderFormShipping, { name: 'updateOrderFormShipping' }),
  graphql(updateOrderFormCheckin, { name: 'updateOrderFormCheckin' })
)(OrderFormProvider)