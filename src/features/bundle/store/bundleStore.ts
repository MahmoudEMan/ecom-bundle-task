import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import { persist } from 'zustand/middleware'
import productsData from '../data/products.json'
import type { Shipping, Step } from '../types'

interface BundleState {
  steps: Step[]
  activeStep: number
  shipping: Shipping
  savedAt: string | null

  setActiveStep: (step: number) => void
  setVariantQuantity: (stepId: string, productId: string, variantId: string, quantity: number) => void
  setProductQuantity: (stepId: string, productId: string, quantity: number) => void
  setActiveVariant: (stepId: string, productId: string, variantId: string) => void
  saveSystem: () => void
}

function initSteps(): Step[] {
  return (productsData.steps as Step[]).map(step => ({
    ...step,
    products: step.products.map(p => ({
      ...p,
      quantity: p.defaultQuantity ?? 0,
      variants: p.variants
        ? p.variants.map(v => ({
            ...v,
            quantity: (p.defaultQuantity && p.activeVariantId === v.id) ? (p.variants![0].quantity ?? 0) : v.quantity ?? 0,
          }))
        : null,
    })),
  }))
}

export const useBundleStore = create<BundleState>()(
  persist(
    (set) => ({
      steps: initSteps(),
      activeStep: 1,
      shipping: productsData.shipping,
      savedAt: null,

      setActiveStep: (step) => set({ activeStep: step }),

      setVariantQuantity: (stepId, productId, variantId, quantity) =>
        set(state => ({
          steps: state.steps.map(s =>
            s.id !== stepId ? s : {
              ...s,
              products: s.products.map(p =>
                p.id !== productId ? p : {
                  ...p,
                  variants: p.variants!.map(v =>
                    v.id !== variantId ? v : { ...v, quantity: Math.max(0, quantity) }
                  ),
                }
              ),
            }
          ),
        })),

      setProductQuantity: (stepId, productId, quantity) =>
        set(state => ({
          steps: state.steps.map(s =>
            s.id !== stepId ? s : {
              ...s,
              products: s.products.map(p =>
                p.id !== productId ? p : { ...p, quantity: Math.max(0, quantity) }
              ),
            }
          ),
        })),

      setActiveVariant: (stepId, productId, variantId) =>
        set(state => ({
          steps: state.steps.map(s =>
            s.id !== stepId ? s : {
              ...s,
              products: s.products.map(p =>
                p.id !== productId ? p : { ...p, activeVariantId: variantId }
              ),
            }
          ),
        })),

      saveSystem: () => set({ savedAt: new Date().toISOString() }),
    }),
    {
      name: 'wyze-bundle-system',
      // Restore only quantities + activeStep; product data always comes from JSON.
      merge: (persisted: unknown, current) => {
        const p = persisted as Partial<BundleState>
        if (!p?.steps) return current

        const mergedSteps = current.steps.map(freshStep => {
          const savedStep = p.steps!.find(s => s.id === freshStep.id)
          if (!savedStep) return freshStep

          return {
            ...freshStep,
            products: freshStep.products.map(freshProduct => {
              const savedProduct = savedStep.products.find(sp => sp.id === freshProduct.id)
              if (!savedProduct) return freshProduct

              if (freshProduct.variants) {
                return {
                  ...freshProduct,
                  activeVariantId: savedProduct.activeVariantId ?? freshProduct.activeVariantId,
                  variants: freshProduct.variants.map(fv => {
                    const sv = savedProduct.variants?.find(v => v.id === fv.id)
                    return { ...fv, quantity: sv?.quantity ?? fv.quantity }
                  }),
                }
              }
              return { ...freshProduct, quantity: savedProduct.quantity ?? freshProduct.quantity }
            }),
          }
        })

        return {
          ...current,
          steps: mergedSteps,
          activeStep: p.activeStep ?? current.activeStep,
          savedAt: p.savedAt ?? current.savedAt,
        }
      },
    }
  )
)

export const useActiveStep = () => useBundleStore(s => s.activeStep)
export const useSteps = () => useBundleStore(s => s.steps)
export const useShipping = () => useBundleStore(s => s.shipping)

export interface BundleActions {
  setActiveStep: BundleState['setActiveStep']
  setVariantQuantity: BundleState['setVariantQuantity']
  setProductQuantity: BundleState['setProductQuantity']
  setActiveVariant: BundleState['setActiveVariant']
  saveSystem: BundleState['saveSystem']
}

export const useBundleActions = (): BundleActions =>
  useBundleStore(
    useShallow(s => ({
      setActiveStep: s.setActiveStep,
      setVariantQuantity: s.setVariantQuantity,
      setProductQuantity: s.setProductQuantity,
      setActiveVariant: s.setActiveVariant,
      saveSystem: s.saveSystem,
    })),
  )

export const useStep = (stepNumber: number) =>
  useBundleStore(s => s.steps.find(step => step.stepNumber === stepNumber))
