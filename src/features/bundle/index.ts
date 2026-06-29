export { default as BundlePage } from './components/BundlePage'
export { default as BundleBuilder } from './components/BundleBuilder'
export { default as AccordionStep } from './components/AccordionStep'
export { default as ProductCard } from './components/ProductCard'
export { default as ReviewPanel } from './components/ReviewPanel'

export {
  useBundleStore,
  useSteps,
  useActiveStep,
  useShipping,
  useStep,
  useBundleActions,
  type BundleActions,
} from './store/bundleStore'

export {
  getReviewItems,
  getSelectedCount,
  computeTotals,
  FINANCING_MONTHS,
  type BundleTotals,
} from './selectors'

export type { Product, Variant, Step, Shipping, ReviewLineItem } from './types'
