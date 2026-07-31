import Image from 'next/image';
import { Button } from '@/components/ui/Button';

interface HeroDeviceFrameProps {
  imageSrc: string;
  imageAlt: string;
}

export function HeroDeviceFrame({ imageSrc, imageAlt }: HeroDeviceFrameProps) {
  return (
    <section className="bg-gradient-to-b from-ink-800 to-ink-900 py-space-20 lg:py-space-32 px-6 relative overflow-hidden">
      {/* Gradient background accent */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(20, 184, 166, 0.1) 0%, transparent 50%)',
      }} />

      <div className="max-w-screen-xl mx-auto relative z-10">
        {/* Content Grid: Device + Copy */}
        <div className="grid lg:grid-cols-2 gap-space-16 lg:gap-space-20 items-center">
          {/* Device Frame */}
          <div className="flex justify-center lg:justify-start order-2 lg:order-1">
            <div className="w-full max-w-xl rounded-2xl shadow-2xl bg-ink-700 border border-teal-600/30 overflow-hidden transform hover:scale-105 transition-transform duration-300">
              {/* Macbook-style top bar */}
              <div className="bg-gradient-to-r from-ink-900 to-ink-800 h-8 flex items-center px-4 border-b border-teal-700/20">
                <div className="flex gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm" />
                  <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm" />
                </div>
              </div>

              {/* Screenshot content - using SVG placeholder */}
              <div className="relative w-full bg-ink-800" style={{ aspectRatio: '16 / 10' }}>
                <Image
                  src="/hero-placeholder.svg"
                  alt={imageAlt}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                />
              </div>
            </div>
          </div>

          {/* Hero Copy */}
          <div className="text-center lg:text-left order-1 lg:order-2">
            <div className="mb-space-4">
              <span className="inline-block px-space-3 py-space-1 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-sm font-semibold uppercase tracking-wider">
                Enterprise Risk Analytics
              </span>
            </div>

            <h1 className="font-display text-5xl lg:text-7xl font-bold text-white mb-space-6 leading-tight tracking-tight">
              Quantitative Risk Systems
            </h1>

            <p className="text-lg lg:text-xl text-cream-100 mb-space-10 leading-relaxed max-w-xl">
              Every number cryptographically signed and independently verifiable. Built for institutional trust.
            </p>

            {/* CTAs */}
            <div className="flex gap-space-4 justify-center lg:justify-start flex-wrap">
              <Button variant="primary">Request Demo</Button>
              <Button variant="secondary">Request Validation Report</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
