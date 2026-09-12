import { Button } from '@/components/ui/Button';

interface HeroDeviceFrameProps {
  videoSrc?: string;
  posterSrc?: string;
  imageAlt?: string;
}

export function HeroDeviceFrame({ videoSrc, posterSrc, imageAlt }: HeroDeviceFrameProps) {
  return (
    <section className="bg-gradient-to-b from-white via-slate-50 to-slate-100 py-20 lg:py-32 px-6 relative overflow-hidden">
      {/* Premium light mirror background effect */}
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: 'radial-gradient(circle at 20% 40%, rgba(91, 186, 181, 0.08) 0%, transparent 50%)',
      }} />

      {/* Subtle glass reflection effect */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, transparent 50%)',
        pointerEvents: 'none',
      }} />

      <div className="max-w-screen-xl mx-auto relative z-10">
        {/* Content Grid: Device + Copy */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Device Frame */}
          <div className="flex justify-center lg:justify-start order-2 lg:order-1">
            <div className="w-full max-w-xl rounded-3xl shadow-lg bg-white border border-slate-200 overflow-hidden transform hover:shadow-2xl transition-shadow duration-300">
              {/* Premium device chrome - MacBook style */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 h-8 flex items-center px-4 border-b border-slate-700">
                <div className="flex gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm" />
                  <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm" />
                </div>
              </div>

              {/* Video/Image content area */}
              <div className="relative w-full bg-slate-900" style={{ aspectRatio: '16 / 10' }}>
                {videoSrc ? (
                  <video
                    src={videoSrc}
                    poster={posterSrc}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : posterSrc ? (
                  <img
                    src={posterSrc}
                    alt={imageAlt || 'QRS Dashboard'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                    <div className="text-slate-400 text-sm">Dashboard Preview</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Hero Copy */}
          <div className="text-center lg:text-left order-1 lg:order-2">
            <div className="mb-4">
              <span className="inline-block px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-700 text-sm font-semibold uppercase tracking-wider">
                Enterprise Risk Analytics
              </span>
            </div>

            <h1 className="font-display text-5xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
              Quantitative Risk Systems
            </h1>

            <p className="text-lg lg:text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
              Every number cryptographically signed and independently verifiable. Built for institutional trust.
            </p>

            {/* CTAs */}
            <div className="flex gap-4 justify-center lg:justify-start flex-wrap">
              <Button variant="primary">Request Demo</Button>
              <Button variant="secondary">Request Validation Report</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
