// ============================================================
// SANNE DZ — Types TypeScript
// ============================================================

export type UserRole = 'client' | 'partner' | 'admin'
export type SubscriptionPlan = 'simple' | 'pro'
export type SubscriptionCycle = 'monthly' | 'annual'
export type PartnerStatus = 'pending' | 'active' | 'suspended' | 'rejected'

// ===== USER =====
export interface User {
  id: string
  email: string
  phone: string
  firstName: string
  lastName: string
  wilaya: string
  role: UserRole
  avatar?: string
  preferredCategories: string[]
  createdAt: string
  lastActive: string
  fcmToken?: string
  isEmailVerified: boolean
}

// ===== PARTNER =====
export interface Partner {
  id: string
  slug: string
  businessName: string
  description: string
  logoUrl: string
  coverUrl: string
  wilaya: any
  address: string
  mapLink?: string
  phone: string
  whatsapp: string
  email: string
  website?: string
  registreCommerce?: string
  category?: Category
  categories?: { category: Category }[]
  subCategory?: SubCategory
  childCategory?: ChildCategory
  plan: SubscriptionPlan
  status: PartnerStatus
  rating: number
  reviewCount: number
  isPro: boolean
  isFeatured: boolean
  photos: PartnerPhoto[]
  videos?: PartnerVideo[]
  schedule?: BusinessSchedule
  stats: PartnerStats
  products?: Product[]
  minOrder?: string
  remoteWork?: boolean
  appointmentStatus?: string
  deliveryAvailable?: boolean
  services?: string[]
  achievements?: string[]
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: string
  name: string
  description?: string
  price: number
  promoPrice?: number
  imageUrl?: string
}

export interface PartnerPhoto {
  id: string
  url: string
  caption?: string
  order: number
}

export interface PartnerVideo {
  id: string
  url: string
  thumbnail: string
  caption?: string
}

export interface BusinessSchedule {
  monday?: DaySchedule
  tuesday?: DaySchedule
  wednesday?: DaySchedule
  thursday?: DaySchedule
  friday?: DaySchedule
  saturday?: DaySchedule
  sunday?: DaySchedule
}

export interface DaySchedule {
  open: string
  close: string
  isClosed?: boolean
}

export interface PartnerStats {
  profileViews: number
  whatsappClicks: number
  phoneClicks: number
  favoritesCount: number
  /** alias used in some components */
  favorites?: number
  viewsHistory?: StatPoint[]
  clicksHistory?: StatPoint[]
}

export interface StatPoint {
  date: string
  value: number
}

// ===== CATEGORY =====
export interface Category {
  id: string
  slug: string
  name: string
  icon: string
  color: string
  description?: string
  partnerCount?: number
  subCategories?: SubCategory[]
}

export interface SubCategory {
  id: string
  slug: string
  name: string
  categoryId: string
  partnerCount?: number
  childCategories?: ChildCategory[]
}

export interface ChildCategory {
  id: string
  slug: string
  name: string
  subCategoryId: string
  partnerCount?: number
}

// ===== REVIEW =====
export interface Review {
  id: string
  partnerId: string
  authorId: string
  authorName: string
  authorAvatar?: string
  rating: number
  comment: string
  createdAt: string
  updatedAt?: string
  status?: 'pending' | 'approved' | 'rejected'
  isReported?: boolean
  reportReason?: string
}

// ===== SUBSCRIPTION =====
export interface Subscription {
  id: string
  partnerId: string
  plan: SubscriptionPlan
  cycle: SubscriptionCycle
  startDate: string
  endDate: string
  price: number
  isActive: boolean
  autoRenew: boolean
  paymentHistory?: Payment[]
}

export interface Payment {
  id: string
  amount: number
  date: string
  method: string
  status: 'success' | 'failed' | 'pending'
}

export interface SubscriptionConfig {
  simplePriceMonthly: number
  simplePriceAnnual: number
  proPriceMonthly: number
  proPriceAnnual: number
  trialDays: number
  annualDiscountPercent: number
}

// ===== NOTIFICATION =====
export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  createdAt: string
  link?: string
  data?: Record<string, unknown>
}

export type NotificationType =
  | 'new_category'
  | 'new_partner'
  | 'subscription_expiring'
  | 'new_review'
  | 'account_validated'
  | 'account_rejected'
  | 'promo'
  | 'broadcast'

// ===== ADMIN STATS =====
export interface AdminStats {
  totalUsers: number
  totalPartners: number
  activePartners: number
  pendingPartners: number
  suspendedPartners: number
  totalRevenue: number
  monthlyRevenue: number
  proPartners: number         // actual field returned by backend
  proPartnersCount?: number   // legacy alias (optional)
  proConversionRate: number
  totalReviews?: number
  avgRating?: number
  activeWilayas?: number
  topWilayas?: WilayaStat[]
  topCategories?: CategoryStat[]
  monthlyGrowth: MonthlyGrowth[]
}

export interface WilayaStat {
  wilaya: string
  partnerCount: number
  clientCount: number
}

export interface CategoryStat {
  category: string
  partnerCount: number
  searchCount: number
}

export interface MonthlyGrowth {
  month: string
  users: number
  partners: number
  revenue: number
}

// ===== SEARCH =====
export interface SearchFilters {
  q?: string
  wilaya?: string
  category?: string
  subCategory?: string
  plan?: SubscriptionPlan | ''
  sort?: 'rating' | 'reviews' | 'recent' | 'relevance'
  page?: number
}

export interface SearchResult {
  partners: Partner[]
  total: number
  page: number
  totalPages: number
  filters: SearchFilters
}

// ===== FORMS =====
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterClientForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  wilayaId: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

export interface RegisterPartnerForm {
  businessName: string
  email: string
  phone: string
  whatsapp: string
  wilayaId: string
  address: string
  mapLink?: string
  deliveryType?: string
  categoryId?: string
  subCategoryId?: string
  childCategoryId?: string
  categorySlugs?: string[]
  description: string
  registreCommerce?: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
  acceptPartnerConditions: boolean
  isPro: boolean
}

export interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

// ===== WILAYA (extended) =====
export interface WilayaInfo {
  id: string
  name: string
  partnerCount?: number
  isActive?: boolean
}
