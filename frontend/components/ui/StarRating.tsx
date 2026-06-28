'use client'

import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  max?: number
  size?: number
  showValue?: boolean
  reviewCount?: number
  interactive?: boolean
  onChange?: (rating: number) => void
}

export default function StarRating({
  rating,
  max = 5,
  size = 16,
  showValue = false,
  reviewCount,
  interactive = false,
  onChange,
}: StarRatingProps) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, i) => (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(i + 1)}
            className={interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}
          >
            <Star
              size={size}
              className={
                i < Math.round(rating)
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-200 fill-gray-200'
              }
            />
          </button>
        ))}
      </div>
      {showValue && (
        <span className="text-sm font-semibold text-gray-800">{rating.toFixed(1)}</span>
      )}
      {reviewCount !== undefined && (
        <span className="text-xs text-gray-400">({reviewCount} avis)</span>
      )}
    </div>
  )
}
