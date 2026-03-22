'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  value?: number
  onChange?: (rating: number) => void
  readonly?: boolean
  className?: string
}

export function StarRating({ value = 0, onChange, readonly = false, className }: StarRatingProps) {
  const [hoveredRating, setHoveredRating] = useState(0)

  const handleStarClick = (rating: number) => {
    if (!readonly && onChange) {
      onChange(rating)
    }
  }

  const handleStarHover = (rating: number) => {
    if (!readonly) {
      setHoveredRating(rating)
    }
  }

  const handleStarLeave = () => {
    if (!readonly) {
      setHoveredRating(0)
    }
  }

  const getStarFill = (starIndex: number) => {
    const rating = hoveredRating || value
    return starIndex <= rating
  }

  return (
    <div className={cn("flex gap-1", className)}>
      {[1, 2, 3, 4, 5].map((starIndex) => (
        <button
          key={starIndex}
          type="button"
          disabled={readonly}
          onClick={() => handleStarClick(starIndex)}
          onMouseEnter={() => handleStarHover(starIndex)}
          onMouseLeave={handleStarLeave}
          className={cn(
            "transition-colors",
            readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
          )}
        >
          <Star
            className={cn(
              "size-5 transition-colors",
              getStarFill(starIndex)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-none text-muted-foreground"
            )}
          />
        </button>
      ))}
    </div>
  )
}