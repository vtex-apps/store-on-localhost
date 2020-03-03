import { loader } from 'graphql.macro'

const orderForm = loader('./queries/orderForm.gql')
const product = loader('./queries/product.gql')
const productPreviewFragment = loader('./queries/productPreview.gql')
const recommendationsAndBenefits = loader('./queries/recommendationsAndBenefits.gql')
const search = loader('./queries/search.gql')
const productSearch = loader('./queries/productSearch.gql')
const productSearchV2 = loader('./queries/productSearchV2.gql')
const session = loader('./queries/session.gql')
const productBenefits = loader('./queries/productBenefits.gql')
const address = loader('./queries/address.gql')
const searchMetadata = loader('./queries/searchMetadata.gql')
const productCategoryTree = loader('./queries/UNSTABLE__productCategoryTree.gql')
const facets = loader('./queries/facets.gql')

export default {
  address,
  orderForm,
  product,
  productSearch,
  productSearchV2,
  productPreviewFragment,
  recommendationsAndBenefits,
  search,
  session,
  productBenefits,
  UNSTABLE__productCategoryTree: productCategoryTree,
  searchMetadata,
  facets,
}
