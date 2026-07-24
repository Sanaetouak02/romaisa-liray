import type { Metadata } from 'next'
import './globals.css'
import Header from '../components/Header'

export const metadata: Metadata = {
  title: 'EURL Romaisa Liray | Assainissement et Hydraulique',
  description: 'Site vitrine pour une entreprise d\'assainissement et d\'hydraulique.',
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
