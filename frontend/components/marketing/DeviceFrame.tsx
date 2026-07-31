import { ReactNode } from 'react';

interface DeviceFrameProps {
  children?: ReactNode;
  variant?: 'browser' | 'macbook';
}

export function DeviceFrame({ variant = 'browser' }: DeviceFrameProps) {
  if (variant === 'macbook') {
    return (
      <div className="flex justify-center my-12 lg:my-16">
        <div className="w-full max-w-3xl">
          {/* MacBook Bezel */}
          <div className="bg-black rounded-lg pt-2 px-2" style={{ borderRadius: '20px 20px 0 0' }}>
            {/* Notch */}
            <div className="flex justify-center mb-2">
              <div className="w-32 h-6 bg-black rounded-md" />
            </div>
            {/* Screen */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-lg aspect-video border border-slate-700 flex items-center justify-center">
              <div className="text-center text-slate-400 text-sm">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                QRS Quantitative Risk Terminal
                <div className="text-xs mt-2 text-slate-500">Real dashboard screenshot will appear here</div>
              </div>
            </div>
          </div>
          {/* MacBook Base */}
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 h-3" style={{ borderRadius: '0 0 20px 20px' }} />
        </div>
      </div>
    );
  }

  // Browser variant (default)
  return (
    <div className="flex justify-center my-12 lg:my-16">
      <div className="w-full max-w-3xl">
        {/* Browser Chrome */}
        <div className="bg-slate-700 rounded-lg p-3 flex items-center gap-2" style={{ borderRadius: '8px 8px 0 0' }}>
          {/* Traffic Lights */}
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-pill bg-red-500" />
            <div className="w-3 h-3 rounded-pill bg-yellow-500" />
            <div className="w-3 h-3 rounded-pill bg-green-500" />
          </div>
          {/* Address Bar */}
          <div className="flex-1 bg-slate-600 rounded-md px-3 py-1 text-slate-300 text-xs ml-4">
            app.qrsrisk.com
          </div>
        </div>
        {/* Screen Content */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-800 aspect-video flex items-center justify-center border-x border-slate-700">
          <div className="text-center text-slate-400 text-sm">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            QRS Quantitative Risk Terminal
            <div className="text-xs mt-2 text-slate-500">Real dashboard screenshot will appear here</div>
          </div>
        </div>
        {/* Browser Bottom */}
        <div className="bg-slate-700 h-1" style={{ borderRadius: '0 0 8px 8px' }} />
      </div>
    </div>
  );
}
