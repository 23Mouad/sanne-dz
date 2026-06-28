export const APP_NAME = 'Sanne DZ'
export const APP_DESCRIPTION = 'Marketplace algérienne — tous les professionnels'
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'

// ===== 69 WILAYAS =====
export const WILAYAS = [
  { id: '01', name: 'Adrar' },
  { id: '02', name: 'Chlef' },
  { id: '03', name: 'Laghouat' },
  { id: '04', name: 'Oum El Bouaghi' },
  { id: '05', name: 'Batna' },
  { id: '06', name: 'Béjaïa' },
  { id: '07', name: 'Biskra' },
  { id: '08', name: 'Béchar' },
  { id: '09', name: 'Blida' },
  { id: '10', name: 'Bouira' },
  { id: '11', name: 'Tamanrasset' },
  { id: '12', name: 'Tébessa' },
  { id: '13', name: 'Tlemcen' },
  { id: '14', name: 'Tiaret' },
  { id: '15', name: 'Tizi Ouzou' },
  { id: '16', name: 'Alger' },
  { id: '17', name: 'Djelfa' },
  { id: '18', name: 'Jijel' },
  { id: '19', name: 'Sétif' },
  { id: '20', name: 'Saïda' },
  { id: '21', name: 'Skikda' },
  { id: '22', name: 'Sidi Bel Abbès' },
  { id: '23', name: 'Annaba' },
  { id: '24', name: 'Guelma' },
  { id: '25', name: 'Constantine' },
  { id: '26', name: 'Médéa' },
  { id: '27', name: 'Mostaganem' },
  { id: '28', name: "M'Sila" },
  { id: '29', name: 'Mascara' },
  { id: '30', name: 'Ouargla' },
  { id: '31', name: 'Oran' },
  { id: '32', name: 'El Bayadh' },
  { id: '33', name: 'Illizi' },
  { id: '34', name: 'Bordj Bou Arréridj' },
  { id: '35', name: 'Boumerdès' },
  { id: '36', name: 'El Tarf' },
  { id: '37', name: 'Tindouf' },
  { id: '38', name: 'Tissemsilt' },
  { id: '39', name: 'El Oued' },
  { id: '40', name: 'Khenchela' },
  { id: '41', name: 'Souk Ahras' },
  { id: '42', name: 'Tipaza' },
  { id: '43', name: 'Mila' },
  { id: '44', name: 'Aïn Defla' },
  { id: '45', name: 'Naâma' },
  { id: '46', name: 'Aïn Témouchent' },
  { id: '47', name: 'Ghardaïa' },
  { id: '48', name: 'Relizane' },
  { id: '49', name: 'Timimoun' },
  { id: '50', name: 'Bordj Badji Mokhtar' },
  { id: '51', name: 'Ouled Djellal' },
  { id: '52', name: 'Béni Abbès' },
  { id: '53', name: 'In Salah' },
  { id: '54', name: 'In Guezzam' },
  { id: '55', name: 'Touggourt' },
  { id: '56', name: 'Djanet' },
  { id: '57', name: "El M'Ghair" },
  { id: '58', name: 'El Meniaa' },

  // Nouvelles divisions
  { id: '59', name: 'Aflou' },
  { id: '60', name: 'El Abiodh Sidi Cheikh' },
  { id: '61', name: 'El Aricha' },
  { id: '62', name: 'El Kantara' },
  { id: '63', name: 'Barika' },
  { id: '64', name: 'Bou Saâda' },
  { id: '65', name: 'Bir El Ater' },
  { id: '66', name: 'Ksar El Boukhari' },
  { id: '67', name: 'Ksar Chellala' },
  { id: '68', name: 'Aïn Oussara' },
  { id: '69', name: "M'saâd" },
]

// ===== CATÉGORIES =====
export const CATEGORIES_STATIC = [
  { slug: 'ateliers-couture', name: 'Ateliers de couture', icon: 'scissors', color: 'bg-pink-50' },
  { slug: 'modelistes', name: 'Modélistes', icon: 'pen-tool', color: 'bg-blue-50' },
  { slug: 'patronistes', name: 'Patronistes', icon: 'ruler', color: 'bg-purple-50' },
  { slug: 'magasins-tissus', name: 'Magasins de tissus', icon: 'layers', color: 'bg-orange-50' },
  { slug: 'merceries', name: 'Merceries', icon: 'shopping-bag', color: 'bg-green-50' },
  { slug: 'services-broderie', name: 'Services de broderie', icon: 'sparkles', color: 'bg-yellow-50' },
  { slug: 'formation-couture', name: 'Centres de formation couture', icon: 'graduation-cap', color: 'bg-gray-50' },
  { slug: 'location-machines', name: 'Location de machines à coudre', icon: 'cog', color: 'bg-indigo-50' },
  { slug: 'textiles', name: 'Textiles', icon: 'shirt', color: 'bg-red-50' },
  { slug: 'studios', name: 'Studios', icon: 'camera', color: 'bg-teal-50' },
]

// ===== POPULAR SEARCHES =====
export const POPULAR_SEARCHES = [
  'Ateliers de couture', 'Tissus', 'Broderie', 'Merceries', 'Formation couture', 'Modélistes', 'Studios'
]

// ===== SUBSCRIPTION CONFIG =====
export const SUBSCRIPTION_CONFIG = {
  simplePriceMonthly: 0,
  simplePriceAnnual: 0,
  proPriceMonthly: 2500,
  proPriceAnnual: 25000, // 2 months free
  trialDays: 15,
  annualDiscountPercent: 16.67
}