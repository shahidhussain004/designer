import { ArrowLeft, CheckCircle } from 'lucide-react';

interface StepNavigationProps {
  activeStep: number;
  totalSteps: number;
  isSubmitting: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export function StepNavigation({ activeStep, totalSteps, isSubmitting, onBack, onNext, onSubmit }: StepNavigationProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-8 pt-8 border-t border-secondary-200">
      <button
        type="button"
        onClick={onBack}
        disabled={activeStep === 1}
        className={`inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all text-sm sm:text-base ${
          activeStep === 1
            ? 'bg-secondary-100 text-secondary-400 cursor-not-allowed'
            : 'bg-white text-secondary-700 border border-secondary-300 hover:bg-secondary-50 hover:border-secondary-400'
        }`}
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Back</span>
        <span className="sm:hidden">Previous</span>
      </button>

      {activeStep < totalSteps ? (
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-lg font-semibold bg-primary-600 text-white hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl text-sm sm:text-base"
        >
          <span className="hidden sm:inline">Next Step</span>
          <span className="sm:hidden">Next</span>
          <ArrowLeft className="w-4 h-4 rotate-180" />
        </button>
      ) : (
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-lg font-semibold bg-success-600 text-white hover:bg-success-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Creating...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>Create Job</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
