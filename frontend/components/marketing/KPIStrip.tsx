interface KPIItem {
  label: string;
  value: string;
}

interface KPIStripProps {
  items: KPIItem[];
}

export function KPIStrip({ items }: KPIStripProps) {
  return (
    <div className="bg-gradient-to-r from-ink-800 via-ink-700 to-ink-800 py-space-16 lg:py-space-20 px-6 border-y border-teal-700/40 backdrop-blur-sm">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-8 lg:gap-space-12">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="group text-center py-space-6 px-space-4 rounded-lg transition-all duration-300 hover:bg-ink-600/40"
            >
              <p className="font-body text-xs lg:text-small text-teal-300 mb-space-3 uppercase tracking-widest font-semibold letter-spacing">
                {item.label}
              </p>
              <p className="font-mono text-4xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-white leading-none tracking-tight group-hover:from-teal-100 group-hover:to-cream-50 transition-all duration-300">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
