import type { Metadata } from 'next'
import ContactClient from './ContactClient'

export const metadata: Metadata = {
  title: 'Contactez-nous | Sanne DZ',
  description: 'Notre équipe vous répond sous 24h ouvrables.',
}

export default function ContactPage() {
  return <ContactClient />
}