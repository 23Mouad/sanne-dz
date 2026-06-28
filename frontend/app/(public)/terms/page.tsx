import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Conditions d\'utilisation & Politique de confidentialité | Sanne DZ',
  description: 'Conditions générales d\'utilisation, politique de confidentialité et règles partenaires de Sanne DZ.',
}

const sections = [
  {
    id: 'cgu',
    title: '1. Conditions Générales d\'Utilisation',
    content: `Sanne DZ est une marketplace numérique qui permet aux clients de trouver des professionnels locaux en Algérie. En utilisant notre plateforme, vous acceptez les présentes conditions.

**Accès à la plateforme :** L'accès est libre pour les clients. Les partenaires doivent créer un compte validé. L'utilisation de fausses informations entraîne la suspension immédiate du compte.

**Propriété intellectuelle :** Tout le contenu de Sanne DZ (logos, design, textes) est protégé. Les partenaires conservent la propriété de leurs photos et contenus uploadés.

**Responsabilité :** Sanne DZ est un intermédiaire. Nous ne sommes pas responsables des transactions entre clients et partenaires. Les partenaires sont responsables de leurs services.`,
  },
  {
    id: 'confidentialite',
    title: '2. Politique de Confidentialité',
    content: `Nous collectons uniquement les données nécessaires au fonctionnement de la plateforme : nom, email, téléphone, wilaya. Ces données ne sont jamais vendues à des tiers.

**Utilisation des données :** Notifications pertinentes, amélioration de la plateforme, campagnes marketing ciblées avec votre consentement.

**Vos droits :** Vous pouvez demander l'accès, la modification ou la suppression de vos données à tout moment via contact@sannedz.com.

**Cookies :** Nous utilisons des cookies techniques pour le fonctionnement et des cookies analytiques anonymes pour améliorer l'expérience.`,
  },
  {
    id: 'partenaires',
    title: '3. Règles Partenaires',
    content: `**Contenu autorisé :** Photos réelles de votre travail uniquement. Informations exactes sur vos services et tarifs. Comportement professionnel avec les clients.

**Contenu interdit :** Photos copiées ou trompeuses. Fausses informations ou faux avis. Profils dupliqués. Spam ou sollicitation abusive.

**Modération :** Sanne DZ se réserve le droit de suspendre ou supprimer tout profil ne respectant pas ces règles, sans préavis. Les violations graves sont signalées aux autorités compétentes.`,
  },
  {
    id: 'abonnements',
    title: '4. Abonnements & Facturation',
    content: `**Plan Simple :** Gratuit au lancement. Accès aux fonctionnalités de base : profil, 3 photos, apparition dans la recherche.

**Plan Pro :** Tarif mensuel ou annuel (remise de 20% sur l'abonnement annuel). Fonctionnalités avancées : photos illimitées, vidéos, statistiques, badge Premium, priorité dans les résultats.

**Renouvellement :** Les abonnements se renouvellent automatiquement. Vous pouvez annuler à tout moment depuis votre dashboard.

**Remboursement :** Pas de remboursement pour les périodes déjà consommées. En cas de bug technique avéré, contactez-nous.`,
  },
  {
    id: 'avis',
    title: '5. Politique des Avis',
    content: `**Authenticité :** Les avis doivent refléter une expérience réelle avec le partenaire. Les faux avis sont supprimés et les comptes concernés suspendus.

**Modération :** Un filtre automatique détecte les mots inappropriés en français, arabe et darija. Les avis signalés sont examinés sous 48h.

**Modification :** Les auteurs peuvent modifier ou supprimer leurs avis. Un seul avis par utilisateur par partenaire.`,
  },
  {
    id: 'litige',
    title: '6. Litiges & Droit Applicable',
    content: `En cas de litige, nous encourageons la résolution amiable. Contactez-nous à contact@sannedz.com. Les présentes conditions sont soumises au droit algérien. Tout litige relève de la compétence des tribunaux algériens.

**Modifications :** Sanne DZ se réserve le droit de modifier ces conditions. Les utilisateurs seront informés par email et notification push.`,
  },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/40 to-white">

      {/* Hero */}
      <div className="gradient-bg py-14">
        <div className="container-main text-center">
          <h1 className="text-4xl font-bold text-white mb-3">Conditions & Politique</h1>
          <p className="text-white/80">Dernière mise à jour : Janvier 2025</p>
        </div>
      </div>

      <div className="container-main py-12">
        <div className="max-w-4xl mx-auto">

          {/* Quick Nav */}
          <div className="card p-5 mb-10">
            <p className="text-sm font-semibold text-gray-700 mb-3">Navigation rapide</p>
            <div className="flex flex-wrap gap-2">
              {sections.map(s => (
                <a key={s.id} href={`#${s.id}`}
                   className="tag text-xs hover:bg-[#C2517A] hover:text-white transition-colors">
                  {s.title.split('.')[0]}. {s.title.split('.')[1]?.trim().slice(0, 20)}...
                </a>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            {sections.map(s => (
              <div key={s.id} id={s.id} className="card p-6 sm:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C2517A] to-[#7F77DD]
                                   flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {s.title.split('.')[0]}
                  </span>
                  {s.title.split('.').slice(1).join('.').trim()}
                </h2>
                <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed space-y-3">
                  {s.content.split('\n\n').map((para, i) => (
                    <p key={i} className="text-gray-600 leading-relaxed">
                      {para.startsWith('**') ? (
                        <>
                          <strong className="text-gray-800 font-semibold">
                            {para.split('**')[1]}
                          </strong>
                          {' '}{para.split('**').slice(2).join('').replace(/^\s*:\s*/, ': ')}
                        </>
                      ) : para}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="mt-10 p-5 bg-pink-50 rounded-2xl border border-pink-100 text-center">
            <p className="text-sm text-gray-600">
              Des questions sur nos conditions ?{' '}
              <a href="/contact" className="text-[#C2517A] hover:underline font-medium">
                Contactez-nous
              </a>
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}