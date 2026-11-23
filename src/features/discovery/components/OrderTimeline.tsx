interface OrderTimelineProps {
  currentStep?: 1 | 2 | 3 | 4 | 5;
  className?: string;
}

const STEPS = [
  { step: 1, title: 'Find Farmers', desc: 'Radius & volume search' },
  { step: 2, title: 'Place Order', desc: 'Reserve daily yield' },
  { step: 3, title: 'Farm Confirms', desc: 'Availability verified' },
  { step: 4, title: 'Collector Route', desc: 'Pickup scheduled' },
  { step: 5, title: 'Delivery', desc: 'Fresh milk received' },
];

export default function OrderTimeline({ currentStep = 1, className = '' }: OrderTimelineProps) {
  return (
    <div className={`bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs ${className}`}>
      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
        MilkLink Supply Flow
      </h4>

      <div className="relative flex items-center justify-between">
        {/* Connecting Line */}
        <div className="absolute left-2 right-2 top-3 h-0.5 bg-slate-100 -z-0" />
        <div
          className="absolute left-2 top-3 h-0.5 bg-sky-500 transition-all duration-300 -z-0"
          style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 95}%` }}
        />

        {STEPS.map((s) => {
          const isDone = s.step < currentStep;
          const isCurrent = s.step === currentStep;

          return (
            <div key={s.step} className="flex flex-col items-center text-center z-10 w-16">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold border-2 transition-all ${
                  isDone
                    ? 'bg-sky-600 border-sky-600 text-white'
                    : isCurrent
                    ? 'bg-white border-sky-600 text-sky-600 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-400'
                }`}
              >
                {isDone ? '✓' : s.step}
              </div>
              <span
                className={`mt-1.5 text-[10px] font-bold leading-tight ${
                  isCurrent ? 'text-sky-800 font-extrabold' : isDone ? 'text-slate-700' : 'text-slate-400'
                }`}
              >
                {s.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
