'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { 
  Star, CheckCircle, Clock, MapPin, Phone, Truck, 
  Scissors, Package, HelpCircle, ChevronDown, 
  ArrowRight, ZoomIn, X, ChevronLeft, ChevronRight,
  Briefcase, Camera, Info, MessageSquare, Video
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { fr, arDZ } from 'date-fns/locale'
import { getImageUrl } from '@/lib/utils'
import api from '@/lib/api'
import type { Partner } from '@/types'
import PartnerReviews from './PartnerReviews'
import { useT, useLang } from '@/hooks/useT'
import { translations } from '@/lib/i18n/translations'

// ─── Static data per category type ──────────────────────────────────────────

const SERVICES_BY_CATEGORY: Record<string, { fr: string; ar: string }[]> = {
  'ateliers-couture': [
    { fr: 'Couture sur mesure',        ar: 'خياطة على المقاس' },
    { fr: 'Retouches & réparations',   ar: 'تعديلات وإصلاحات' },
    { fr: 'Patronnage',                ar: 'رسم الأنماط' },
    { fr: 'Modélisme',                 ar: 'تصميم الأزياء' },
    { fr: 'Broderie à la main',        ar: 'تطريز يدوي' },
    { fr: 'Robes de mariée',           ar: 'فساتين زفاف' },
    { fr: 'Tenues traditionnelles',    ar: 'أزياء تقليدية' },
  ],
  'modelistes': [
    { fr: 'Création de modèles',       ar: 'تصميم النماذج' },
    { fr: 'Stylisme',                  ar: 'تصميم أزياء' },
    { fr: 'Prototypage',               ar: 'نمذجة' },
    { fr: 'Conseil style',             ar: 'استشارة أسلوب' },
    { fr: 'Croquis & plans',           ar: 'رسومات وخطط' },
  ],
  'patronistes': [
    { fr: 'Création de patrons',       ar: 'إنشاء الأنماط' },
    { fr: 'Gradation',                 ar: 'تدريج المقاسات' },
    { fr: 'Tracé sur mesure',          ar: 'رسم على المقاس' },
    { fr: 'Rectification patron',      ar: 'تصحيح النمط' },
    { fr: 'Patron industriel',         ar: 'نمط صناعي' },
  ],
  'magasins-tissus': [
    { fr: 'Vente au mètre',            ar: 'بيع بالمتر' },
    { fr: 'Vente en gros',             ar: 'بيع بالجملة' },
    { fr: 'Vente au détail',           ar: 'بيع بالتجزئة' },
    { fr: 'Livraison wilaya',          ar: 'توصيل للولاية' },
    { fr: 'Livraison nationale',       ar: 'توصيل وطني' },
  ],
  'merceries': [
    { fr: 'Fils & boutons',            ar: 'خيوط وأزرار' },
    { fr: 'Fermetures éclair',         ar: 'سحابات' },
    { fr: 'Élastiques & rubans',       ar: 'مطاطات وأشرطة' },
    { fr: 'Perles & broderies',        ar: 'خرز وتطريز' },
    { fr: 'Aiguilles & dés',           ar: 'إبر وخواتم' },
    { fr: 'Livraison disponible',      ar: 'التوصيل متاح' },
  ],
  'services-broderie': [
    { fr: 'Broderie traditionnelle',   ar: 'تطريز تقليدي' },
    { fr: 'Broderie industrielle',     ar: 'تطريز صناعي' },
    { fr: 'Broderie sur mesure',       ar: 'تطريز على المقاس' },
    { fr: 'Personnalisation',          ar: 'تخصيص' },
  ],
  'formation-couture': [
    { fr: 'Cours débutant',            ar: 'دورة للمبتدئين' },
    { fr: 'Cours intermédiaire',       ar: 'دورة متوسطة' },
    { fr: 'Cours avancé',              ar: 'دورة متقدمة' },
    { fr: 'Formation accélérée',       ar: 'تكوين مكثف' },
    { fr: 'Certificat de formation',   ar: 'شهادة تكوين' },
  ],
  'location-machines': [
    { fr: "Location à l'heure",        ar: 'إيجار بالساعة' },
    { fr: 'Location journée',          ar: 'إيجار يومي' },
    { fr: 'Formation machine incluse', ar: 'تدريب على الآلة مشمول' },
    { fr: 'Machines industrielles',    ar: 'آلات صناعية' },
    { fr: 'Machines domestiques',      ar: 'آلات منزلية' },
  ],
  'textiles': [
    { fr: 'Fourniture textile',        ar: 'توريد النسيج' },
    { fr: 'Matières premières',        ar: 'مواد أولية' },
    { fr: 'Gros et demi-gros',         ar: 'جملة ونصف جملة' },
  ],
  'studios': [
    { fr: 'Shooting mode',             ar: 'تصوير أزياء' },
    { fr: 'Photographie produit',      ar: 'تصوير المنتجات' },
    { fr: 'Vidéo promotionnelle',      ar: 'فيديو ترويجي' },
    { fr: 'Couverture événements',     ar: 'تغطية الفعاليات' },
  ],
}

