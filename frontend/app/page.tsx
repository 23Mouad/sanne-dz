import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/home/HeroSection'
import CategoriesGrid from '@/components/home/CategoriesGrid'
import FeaturedPartners from '@/components/home/FeaturedPartners'
import HowItWorks from '@/components/home/HowItWorks'
import WilayasSection from '@/components/home/WilayasSection'
import CallToAction from '@/components/home/CallToAction'

export const metadata: Metadata = {
  title: 'Sanne DZ — Marketplace Algérienne | Trouvez vos professionnels locaux',
  description: 'Trouvez les meilleurs professionnels dans toutes les wilayas d\'Algérie. Ateliers de couture, modélistes, merceries et plus encore sur Sanne DZ.',
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <CategoriesGrid />
        <FeaturedPartners />
        <HowItWorks />
        <WilayasSection />
        <CallToAction />
      </main>
      <Footer />
    </>
  )
}