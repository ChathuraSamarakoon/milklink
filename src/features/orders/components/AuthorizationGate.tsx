import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface PickupInfo {
  farmName: string;
  village: string;
  district: string;
  supplyWindow: string;
  exactAddress?: string;
  farmerPhone?: string;
}

interface AuthorizationGateProps {
  isAuthorized: boolean;
  onToggleAuthorize: (authorized: boolean) => void;
  orderId: string;
  pickupInfo: PickupInfo;
  children: ReactNode;
  className?: string;
}

export default function AuthorizationGate({
  isAuthorized,
  onToggleAuthorize,
  orderId,
  pickupInfo,
  children,
  className = '',
}: AuthorizationGateProps) {
  const navigate = useNavigate();

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Policy Simulator Header Bar */}
      <div className="bg-slate-900 text-white p-3 rounded-2xl flex items-center justify-between text-xs shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-base">⚖️</span>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
              Governance Gate [DECIDE]
            </span>
            <span className="font-extrabold text-xs">
              Buyer Collection Entry RBAC
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onToggleAuthorize(!isAuthorized)}
          className={`px-3 py-1 rounded-xl text-[11px] font-black transition ${
            isAuthorized
              ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
              : 'bg-amber-400 text-slate-950 hover:bg-amber-300'
          }`}
          title="Click to toggle Project Owner Decision for testing both states"
        >
          {isAuthorized ? '✓ Permission Granted' : '🔒 Permission Pending'}
        </button>
      </div>

      {isAuthorized ? (
        /* State 1: Authorized (Active Child Form) */
        <div className="space-y-4">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-start gap-2.5">
            <span className="text-base text-emerald-700">✓</span>
            <div>
              <p className="font-extrabold text-[11px] text-emerald-900">
                Buyer Acting as Collector: Authorization Granted
              </p>
              <p className="text-[10px] text-emerald-800 leading-snug mt-0.5">
                The project owner policy permits authorized buyers to measure and record actual collection litres directly at the farm gate.
              </p>
            </div>
          </div>

          {children}
        </div>
      ) : (
        /* State 2: Decision Pending / Unauthorized (Feature 01 & 03 Constraint) */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 space-y-4 text-xs">
          {/* Warning Banner */}
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 space-y-1.5 text-amber-950">
            <div className="flex items-center gap-2">
              <span className="text-base">⚠️</span>
              <h4 className="font-black text-xs text-amber-950 uppercase tracking-wide">
                Decision Required: Self-Pickup Collection Permission
              </h4>
            </div>
            <p className="text-[11px] text-amber-900 leading-relaxed">
              <strong>Do not activate this permission until the project owner agrees on authorization and workflow.</strong>
            </p>
            <p className="text-[10px] text-amber-800 leading-snug">
              To prevent inventory disputes, yield measurement at farm gate is restricted by default to certified collectors. Until policy approval, collection recording is locked.
            </p>
          </div>

          {/* Pickup Information Display */}
          <div className="space-y-2 pt-1 border-t border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Farm Pickup Information
            </span>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">
                    {pickupInfo.farmName}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {pickupInfo.exactAddress || `${pickupInfo.village}, ${pickupInfo.district}`}
                  </p>
                </div>
                {pickupInfo.farmerPhone && (
                  <a
                    href={`tel:${pickupInfo.farmerPhone}`}
                    className="px-2.5 py-1 bg-white text-sky-700 border border-sky-200 rounded-lg text-[10px] font-bold"
                  >
                    📞 Call Farm
                  </a>
                )}
              </div>

              <div className="flex justify-between items-center text-[11px] pt-1 border-t border-slate-200/60">
                <span className="text-slate-500">Designated Supply Window:</span>
                <span className="font-extrabold text-slate-800">{pickupInfo.supplyWindow}</span>
              </div>
            </div>
          </div>

          {/* Fallback Action: Assign Collector */}
          <div className="p-3.5 bg-sky-50 border border-sky-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-base">🚚</span>
              <div>
                <h5 className="font-extrabold text-xs text-sky-950">
                  Recommended Workflow: Assign Certified Collector
                </h5>
                <p className="text-[10px] text-sky-800 mt-0.5 leading-snug">
                  Choose a certified transporter with calibrated measurement tanks and refrigerated cold-chain transit.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate(`/buyer/orders/${orderId}/assign-collector`)}
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-extrabold rounded-lg text-xs transition shadow-xs"
            >
              Assign Certified Collector →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
