import React from 'react'
import { loader } from 'graphql.macro'
import { useMutation, useQuery } from 'react-apollo'
import { canUseDOM } from 'exenv'

import OrderFormContext from './new/StoreResources/OrderFormContext'

const addToCartMutation = loader('./new/StoreResources/mutations/addToCart.gql')
const updateItemsMutation = loader('./new/StoreResources/mutations/updateItems.gql')
const updateOrderFormProfileMutation = loader('./new/StoreResources/mutations/updateOrderFormProfile.gql')
const updateOrderFormShippingMutation = loader('./new/StoreResources/mutations/updateOrderFormShipping.gql')
const updateOrderFormCheckinMutation = loader('./new/StoreResources/mutations/updateOrderFormCheckin.gql')
const orderForm = loader('./new/StoreResources/queries/orderForm.gql')

const { Provider } = OrderFormContext

let value = {}

const OrderFormProvider = ({ children }) => {
  const { data, error } = useQuery(orderForm, { ssr: false })
  const addItem = useMutation(addToCartMutation)
  const updateOrderForm = useMutation(updateItemsMutation)
  const updateOrderFormProfile = useMutation(updateOrderFormProfileMutation)
  const updateOrderFormShipping = useMutation(updateOrderFormShippingMutation)
  const updateOrderFormCheckin = useMutation(updateOrderFormCheckinMutation)

  if (error) {
    throw error
  }

  value = {
    message: data?.message,
    orderFormContext: {
      updateToastMessage: () => console.log('updateToastMessage'),
      updateAndRefetchOrderForm: () => console.log('updateAndRefetchOrderForm'),
      updateOrderForm,
      addItem,
      updateOrderFormProfile,
      updateOrderFormShipping,
      updateOrderFormCheckin,
    }
  }

  return <Provider value={value}>{children}</Provider>

}

export default OrderFormProvider


// class OrderFormProvider extends Component {
//   state = {
//     orderFormContext: {
//       message: { isSuccess: null, text: null },
//       loading: true,
//       orderForm: {},
//       refetch: () => {},
//       addItem: this.props.addItem,
//       updateToastMessage: this.handleMessageUpdate,
//       updateOrderForm: this.props.updateOrderForm,
//       updateAndRefetchOrderForm: this.handleUpdateAndRefetchOrderForm,
//       updateOrderFormProfile: this.props.updateOrderFormProfile,
//       updateOrderFormShipping: this.props.updateOrderFormShipping,
//       updateOrderFormCheckin: this.props.updateOrderFormCheckin,
//     },
//   }

//   static getDerivedStateFromProps(props, state) {
//     if (!props.data.loading && !props.data.error) {
//       const orderFormContext = props.data

//       orderFormContext.message = state.orderFormContext.message

//       return {
//         orderFormContext,
//       }
//     }

//     return state
//   }

//   handleUpdateAndRefetchOrderForm = vars => {
//     return this.props.updateOrderForm(vars).then(() => {
//       return this.props.data.refetch()
//     })
//   }

//   handleMessageUpdate = message => {
//     const context = this.state.orderFormContext
//     context.message = message

//     this.setState({ orderFormContext: context })
//   }

//   render() {
//     const state = this.state

//     state.orderFormContext.updateToastMessage = this.handleMessageUpdate
//     state.orderFormContext.updateAndRefetchOrderForm = this.handleUpdateAndRefetchOrderForm
//     state.orderFormContext.updateOrderForm = this.props.updateOrderForm
//     state.orderFormContext.addItem = this.props.addItem
//     state.orderFormContext.updateOrderFormProfile = this.props.updateOrderFormProfile
//     state.orderFormContext.updateOrderFormShipping = this.props.updateOrderFormShipping
//     state.orderFormContext.updateOrderFormCheckin = this.props.updateOrderFormCheckin

//     return <Provider value={this.state}>{this.props.children}</Provider>
//   }
// }

// const options = {
//   options: () => ({
//     ssr: false,
//   }),
// }

// export default compose(
//   graphql(orderForm, options),
//   graphql(addToCart, { name: 'addItem' }),
//   graphql(updateItems, { name: 'updateOrderForm' }),
//   graphql(updateOrderFormProfile, { name: 'updateOrderFormProfile' }),
//   graphql(updateOrderFormShipping, { name: 'updateOrderFormShipping' }),
//   graphql(updateOrderFormCheckin, { name: 'updateOrderFormCheckin' })
// )(OrderFormProvider)