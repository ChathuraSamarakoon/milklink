import { Icon } from '../../auth/components/AuthUI';

interface ReservationNoticeProps {
  litres: number;
  farmerName: string;
  quoteValidUntil?: string;
  className?: string;
}

export default function ReservationNotice({
  litres,
  farmerName,
  quoteValidUntil = '15 minutes',
  className = '',
}: ReservationNoticeProps) {
  return (
    <div className={`bg-sky-50/80 border border-sky-200/90 rounded-2xl p-3.5 space-y-2 text-xs text-sky-950 ${className}`}>
      <div className="flex items-start gap-2.5">
        <div className="p-1.5 bg-sky-100 rounded-lg text-sky-700 shrink-0 mt-0.5">
          <Icon name="shield" size={17} />
        </div>
        <div>
          <h4 className="font-extrabold text-sky-950 text-xs">
            Atomic Server Reservation Guarantee
          </h4>
          <p className="text-[11px] text-sky-900 mt-0.5 leading-snug">
            When you submit, <strong>{litres} Litres</strong> will be atomically reserved on the server from {farmerName}&apos;s live inventory for <strong>{quoteValidUntil}</strong>. This locks your order and prevents double-booking.
          </p>
        </div>
      </div>

      <div className="pt-1.5 border-t border-sky-200/70 flex items-center justify-between text-[10px] text-sky-800">
        <span className="flex items-center gap-1">
          <span className="text-emerald-600 font-bold">✓</span> Stale availability rejected automatically
        </span>
        <span className="font-semibold">Lock Active</span>
      </div>
    </div>
  );
}
