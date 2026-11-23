interface RadiusSelectorProps {
  value: number;
  onChange: (radius: number) => void;
  options?: number[];
  disabled?: boolean;
}

export default function RadiusSelector({
  value,
  onChange,
  options = [5, 10, 15, 25, 50],
  disabled = false,
}: RadiusSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
        <span>Search Radius:</span>
        <span className="text-sky-700 font-extrabold bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
          Within {value} km
        </span>
      </div>

      <div className="grid grid-cols-5 gap-1.5">
        {options.map((rad) => {
          const isSelected = value === rad;
          return (
            <button
              key={rad}
              type="button"
              disabled={disabled}
              onClick={() => onChange(rad)}
              className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all ${
                isSelected
                  ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/30 scale-[1.02]'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {rad} km
            </button>
          );
        })}
      </div>

      <p className="text-[11px] text-slate-400">
        Expands search to dairy farms and collection routes within {value} kilometers of your delivery area.
      </p>
    </div>
  );
}
