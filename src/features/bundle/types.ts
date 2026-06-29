export interface Variant {
  id: string
  label: string
  color: string
  image?: string
  quantity: number
}

export interface Product {
  id: string
  name: string
  description: string
  learnMoreUrl: string
  image: string
  badge: string | null
  comparePrice: number | null
  price: number
  priceUnit?: string
  isFree?: boolean
  variants: Variant[] | null
  activeVariantId: string | null
  defaultQuantity?: number
  preSelected?: boolean
  quantity?: number
}

export interface Step {
  id: string
  stepNumber: number
  title: string
  icon: string
  products: Product[]
}

export interface Shipping {
  label: string
  comparePrice: number
  price: number
  isFree: boolean
}

export interface ReviewLineItem {
  id: string
  name: string
  image: string
  price: number
  comparePrice: number | null
  priceUnit?: string
  isFree?: boolean
  quantity: number
  stepId: string
  productId: string
  variantId?: string
  category: string
}
