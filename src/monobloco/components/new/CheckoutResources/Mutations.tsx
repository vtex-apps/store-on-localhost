import { loader } from 'graphql.macro'

const addToCart = loader('./mutations/addToCart.graphql')
const estimateShipping = loader('./mutations/estimateShipping.graphql')
const insertCoupon = loader('./mutations/insertCoupon.graphql')
const selectDeliveryOption = loader('./mutations/selectDeliveryOption.graphql')
const updateItems = loader('./mutations/updateItems.graphql')

export default {
  addToCart,
  estimateShipping,
  insertCoupon,
  selectDeliveryOption,
  updateItems,
}
