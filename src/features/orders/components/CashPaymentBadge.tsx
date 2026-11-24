interface CashPaymentBadgeProps {
  amount: number;
  receiptNumber?: string;
  status?: 'recorded_cash' | 'pending_settlement';
  showDetails?: boolean;
  className?: string;
}

export default function CashPaymentBadge({
  amount,
  receiptNumber,
  status = 'recorded_cash',
  showDetails = true,
  className = '',
}: CashPaymentBadgeProps) {
  const isSettled = status === 'recorded_cash';

  return (
    <div className={`inline-flex flex-col gap-0.5 text-xs ${className}`}>
      <div className="flex items-center gap-1.5">
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-black border flex items-center gap-1 ${
            isSettled
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : 'bg-amber-50 text-amber-900 border-amber-300'
          }`}
          title="MilkLink utilizes a physical cash settlement protocol at farm-gate collection"
        >
          <span>💵</span>
          <span>{isSettled ? 'Recorded Farm Cash' : 'Cash Due on Handover'}</span>
        </span>

        {receiptNumber && (
          <span className="font-mono text-[10px] text-slate-500 font-bold bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
            {receiptNumber}
          </span>
        )}
      </div>

      {showDetails && (
        <span className="text-[10px] text-slate-400">
          Handover: <strong>Rs. {amount.toLocaleString()}</strong> (Direct settlement, 0% gateway fee)
        </span>
      )}
    </div>
  );
}
