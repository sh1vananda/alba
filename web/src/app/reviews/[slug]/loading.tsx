// web/src/app/reviews/[slug]/loading.tsx

export default function ReviewLoadingSkeleton() {
  return (
    <div className="container mx-auto max-w-5xl p-4 md:p-8 animate-pulse">
      {/* Hero Image Skeleton */}
      <div className="h-[60vh] w-full rounded-lg bg-gray-800 mb-12"></div>

      {/* Main Content Skeleton */}
      <div className="max-w-3xl mx-auto">
        {/* Title Skeleton */}
        <div className="h-10 bg-gray-800 rounded w-3/4 mb-4"></div>
        {/* Subtitle Skeleton */}
        <div className="h-6 bg-gray-800 rounded w-1/2 mb-8"></div>
        
        {/* Body Text Skeletons */}
        <div className="space-y-4">
          <div className="h-4 bg-gray-800 rounded w-full"></div>
          <div className="h-4 bg-gray-800 rounded w-full"></div>
          <div className="h-4 bg-gray-800 rounded w-5/6"></div>
          <div className="h-4 bg-gray-800 rounded w-full mt-6"></div>
          <div className="h-4 bg-gray-800 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  )
}