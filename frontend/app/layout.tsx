import './globals.css'

export const metadata = {
  title: 'QRS - Quantitative Risk Systems',
  description: 'Cryptographically verified catastrophe modeling and risk deployment',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'QRS - Quantitative Risk Systems',
    description: 'Cryptographically verified catastrophe modeling and risk deployment',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/favicon.svg" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
