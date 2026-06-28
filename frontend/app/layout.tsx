import type { Metadata } from 'next'
import { Inter, Cairo, Geist } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import { cn } from "@/lib/utils";
import LangProvider from '@/components/layout/LangProvider'

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


// ===== الخطوط =====
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
})

// ===== SEO Metadata =====
export const metadata: Metadata = {
  title: {
    default: 'Sanne DZ — Marketplace Algérienne',
    template: '%s | Sanne DZ',
  },
  description:
    'Trouvez les meilleurs professionnels dans toutes les wilayas d\'Algérie. Ateliers de couture, merceries, tissus et plus encore.',
  keywords: [
    'algérie', 'marketplace', 'professionnels', 'wilayas',
    'couture', 'mercerie', 'tissus', 'sanne dz',
  ],
  authors: [{ name: 'Sanne DZ' }],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: 'Sanne DZ — Marketplace Algérienne',
    description: 'La marketplace de référence pour tous les professionnels d\'Algérie',
    locale: 'fr_DZ',
    type: 'website',
    siteName: 'Sanne DZ',
  },
  robots: {
    index: true,
    follow: true,
  },
}

// ===== Root Layout =====
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="fr"
      className={cn(inter.variable, cairo.variable, "font-sans", geist.variable)}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className="font-sans" suppressHydrationWarning>
        <LangProvider>
          {children}
          <Toaster
            position="bottom-center"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: '12px',
                background: '#1f2937',
                color: '#fff',
                fontSize: '14px',
              },
              success: {
                iconTheme: { primary: '#C2517A', secondary: '#fff' },
              },
            }}
          />
        </LangProvider>
      </body>
    </html>
  )
}