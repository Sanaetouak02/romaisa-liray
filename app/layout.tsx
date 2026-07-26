import type { Metadata } from 'next'
import './globals.css'
import Header from '../components/Header'
import logoMark from '../images/Logo.svg'

export const metadata: Metadata = {
  title: 'EURL Romaisa Liray | Assainissement et Hydraulique',
  description: 'Site vitrine pour une entreprise d\'assainissement et d\'hydraulique.',
  icons: {
    icon: logoMark,
    shortcut: logoMark,
    apple: logoMark,
  },
  openGraph: {
    title: 'EURL Romaisa Liray | Assainissement et Hydraulique',
    description: 'Site vitrine pour une entreprise d\'assainissement et d\'hydraulique.',
    type: 'website',
    url: 'https://romaisa-liray-eta.vercel.app',
    images: logoMark,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EURL Romaisa Liray | Assainissement et Hydraulique',
    description: 'Site vitrine pour une entreprise d\'assainissement et d\'hydraulique.',
    images: [logoMark],
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
