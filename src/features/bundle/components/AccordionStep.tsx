import { memo } from 'react'
import { getStepIcon, ChevronDownIcon, ChevronUpIcon } from '@/components/ui/icons/StepIcons'
import { useSteps, useBundleActions } from '../store/bundleStore'
import { getSelectedCount } from '../selectors'
import type { Step } from '../types'
import ProductCard from './ProductCard'

interface AccordionStepProps {
  step: Step
  isOpen: boolean
  onToggle: () => void
}

function AccordionStep({ step, isOpen, onToggle }: AccordionStepProps) {
  const steps = useSteps()
  const { setActiveStep } = useBundleActions()
  const selectedCount = getSelectedCount(step)

  const isLast = step.stepNumber >= steps.length
  const nextStep = steps.find(s => s.stepNumber === step.stepNumber + 1)
  const nextLabel = isLast ? 'Finish' : `Next: ${nextStep?.title ?? ''}`

  const headerId = `step-${step.id}-header`
  const panelId = `step-${step.id}-panel`

  function handleNext() {
    if (!isLast) setActiveStep(step.stepNumber + 1)
  }

  return (
    <div className= {`overflow-hidden rounded-xl ${  isOpen? "bg-highlight":""}`}>
      <div className="px-5 pt-3 pb-2 border-b border-line-subtle">
        <span className="text-xs font-normal text-content-label uppercase tracking-widest">
          STEP {step.stepNumber} OF {steps.length}
        </span>
      </div>

      <h3>
        <button
          id={headerId}
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="w-full flex items-center gap-3 px-5 pt-5 pb-4 hover:bg-canvas transition-colors text-left"
        >
          <span className="text-content-secondary shrink-0">
            {getStepIcon(step.icon, 'w-5 h-5')}
          </span>
          <span className="flex-1 font-bold text-content text-xl">
            {step.title}
          </span>
          <div className="flex items-center gap-1.5 text-primary shrink-0">
            {selectedCount > 0 && (
              <span className="text-sm font-semibold">{selectedCount} selected</span>
            )}
            {isOpen
              ? <ChevronUpIcon className="w-4 h-4 text-primary" />
              : <ChevronDownIcon className="w-4 h-4 text-primary" />
            }
          </div>
        </button>
      </h3>

      {isOpen && (
        <div
          id={panelId}
          role="region"
          aria-labelledby={headerId}
          className="bg-canvas px-4 pb-5"
        >
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {step.products.map((product, i) => {
              const isLoneLast = i === step.products.length - 1 && step.products.length % 2 === 1
              return (
                <div
                  key={product.id}
                  className={isLoneLast ? 'lg:col-span-2 lg:mx-auto lg:w-[calc(50%-0.375rem)]' : ''}
                >
                  <ProductCard product={product} stepId={step.id} />
                </div>
              )
            })}
          </div>

          <div className="mt-5 flex justify-center">
            <button
              onClick={handleNext}
              className="px-10 py-2.5 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors text-sm bg-surface"
            >
              {nextLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(AccordionStep)
