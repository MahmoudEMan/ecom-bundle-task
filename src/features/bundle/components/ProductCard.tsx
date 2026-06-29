import { memo } from 'react'
import QuantityStepper from '@/components/ui/QuantityStepper'
import { useBundleActions } from '../store/bundleStore'
import type { Product, Variant } from '../types'

const PLACEHOLDER_IMG =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" font-size="10" fill="%239ca3af" text-anchor="middle" dominant-baseline="middle">No image</text></svg>'

function handleImageError(e: React.SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget
  if (img.src !== PLACEHOLDER_IMG) img.src = PLACEHOLDER_IMG
}

interface ProductCardProps {
  product: Product
  stepId: string
}

function ProductCard({ product, stepId }: ProductCardProps) {
  const { setVariantQuantity, setProductQuantity, setActiveVariant } = useBundleActions()

  const activeVariant: Variant | undefined = product.variants
    ? (product.variants.find(v => v.id === product.activeVariantId) ?? product.variants[0])
    : undefined

  const currentQty = product.variants
    ? (activeVariant?.quantity ?? 0)
    : (product.quantity ?? 0)

  const hasSelection = product.variants
    ? product.variants.some(v => v.quantity > 0)
    : (product.quantity ?? 0) > 0

  const displayImage = activeVariant?.image ?? product.image

  function handleDecrement() {
    if (product.variants && activeVariant) {
      setVariantQuantity(stepId, product.id, activeVariant.id, activeVariant.quantity - 1)
    } else {
      setProductQuantity(stepId, product.id, (product.quantity ?? 0) - 1)
    }
  }

  function handleIncrement() {
    if (product.variants && activeVariant) {
      setVariantQuantity(stepId, product.id, activeVariant.id, activeVariant.quantity + 1)
    } else {
      setProductQuantity(stepId, product.id, (product.quantity ?? 0) + 1)
    }
  }

  return (
    <div
      className={`
        relative flex gap-4 rounded-2xl border-2 bg-surface p-3 transition-all duration-150 h-full
        ${hasSelection ? 'border-primary' : 'border-line-subtle hover:border-line'}
      `}
    >
      {product.badge && (
        <span className="absolute top-3 left-3 z-10 bg-primary text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
          {product.badge}
        </span>
      )}

      <div className="flex w-24 shrink-0 items-center justify-center self-center">
        <img
          src={displayImage}
          alt={product.name}
          loading="lazy"
          onError={handleImageError}
          className="max-h-28 max-w-full object-contain"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2 justify-center">
        <p className="text-xl font-bold leading-tight text-content">{product.name}</p>

        <p className="text-sm leading-snug text-content-secondary">
          {product.description && <>{product.description} </>}
          <a href={product.learnMoreUrl ?? '#'} className="font-medium text-link hover:underline">
            Learn More
          </a>
        </p>

        {product.variants && (
          <div className=" flex flex-wrap gap-2">
            {product.variants.map(variant => {
              const isActive = variant.id === product.activeVariantId
              const isWhite = variant.color === '#FFFFFF'
              return (
                <button
                  key={variant.id}
                  onClick={() => setActiveVariant(stepId, product.id, variant.id)}
                  aria-pressed={isActive}
                  aria-label={`Select ${variant.label} colour`}
                  className={`
                    flex items-center gap-1.5 rounded-lg border px-1 py-0.5 text-xs font-medium transition-colors
                    ${isActive
                      ? 'border-success bg-success/5 text-content'
                      : 'border-line bg-surface text-content-secondary hover:border-content-secondary'}
                  `}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full ${isWhite ? 'border border-line' : ''}`}
                    style={{ backgroundColor: variant.color }}
                  >
                    {variant.image && (
                      <img
                        src={variant.image}
                        alt={variant.label}
                        className="h-full w-full object-contain"
                      />
                    )}
                  </span>
                  <span>{variant.label}</span>
                </button>
              )
            })}
          </div>
        )}

        <div className="flex justify-between items-center">
          <QuantityStepper
            quantity={currentQty}
            onDecrement={handleDecrement}
            onIncrement={handleIncrement}
          />
          <div className="text-right leading-tight">
            {product.comparePrice != null && (
              <p className="text-base font-bold text-danger line-through">
                ${product.comparePrice.toFixed(2)}{product.priceUnit ?? ''}
              </p>
            )}
            <p className={`text-base font-bold ${product.isFree ? 'text-success' : 'text-content-secondary'}`}>
              {product.isFree ? 'FREE' : `$${product.price.toFixed(2)}${product.priceUnit ?? ''}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(ProductCard)
