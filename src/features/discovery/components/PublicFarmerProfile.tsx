import { Icon } from '../../auth/components/AuthUI';
import type { PublicFarmerDetail } from '../../../services/farmersApi';

interface PublicFarmerProfileProps {
  farmer: PublicFarmerDetail;
}

export default function PublicFarmerProfile({ farmer }: PublicFarmerProfileProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden space-y-4">
      {/* Farm Cover & Identity Banner */}
      <div className="relative h-44 bg-slate-900">
        <img
          src={farmer.image}
          alt={farmer.farmName}
          className="w-full h-full object-cover opacity-85"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/welcome-pasture.webp';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        <div className="absolute bottom-3 left-3 right-3 text-white flex items-end justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-lg font-black tracking-tight">{farmer.farmName}</h2>
              {farmer.verified && (
                <span className="bg-sky-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                  ✓ Verified
                </span>
              )}
            </div>
            <p className="text-xs text-slate-200 mt-0.5">
              Managed by {farmer.ownerName} • {farmer.village}, {farmer.district}
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1">
              <span className="text-amber-400">★</span> {farmer.rating.toFixed(1)} ({farmer.reviewsCount})
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 pt-0 space-y-3.5">
        {/* 03: Pre-Acceptance Location Privacy Notice (Enforced at API Level) */}
        <div className="p-3 bg-sky-50/80 border border-sky-100 rounded-xl flex items-start gap-2.5 text-xs text-sky-950">
          <div className="p-1.5 bg-sky-100 rounded-lg text-sky-700 shrink-0 mt-0.5">
            <Icon name="shield" size={16} />
          </div>
          <div>
            <span className="font-extrabold block text-sky-900">
              Pre-Acceptance Privacy Protection (~1 km radius)
            </span>
            <p className="text-[11px] text-sky-800 mt-0.5 leading-snug">
              Farm location is shown as approximate (~{farmer.distanceKm.toFixed(1)} km from your area). Exact GPS coordinates and farm contact are released automatically once your order is accepted by {farmer.ownerName}.
            </p>
          </div>
        </div>

        {/* Farm Credentials & Herd Details Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Cattle Breed</span>
            <span className="font-bold text-slate-800">{farmer.cattleBreed}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">{farmer.cattleCount} Milking Cattle</span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Experience</span>
            <span className="font-bold text-slate-800">{farmer.yearsOperating} Years Operating</span>
            <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">Registered Producer</span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Cold-Chain Storage</span>
            <span className="font-bold text-slate-800">Chilled at 4°C</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Bulk chiller equipped</span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Inspection Status</span>
            <span className="font-bold text-emerald-800">Passed</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Audited {farmer.inspectionPassedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
