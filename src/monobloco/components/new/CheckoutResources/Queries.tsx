import { loader } from 'graphql.macro'

const orderForm = loader('./queries/orderForm.graphql')

export default {
  orderForm,
}
