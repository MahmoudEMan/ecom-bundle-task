interface QuantityStepperProps {
  quantity: number
  onDecrement: () => void
  onIncrement: () => void
  size?: 'sm' | 'md'
  min?: number
  max?: number
  label?: string
}

export default function QuantityStepper({
  quantity,
  onDecrement,
  onIncrement,
  size = 'md',
  min = 0,
  max = Infinity,
  label = 'Quantity',
}: QuantityStepperProps) {
  const isSmall = size === 'sm'

  const buttonClass = [
    'flex items-center justify-center rounded  bg-canvas text-content-secondary',
    'hover:bg-surface-muted disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-white disabled:border disabled:border-line transition-colors font-medium',
    isSmall ? 'w-6 h-6 text-sm' : 'w-5 h-5 text-base',
    
  ].join(' ')

  return (
    <div
      role="group"
      aria-label={label}
      className={`flex items-center ${isSmall ? 'gap-0.5' : 'gap-1'}`}
    >
      <button
        type="button"
        onClick={onDecrement}
        disabled={quantity <= min}
        className={buttonClass}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span
        aria-live="polite"
        className={`font-medium text-content text-center ${isSmall ? 'min-w-5 text-sm' : 'min-w-6 text-sm'}`}
      >
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrement}
        disabled={quantity >= max}
        className={buttonClass}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  )
}
