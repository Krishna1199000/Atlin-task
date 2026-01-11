import type { Metadata } from 'next'
import './globals.css'
import ToasterProvider from '@/components/providers/ToasterProvider'

export const metadata: Metadata = {
  title: 'Private Notes Vault',
  description: 'Your private, secure notes application',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ToasterProvider />
        {children}
      </body>
    </html>
  )
}