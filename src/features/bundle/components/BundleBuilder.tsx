import { useSteps, useActiveStep, useBundleActions } from '../store/bundleStore'
import AccordionStep from './AccordionStep'

export default function BundleBuilder() {
  const steps = useSteps()
  const activeStep = useActiveStep()
  const { setActiveStep } = useBundleActions()

  return (
    <>
      {steps.map((step, index) => (
        <div key={step.id}>
          <AccordionStep
            step={step}
            isOpen={activeStep === step.stepNumber}
            onToggle={() =>
              setActiveStep(activeStep === step.stepNumber ? 0 : step.stepNumber)
            }
          />
          {index < steps.length - 1 && <div className="h-px bg-line-subtle" />}
        </div>
      ))}
    </>
  )
}
