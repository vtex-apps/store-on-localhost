import { loader } from 'graphql.macro'

const addToCart = loader('./mutations/addToCart.gql')
const updateItems = loader('./mutations/updateItems.gql')
const updateOrderFormProfile = loader('./mutations/updateOrderFormProfile.gql')
const updateOrderFormShipping = loader('./mutations/updateOrderFormShipping.gql')
const updateOrderFormCheckin = loader('./mutations/updateOrderFormCheckin.gql')

export default {
  addToCart,
  updateItems,
  updateOrderFormProfile,
  updateOrderFormShipping,
  updateOrderFormCheckin,
}