const REALIZATIONS_BY_CATEGORY: Record<string, { fr: string; ar: string }[]> = {
  'ateliers-couture': [
    { fr: 'Robes de soirée',           ar: 'فساتين سهرة' },
    { fr: 'Karakou',                   ar: 'قراكو' },
    { fr: 'Caftan',                    ar: 'قفطان' },
    { fr: 'Robes de mariée',           ar: 'فساتين زفاف' },
    { fr: 'Tenues traditionnelles',    ar: 'أزياء تقليدية' },
    { fr: 'Tenues modernes',           ar: 'أزياء عصرية' },
  ],
  'modelistes': [
    { fr: 'Collections prêt-à-porter', ar: 'مجموعات جاهزة' },
    { fr: 'Modèles sur mesure',        ar: 'نماذج على المقاس' },
    { fr: 'Créations uniques',         ar: 'تصاميم فريدة' },
    { fr: 'Prototypes',                ar: 'نماذج أولية' },
  ],
  'patronistes': [
    { fr: 'Patrons femme',             ar: 'أنماط نسائية' },
    { fr: 'Patrons homme',             ar: 'أنماط رجالية' },
    { fr: 'Patrons enfant',            ar: 'أنماط أطفال' },
    { fr: 'Patrons industriels',       ar: 'أنماط صناعية' },
  ],
  'magasins-tissus': [
    { fr: 'Tissus de soirée',          ar: 'أقمشة سهرة' },
    { fr: 'Satin & velours',           ar: 'ساتان ومخمل' },
    { fr: 'Dentelle & organza',        ar: 'دانتيل وأورغانزا' },
    { fr: 'Mousseline',                ar: 'موسلين' },
    { fr: 'Tissus traditionnels',      ar: 'أقمشة تقليدية' },
  ],
  'merceries': [
    { fr: 'Fils à coudre',             ar: 'خيوط خياطة' },
    { fr: 'Fermetures',                ar: 'سحابات' },
    { fr: 'Rubans & broderies',        ar: 'أشرطة وتطريز' },
    { fr: 'Articles de couture',       ar: 'مستلزمات الخياطة' },
  ],
  'services-broderie': [
    { fr: 'Broderie sur velours',      ar: 'تطريز على المخمل' },
    { fr: 'Motifs floraux',            ar: 'زخارف نباتية' },
    { fr: 'Broderie d\'or (Majboud)',  ar: 'مجبود' },
  ],
  'formation-couture': [
    { fr: "Travaux d'apprenantes",     ar: 'أعمال الطالبات' },
    { fr: 'Projets de fin de formation', ar: 'مشاريع التخرج' },
    { fr: 'Créations originales',      ar: 'تصاميم أصيلة' },
  ],
  'location-machines': [
    { fr: 'Machines disponibles',      ar: 'آلات متاحة' },
    { fr: 'Matériel pro',              ar: 'معدات احترافية' },
    { fr: 'Équipements spécialisés',   ar: 'تجهيزات متخصصة' },
  ],
  'textiles': [
    { fr: 'Bobines industrielles',     ar: 'لفات صناعية' },
    { fr: 'Fibres naturelles',         ar: 'ألياف طبيعية' },
  ],
  'studios': [
    { fr: 'Portraits',                 ar: 'صور شخصية' },
    { fr: 'Books photos',              ar: 'ألبومات صور' },
    { fr: 'Catalogues de mode',        ar: 'كتالوجات أزياء' },
  ],
}

