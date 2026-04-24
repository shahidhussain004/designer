import { CheckCircle } from 'lucide-react';
import { StepConfig } from './types';

interface StickyTabsProps {
  steps: StepConfig[];
  activeStep: number;
  onStepClick: (stepNum: number) => void;
}

export function StickyTabs({ steps, activeStep, onStepClick }: StickyTabsProps) {
  return (
    <div className="sticky top-0 z-20 border-b border-secondary-200 bg-secondary-50 shadow-sm">
      <nav className="flex gap-1 overflow-x-auto scrollbar-hide" aria-label="Progress">
        {steps.map((step) => {
          const isActive = step.num === activeStep;
          const isCompleted = step.num < activeStep;
          const isClickable = isCompleted || isActive;

          return (
            <button
              key={step.num}
              type="button"
              onClick={() => isClickable && onStepClick(step.num)}
              disabled={!isClickable}
              className={`
                flex-1 min-w-[100px] sm:min-w-[140px] flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-6 py-3 sm:py-4 border-b-3 transition-all whitespace-nowrap
                ${isActive 
                  ? 'border-primary-600 text-primary-600 bg-white font-semibold' 
                  : isCompleted
                    ? 'border-success-500 text-success-600 hover:bg-white cursor-pointer'
                    : 'border-transparent text-secondary-400 cursor-not-allowed bg-secondary-50'
                }
              `}
            >
              <div className={`
                w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0
                ${isActive 
                  ? 'bg-primary-600 text-white' 
                  : isCompleted 
                    ? 'bg-success-500 text-white'
                    : 'bg-secondary-200 text-secondary-500'
                }
              `}>
                {isCompleted ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> : step.num}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs uppercase tracking-wide text-secondary-500">Step {step.num}</div>
                <div className="text-sm font-semibold">{step.title}</div>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
