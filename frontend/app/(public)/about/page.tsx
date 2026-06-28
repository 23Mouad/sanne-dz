import type { Metadata } from 'next'
import AboutClient from './AboutClient'

export const metadata: Metadata = {
  title: 'À propos de Sanne DZ | Notre mission',
  description: 'Sanne DZ est la marketplace algérienne qui connecte clients et professionnels locaux dans les 69 wilayas d\'Algérie.',
}

export default function AboutPage() {
  return <AboutClient />
}