const FAQ_BY_CATEGORY: Record<string, { q: { fr: string; ar: string }; a: { fr: string; ar: string } }[]> = {
  'ateliers-couture': [
    { q: { fr: 'Quel est le délai moyen de confection ?', ar: 'ما هو متوسط وقت التصنيع؟' }, a: { fr: 'Le délai varie selon la complexité : 3 à 7 jours pour une retouche, 2 à 4 semaines pour une robe de mariée.', ar: 'يتفاوت الوقت حسب التعقيد: 3 إلى 7 أيام للتعديل، 2 إلى 4 أسابيع لفستان الزفاف.' } },
    { q: { fr: 'Travaillez-vous sur mesure ?', ar: 'هل تعملون على المقاس؟' }, a: { fr: 'Oui, toutes nos créations sont réalisées sur mesure après prise de mensurations.', ar: 'نعم، جميع تصاميمنا تُنجز على المقاس بعد أخذ القياسات.' } },
    { q: { fr: 'Acceptez-vous les commandes à distance ?', ar: 'هل تقبلون الطلبات عن بُعد؟' }, a: { fr: 'Oui, nous acceptons les commandes par WhatsApp avec envoi des mensurations et choix du tissu.', ar: 'نعم، نقبل الطلبات عبر واتساب مع إرسال القياسات واختيار القماش.' } },
    { q: { fr: 'Faites-vous les retouches ?', ar: 'هل تقومون بالتعديلات؟' }, a: { fr: 'Oui, nous proposons des retouches sur tous types de vêtements.', ar: 'نعم، نقدم التعديلات على جميع أنواع الملابس.' } },
    { q: { fr: 'Faut-il un rendez-vous ?', ar: 'هل يلزم حجز موعد؟' }, a: { fr: 'Oui, nous recommandons de prendre rendez-vous pour garantir un meilleur service.', ar: 'نعم، ننصح بحجز موعد لضمان أفضل خدمة.' } },
  ],
  'magasins-tissus': [
    { q: { fr: 'Vendez-vous au mètre ?', ar: 'هل تبيعون بالمتر؟' }, a: { fr: 'Oui, nous vendons à partir de 0,5 mètre.', ar: 'نعم، نبيع ابتداءً من 0.5 متر.' } },
    { q: { fr: 'Faites-vous la livraison ?', ar: 'هل تقومون بالتوصيل؟' }, a: { fr: 'Oui, livraison disponible dans toutes les wilayas.', ar: 'نعم، التوصيل متاح لجميع الولايات.' } },
    { q: { fr: 'Avez-vous des nouveautés régulièrement ?', ar: 'هل لديكم تجديدات منتظمة؟' }, a: { fr: 'Oui, nous recevons des nouvelles collections chaque mois.', ar: 'نعم، نستقبل مجموعات جديدة كل شهر.' } },
  ],
  'formation-couture': [
    { q: { fr: 'Faut-il une expérience préalable ?', ar: 'هل يلزم خبرة مسبقة؟' }, a: { fr: 'Non, nous proposons des formations pour tous les niveaux.', ar: 'لا، نقدم تكويناً لجميع المستويات.' } },
    { q: { fr: 'Délivrez-vous un certificat ?', ar: 'هل تسلمون شهادة؟' }, a: { fr: 'Oui, un certificat de formation est remis à la fin du cursus.', ar: 'نعم، تُسلَّم شهادة تكوين في نهاية الدورة.' } },
    { q: { fr: "Quelle est la durée d'une formation ?", ar: 'ما هي مدة الدورة؟' }, a: { fr: 'Nos formations durent de 1 à 6 mois selon le niveau choisi.', ar: 'تتراوح مدة دوراتنا بين شهر وستة أشهر حسب المستوى.' } },
  ],
  default: [
    { q: { fr: 'Comment vous contacter ?', ar: 'كيف يمكن التواصل معكم؟' }, a: { fr: 'Vous pouvez nous contacter par téléphone ou WhatsApp pour toute demande.', ar: 'يمكنكم التواصل معنا عبر الهاتف أو واتساب لأي استفسار.' } },
    { q: { fr: 'Proposez-vous la livraison ?', ar: 'هل تقدمون خدمة التوصيل؟' }, a: { fr: 'Contactez-nous directement pour connaître les modalités de livraison.', ar: 'تواصلوا معنا مباشرة للاستفسار عن شروط التوصيل.' } },
  ],
}

