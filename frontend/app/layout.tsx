import './globals.css'

export const metadata = {
  title: 'QRS',
  description: 'Quantitative Risk Systems',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
