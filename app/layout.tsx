import type { Metadata } from 'next'
import './globals.css'

const logoPath = '/images/Logo.svg'

export const metadata: Metadata = {
  metadataBase: new URL('https://romaisa-liray-eta.vercel.app'),
  title: 'EURL Romaisa Liray | Assainissement et Hydraulique',
  description: 'Site vitrine pour une entreprise d\'assainissement et d\'hydraulique.',
  icons: logoPath,
  openGraph: {
    title: 'EURL Romaisa Liray | Assainissement et Hydraulique',
    description: 'Site vitrine pour une entreprise d\'assainissement et d\'hydraulique.',
    type: 'website',
    url: 'https://romaisa-liray-eta.vercel.app',
    images: [logoPath],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EURL Romaisa Liray | Assainissement et Hydraulique',
    description: 'Site vitrine pour une entreprise d\'assainissement et d\'hydraulique.',
    images: [logoPath],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
       
        <main>{children}</main>
      </body>
    </html>
  )
}
