import { PRESETS } from '../utils/presets.js'
import { IconSparkle } from './Icons.jsx'

export default function PresetChips({ activePreset, onApply }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold text-[var(--text-3)] uppercase tracking-widest pl-1 pr-1">
        <IconSparkle width={11} height={11} />
        Presets
      </span>
      {PRESETS.map((p) => {
        const on = activePreset === p.id
        return (
          <button
            key={p.id}
            onClick={() => onApply(p.id)}
            className={`px-2.5 py-1 rounded-full text-[12px] border transition ${
              on
                ? 'bg-[var(--text)] text-white border-[var(--text)] font-medium'
                : 'bg-white text-[var(--text-2)] border-[var(--border)] hover:border-[var(--text-2)] hover:text-[var(--text)]'
            }`}
          >
            {p.label}
          </button>
        )
      })}
    </div>
  )
}