// ─── Before/After Section ────────────────────────────────────────────────────
function BeforeAfterSection({ photos }: { photos: { id: string; url: string; caption?: string }[] }) {
  const t = useT()
  const d = translations.portfolioTabs
  if (photos.length < 2) return null
  return (
    <div className="card p-5">
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <ArrowRight size={18} className="text-[#C2517A]" />
        {t(d.beforeAfter)}
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">{t(d.before)}</p>
          <div className="relative aspect-square rounded-xl overflow-hidden">
            <img src={getImageUrl(photos[0].url)} alt={t(d.before)} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <span className="text-white font-bold text-lg bg-black/40 px-3 py-1 rounded-lg">{t(d.before)}</span>
            </div>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-[#C2517A] mb-2 uppercase tracking-wide">{t(d.after)}</p>
          <div className="relative aspect-square rounded-xl overflow-hidden ring-2 ring-[#C2517A]">
            <img src={getImageUrl(photos[1].url)} alt={t(d.after)} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-[#C2517A]/10 flex items-center justify-center">
              <span className="text-white font-bold text-lg bg-[#C2517A]/70 px-3 py-1 rounded-lg">{t(d.after)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Lightbox ────────────────────────────────────────────────────────────────
function Lightbox({ photos, index, onClose }: { photos: { url: string; caption?: string }[]; index: number; onClose: () => void }) {
  const [current, setCurrent] = useState(index)
  const prev = () => setCurrent(i => (i - 1 + photos.length) % photos.length)
  const next = () => setCurrent(i => (i + 1) % photos.length)
  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={onClose}>
      <button onClick={e => { e.stopPropagation(); onClose() }} className="absolute top-4 right-4 text-white/70 hover:text-white z-10">
        <X size={28} />
      </button>
      <button onClick={e => { e.stopPropagation(); prev() }} className="absolute left-4 text-white/70 hover:text-white z-10 p-2 hover:bg-white/10 rounded-full">
        <ChevronLeft size={32} />
      </button>
      <button onClick={e => { e.stopPropagation(); next() }} className="absolute right-4 text-white/70 hover:text-white z-10 p-2 hover:bg-white/10 rounded-full">
        <ChevronRight size={32} />
      </button>
      <div className="relative w-full max-w-4xl max-h-[90vh] aspect-video px-16" onClick={e => e.stopPropagation()}>
        <img src={getImageUrl(photos[current].url)} alt={photos[current].caption || ''} className="absolute inset-0 w-full h-full object-contain" />
      </div>
      {photos[current].caption && (
        <p className="absolute bottom-8 text-white/80 text-sm">{photos[current].caption}</p>
      )}
    </div>
  )
}

// ─── FAQ Section ─────────────────────────────────────────────────────────────
function FAQSection({ categorySlug }: { categorySlug: string }) {
  const t = useT()
  const lang = useLang()
  const d = translations.portfolioTabs
  const [open, setOpen] = useState<number | null>(null)
  const faqs = FAQ_BY_CATEGORY[categorySlug] ?? FAQ_BY_CATEGORY['default']
  return (
    <div className="card p-5">
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <HelpCircle size={18} className="text-[#C2517A]" />
        {t(d.faqTitle)}
      </h3>
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-pink-100 rounded-xl overflow-hidden">
            <button
              className="w-full flex items-center justify-between p-4 text-left rtl:text-right hover:bg-pink-50/50 transition-colors"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span className="text-sm font-semibold text-gray-800 pr-4 rtl:pl-4 rtl:pr-0">{faq.q[lang]}</span>
              <ChevronDown size={16} className={`text-[#C2517A] shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} />
            </button>
            {open === i && (
              <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-pink-50">
                <p className="pt-3">{faq.a[lang]}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

import { useSearchParams } from 'next/navigation'

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PortfolioTabs({ partner }: { partner: Partner }) {
  const t = useT()
  const lang = useLang()
  const d = translations.portfolioTabs
  const searchParams = useSearchParams()

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'realisations')
  const [lightbox, setLightbox] = useState<number | null>(null)

  const handleWhatsappClick = () => {
    if (partner?.id) {
      api.post(`/partners/${partner.id}/whatsapp-click`).catch(() => {})
    }
  }

  const slug = partner.categories?.[0]?.category?.slug ?? partner.category?.slug ?? 'ateliers-couture'
  // Use partner's own data; show null (empty state) if they haven't set any
  const services = Array.isArray(partner.services) && partner.services.length > 0 ? partner.services : null
  const realizations = Array.isArray(partner.achievements) && partner.achievements.length > 0 ? partner.achievements : null
  // Guard photos and products to always be arrays
  const photos = Array.isArray(partner.photos) ? partner.photos : []
  const videos = Array.isArray(partner.videos) ? partner.videos : []
  const products = Array.isArray(partner.products) ? partner.products : []

  const DAY_KEYS: Record<string, keyof typeof d> = {
    monday: 'monday', tuesday: 'tuesday', wednesday: 'wednesday',
    thursday: 'thursday', friday: 'friday', saturday: 'saturday', sunday: 'sunday',
  }
  const [today, setToday] = useState<string>('')
  useEffect(() => {
    setToday(new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase())
  }, [])

  const TABS = [
    { id: 'realisations', label: t(d.tabRealisations), icon: Camera },
    { id: 'produits',     label: lang === 'ar' ? 'المنتجات' : 'Produits', icon: Package },
    { id: 'services',     label: t(d.tabServices),     icon: Briefcase },
    { id: 'infos',        label: t(d.tabInfos),         icon: Info },
    { id: 'avis',         label: t(d.tabAvis),          icon: MessageSquare },
  ]

  return (
    <div>
      {/* ─── Tabs ─── */}
      <div className="flex gap-1 bg-gray-100/70 p-1 rounded-2xl mb-6 overflow-x-auto">
        {TABS.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 flex-1 justify-center
                ${activeTab === tab.id
                  ? 'bg-white text-[#C2517A] shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* ─── TAB: Réalisations ─── */}
      {activeTab === 'realisations' && (
        <div className="space-y-6">
          <div className="card p-5">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Scissors size={17} className="text-[#C2517A]" />
              {t(d.realizTitle)}
            </h3>
            {realizations ? (
              <div className="flex flex-wrap gap-2">
                {realizations.map((r, i) => (
                  <span key={i} className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 text-[#C2517A] text-sm px-3 py-1.5 rounded-full font-medium">
                    {r}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic py-2">Ce partenaire n&apos;a pas encore renseigné ses réalisations.</p>
            )}
          </div>

          {videos.length > 0 && (
            <div className="card p-5">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Video size={17} className="text-[#C2517A]" />
                Vidéo
              </h3>
              <div className={`grid gap-4 ${videos.length === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
                {videos.map((video, i) => (
                  <div key={video.id} className="relative aspect-video rounded-xl overflow-hidden bg-black shadow-sm">
                    <video
                      src={getImageUrl(video.url)}
                      controls
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {photos.length > 0 && (
            <div className="card p-5">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Camera size={17} className="text-[#C2517A]" />
                {t(d.galleryTitle)}
              </h3>
              <div className={`grid gap-2 ${photos.length === 1 ? 'grid-cols-1' : photos.length === 2 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'}`}>
                {photos.map((photo, i) => (
                  <button
                    key={photo.id}
                    onClick={() => setLightbox(i)}
                    className="relative aspect-square rounded-xl overflow-hidden group"
                  >
                    <img
                      src={getImageUrl(photo.url)}
                      alt={photo.caption || `Photo ${i + 1}`}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <ZoomIn size={22} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    {photo.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 px-2 py-2">
                        <p className="text-white text-xs truncate">{photo.caption}</p>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* <BeforeAfterSection photos={photos} /> */}
          <FAQSection categorySlug={slug} />
        </div>
      )}

      {/* ─── TAB: Produits ─── */}
      {activeTab === 'produits' && (
        <div className="space-y-6">
          <div className="card p-5 bg-gradient-to-br from-pink-50 to-white">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Package size={17} className="text-[#C2517A]" />
              {lang === 'ar' ? 'منتجاتنا وخدماتنا' : 'Nos Produits & Services'}
            </h3>
            
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {products.map(product => {
                  const message = encodeURIComponent(`Bonjour, je souhaite commander: ${product.name || 'Produit sans nom'}${product.price ? ` (${product.price} DA)` : ''}`);
                  const waLink = `https://wa.me/${partner.whatsapp.replace(/[^0-9]/g, '')}?text=${message}`;
                  
                  return (
                    <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-all">
                      {/* Image */}
                      {product.imageUrl && (
                        <div className="aspect-video bg-gray-50 relative">
                          <Image 
                            src={getImageUrl(product.imageUrl)} 
                            alt={product.name || 'Produit'}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      )}
                      
                      {/* Content */}
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-gray-900 line-clamp-1">{product.name || <span className="text-gray-400 italic">Sans nom</span>}</h4>
                          {product.price && (
                            <div className="text-right rtl:text-left shrink-0 ml-2 rtl:ml-0 rtl:mr-2">
                              {product.promoPrice ? (
                                <div>
                                  <p className="font-bold text-[#C2517A] text-sm" dir="ltr">{product.promoPrice.toLocaleString('fr-DZ')} DA</p>
                                  <p className="text-xs text-gray-400 line-through" dir="ltr">{product.price.toLocaleString('fr-DZ')} DA</p>
                                </div>
                              ) : (
                                <p className="font-bold text-gray-900 text-sm bg-pink-50 text-[#C2517A] px-2 py-0.5 rounded-lg" dir="ltr">{product.price.toLocaleString('fr-DZ')} DA</p>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {product.description && (
                          <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                            {product.description}
                          </p>
                        )}
                        
                        {/* WhatsApp Button */}
                        <a 
                          href={waLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={handleWhatsappClick}
                          className="mt-auto w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm shadow-green-200"
                        >
                          <MessageSquare size={16} />
                          {lang === 'ar' ? 'طلب عبر واتساب' : 'Commander via WhatsApp'}
                        </a>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-pink-50 text-[#C2517A] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package size={32} />
                </div>
                <p className="text-gray-500 text-sm">
                  {lang === 'ar' ? 'لم يتم إضافة أي منتجات بعد.' : 'Aucun produit n\'a encore été ajouté.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── TAB: Services ─── */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          <div className="card p-5">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Briefcase size={17} className="text-[#C2517A]" />
              {t(d.servicesTitle)}
            </h3>
            {services ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {services.map((s, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gradient-to-r from-pink-50 to-purple-50/50 rounded-xl border border-pink-100">
                    <div className="w-7 h-7 rounded-full bg-[#C2517A]/10 flex items-center justify-center shrink-0">
                      <CheckCircle size={14} className="text-[#C2517A]" />
                    </div>
                    <span className="text-sm font-medium text-gray-800">{s}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic py-2">Ce partenaire n&apos;a pas encore renseigné ses services.</p>
            )}
          </div>

        </div>
      )}

      {/* ─── TAB: Informations ─── */}
      {activeTab === 'infos' && (
        <div className="space-y-6">
          <div className="card p-5">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Info size={17} className="text-[#C2517A]" />
              {t(d.practicalTitle)}
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: MapPin, label: t(d.labelWilaya),   value: typeof partner.wilaya === 'string' ? partner.wilaya : partner.wilaya?.name },
                  { icon: Phone,  label: t(d.labelPhone),    value: partner.phone, ltr: true },
                  { icon: Truck,  label: t(d.labelDelivery), value: t(d.deliveryVal) },
                  { icon: Clock,  label: t(d.labelDelay),    value: t(d.delayVal) },
                ].map(({ icon: Icon, label, value, ltr }) => (
                  <div key={label} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <Icon size={16} className="text-[#C2517A] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
                      <p className={`text-sm font-medium text-gray-800 mt-0.5 ${ltr ? '' : ''}`} dir={ltr ? 'ltr' : undefined}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border border-pink-100 rounded-xl p-4 space-y-2">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">{t(d.conditionsTitle)}</p>
                {[
                  { label: t(d.condMinOrder),  value: partner.minOrder || t(d.condMinOrderVal), ok: !partner.minOrder || partner.minOrder.toLowerCase() === 'aucune' },
                  { label: t(d.condRemote),     value: partner.remoteWork ? 'Accepté' : 'Non',   ok: partner.remoteWork },
                  { label: t(d.condAppt),       value: partner.appointmentStatus || t(d.condApptVal),     ok: partner.appointmentStatus !== 'Oui' },
                  { label: t(d.condDelivery),   value: partner.deliveryAvailable ? 'Oui' : 'Non', ok: partner.deliveryAvailable },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between text-sm py-1.5 border-b border-pink-50 last:border-0">
                    <span className="text-gray-600">{item.label}</span>
                    <span className={`font-semibold ${item.ok ? 'text-green-600' : 'text-amber-500'}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {partner.schedule && Object.keys(partner.schedule).length > 0 && (
            <div className="card p-5">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock size={17} className="text-[#C2517A]" />
                {t(d.scheduleTitle)}
              </h3>
              <div className="space-y-1.5">
                {Object.entries(partner.schedule).map(([day, sched]) => {
                  const isToday = day === today
                  const dayKey = DAY_KEYS[day] as keyof typeof d
                  return (
                    <div key={day} className={`flex items-center justify-between text-sm py-2 px-3 rounded-xl ${isToday ? 'bg-pink-50 font-semibold' : ''}`}>
                      <span className={`capitalize ${isToday ? 'text-[#C2517A]' : 'text-gray-600'}`}>
                        {dayKey ? t(d[dayKey] as { fr: string; ar: string }) : day}
                        {isToday && <span className="ml-1 rtl:mr-1 text-xs">({t(d.today)})</span>}
                      </span>
                      <span className={sched?.isClosed ? 'text-red-400' : 'text-gray-800'} dir="ltr">
                        {sched?.isClosed ? t(d.closed) : `${sched?.open} – ${sched?.close}`}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div className="card p-5">
            <h3 className="font-bold text-gray-900 mb-3">{t(d.aboutTitle)}</h3>
            <p className="text-gray-600 leading-relaxed text-sm">{partner.description}</p>
            {partner.registreCommerce && (
              <div className="mt-4 flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-xl">
                <CheckCircle size={15} />
                <span>{t(d.rcLabel)} <strong>{partner.registreCommerce}</strong></span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── TAB: Avis ─── */}
      {activeTab === 'avis' && (
        <div className="card p-5">
          <PartnerReviews
            partnerId={partner.id}
            rating={partner.rating}
            reviewCount={partner.reviewCount}
          />
        </div>
      )}

      {lightbox !== null && (
        <Lightbox
          photos={photos}
          index={lightbox}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  )
}
