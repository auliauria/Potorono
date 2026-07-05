'use client'

interface RTFilterProps {
  selected: number | null
  onChange: (rt: number | null) => void
}

export default function RTFilter({ selected, onChange }: RTFilterProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <button
        onClick={() => onChange(null)}
        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
          selected === null
            ? 'bg-[#1B4332] text-white shadow-sm'
            : 'bg-white border border-gray-200 text-gray-500 hover:border-[#1B4332] hover:text-[#1B4332]'
        }`}
      >
        Semua
      </button>
      {Array.from({ length: 9 }, (_, i) => i + 1).map(rt => (
        <button
          key={rt}
          onClick={() => onChange(rt)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            selected === rt
              ? 'bg-[#1B4332] text-white shadow-sm'
              : 'bg-white border border-gray-200 text-gray-500 hover:border-[#1B4332] hover:text-[#1B4332]'
          }`}
        >
          RT {rt}
        </button>
      ))}
    </div>
  )
}