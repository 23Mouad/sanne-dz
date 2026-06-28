import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { API_URL } from './constants'

// دمج Tailwind classes بدون تعارض
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// تنسيق التاريخ بالفرنسية
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const diff = Date.now() - d.getTime()
  if (diff < 60_000)  return 'À l\'instant'
  if (diff < 3_600_000) return `Il y a ${Math.floor(diff / 60_000)} min`
  if (diff < 86_400_000) return `Il y a ${Math.floor(diff / 3_600_000)}h`
  return d.toLocaleDateString('fr-DZ', { day: 'numeric', month: 'short', year: 'numeric' })
}

// إنشاء slug من النص
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[àáâäã]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[ç]/g, 'c')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

// بناء رابط WhatsApp
export function buildWhatsAppLink(
  phone: string,
  businessName: string
): string {
  const message = encodeURIComponent(
    `Bonjour, j'ai trouvé votre profil ${businessName} sur Sanne DZ. Je voudrais avoir plus d'informations.`
  )

  const cleanPhone = phone.replace(/[^0-9]/g, '')

  return `https://wa.me/${cleanPhone}?text=${message}`
}

// تقليص النص
export function truncate(
  text: string,
  maxLength: number
): string {
  if (text.length <= maxLength) return text

  return text.slice(0, maxLength) + '...'
}

// بناء رابط الصور من الباك اند
export function getImageUrl(url: string | null | undefined): string {
  if (!url) return '/logoMain.png';
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  
  // Extraire l'origine (http://localhost:3001) depuis l'API_URL (http://localhost:3001/api/v1)
  const baseUrl = API_URL.split('/api')[0];
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
}