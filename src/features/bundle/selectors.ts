import type { ReviewLineItem, Shipping, Step } from './types'

export const FINANCING_MONTHS = 12

const CATEGORY_BY_STEP_ID: Record<string, string> = {
  cameras: 'CAMERAS',
  plan: 'PLAN',
  sensors: 'SENSORS',
  protection: 'ACCESSORIES',
}

export function getSelectedCount(step: Step): number {
  return step.products.reduce((count, p) => {
    if (p.variants) {
      const hasAny = p.variants.some(v => v.quantity > 0)
      return count + (hasAny ? 1 : 0)
    }
    return count + ((p.quantity ?? 0) > 0 ? 1 : 0)
  }, 0)
}

export function getReviewItems(steps: Step[]): ReviewLineItem[] {
  const items: ReviewLineItem[] = []

  for (const step of steps) {
    const category = CATEGORY_BY_STEP_ID[step.id] ?? step.id.toUpperCase()

    for (const product of step.products) {
      if (product.variants) {
        for (const variant of product.variants) {
          if (variant.quantity > 0) {
            items.push({
              id: `${product.id}-${variant.id}`,
              name: product.name,
              image: product.image,
              price: product.price,
              comparePrice: product.comparePrice,
              priceUnit: product.priceUnit,
              isFree: product.isFree,
              quantity: variant.quantity,
              stepId: step.id,
              productId: product.id,
              variantId: variant.id,
              category,
            })
          }
        }
      } else {
        const qty = product.quantity ?? 0
        if (qty > 0) {
          items.push({
            id: product.id,
            name: product.name,
            image: product.image,
            price: product.price,
            comparePrice: product.comparePrice,
            priceUnit: product.priceUnit,
            isFree: product.isFree,
            quantity: qty,
            stepId: step.id,
            productId: product.id,
            category,
          })
        }
      }
    }
  }

  return items
}

export interface BundleTotals {
  subtotal: number
  compareSubtotal: number
  total: number
  compareTotal: number
  savings: number
}

export function computeTotals(
  items: ReviewLineItem[],
  shipping: Pick<Shipping, 'price' | 'comparePrice'>,
): BundleTotals {
  let subtotal = 0
  let compareSubtotal = 0

  for (const item of items) {
    subtotal += item.price * item.quantity
    compareSubtotal += (item.comparePrice ?? item.price) * item.quantity
  }

  const total = subtotal + shipping.price
  const compareTotal = compareSubtotal + shipping.comparePrice
  const savings = compareTotal - total

  return { subtotal, compareSubtotal, total, compareTotal, savings }
}
