import { Icon } from '../../auth/components/AuthUI';

interface OnlineRequiredNoticeProps {
  isOnline: boolean;
}

export default function OnlineRequiredNotice({ isOnline }: OnlineRequiredNoticeProps) {
  if (isOnline) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 mb-3 text-amber-900 flex items-start gap-3 shadow-xs">
      <div className="p-1.5 bg-amber-100 rounded-full text-amber-700 shrink-0 mt-0.5">
        <Icon name="wifi-off" size={18} />
      </div>
      <div>
        <h4 className="text-xs font-bold text-amber-900">Internet connection required</h4>
        <p className="text-[11px] text-amber-800 mt-0.5 leading-snug">
          Searching nearby dairy farmers and live milk inventory requires an active internet connection. Please reconnect your device to view real-time supplies.
        </p>
      </div>
    </div>
  );
}
