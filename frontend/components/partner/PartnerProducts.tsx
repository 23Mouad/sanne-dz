import Image from 'next/image'
import type { Product } from '@/types'
import { getImageUrl } from '@/lib/utils'

export default function PartnerProducts({ products }: { products: Product[] }) {
  if (!products || products.length === 0) return null

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Nos Produits / Services</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {products.map((product) => (
          <div key={product.id} className="group border border-pink-100 rounded-2xl overflow-hidden bg-white hover:shadow-lg hover:shadow-pink-100/50 hover:border-[#C2517A]/30 transition-all duration-300">
            {product.imageUrl && (
              <div className="relative h-40 w-full overflow-hidden bg-gray-50">
                <img
                  src={getImageUrl(product.imageUrl)}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.promoPrice && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                    PROMO
                  </div>
                )}
              </div>
            )}
            <div className="p-4 space-y-2">
              <h3 className="font-semibold text-gray-900 group-hover:text-[#C2517A] transition-colors">{product.name}</h3>
              {product.description && (
                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{product.description}</p>
              )}
              <div className="flex items-end gap-2 pt-1">
                {product.promoPrice ? (
                  <>
                    <span className="font-bold text-[#C2517A] text-lg leading-none">{product.promoPrice.toLocaleString('fr-DZ')} DZD</span>
                    <span className="text-sm text-gray-400 line-through mb-0.5">{product.price.toLocaleString('fr-DZ')} DZD</span>
                  </>
                ) : (
                  <span className="font-bold text-gray-900 text-lg leading-none">{product.price.toLocaleString('fr-DZ')} DZD</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
