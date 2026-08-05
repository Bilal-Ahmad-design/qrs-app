interface DeviceFrameProps {
  imageSrc?: string;
  imageAlt?: string;
}

export function DeviceFrame({ imageSrc, imageAlt }: DeviceFrameProps) {
  return (
    <div className="flex justify-center my-12 lg:my-16 px-4">
      <div className="w-full max-w-4xl rounded-3xl shadow-2xl bg-gray-800 border-8 border-gray-900 overflow-hidden">
        {/* MacBook Top Bar - Traffic Lights */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 h-10 flex items-center px-6 border-b border-gray-700">
          <div className="flex gap-3">
            <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm" />
            <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm" />
            <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm" />
          </div>
        </div>

        {/* Screen Display Area */}
        <div className="relative w-full bg-black" style={{ aspectRatio: '16 / 10' }}>
          {imageSrc && imageSrc.startsWith('http') ? (
            <img
              src={imageSrc}
              alt={imageAlt || 'Dashboard screenshot'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
              <div className="text-center text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm">Dashboard screenshot will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
