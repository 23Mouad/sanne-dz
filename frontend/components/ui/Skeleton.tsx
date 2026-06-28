'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-gradient-to-r from-pink-100 via-pink-50 to-pink-100 bg-[length:200%_100%]',
        className
      )}
      style={{ animation: 'shimmer 1.5s infinite' }}
    />
  )
}

export function PartnerCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-pink-100 overflow-hidden">
      <Skeleton className="h-44 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-9 flex-1 rounded-xl" />
          <Skeleton className="h-9 w-10 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export function PageTitleSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-5 w-1/2" />
    </div>
  )
}
