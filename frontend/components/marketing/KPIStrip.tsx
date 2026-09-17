interface KPIItem {
  label: string;
  value: string;
}

interface KPIStripProps {
  items: KPIItem[];
}

export function KPIStrip({ items }: KPIStripProps) {
  return (
    <div className="bg-ink-700 py-16 lg:py-20 px-6 border-y border-teal-700/40 backdrop-blur-sm">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="group text-center py-6 px-4 rounded-lg transition-all duration-base hover:bg-ink-600/40"
            >
              <p className="font-body text-xs lg:text-small text-teal-700 mb-3 uppercase tracking-widest font-semibold letter-spacing">
                {item.label}
              </p>
              <p className="font-mono text-kpi text-white leading-none tracking-tight transition-all duration-base">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
