// web/src/app/reviews/[slug]/loading.tsx

export default function ReviewLoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="container mx-auto max-w-5xl p-4 md:p-8">
        <div className="h-[60vh] w-full rounded-lg bg-gray-800"></div>
      </div>

      <div className="container mx-auto max-w-5xl my-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div className="bg-gray-800/50 border border-border p-4 rounded-lg h-96"></div>
          <div className="bg-gray-800/50 border border-border p-6 rounded-lg h-96"></div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 md:p-8 pt-0">
        <div className="prose prose-lg max-w-3xl mx-auto">
          <div className="space-y-4">
            <div className="h-4 bg-gray-800 rounded w-full"></div>
            <div className="h-4 bg-gray-800 rounded w-full"></div>
            <div className="h-4 bg-gray-800 rounded w-5/6"></div>
            <div className="h-4 bg-gray-800 rounded w-full mt-6"></div>
            <div className="h-4 bg-gray-800 rounded w-full"></div>
            <div className="h-4 bg-gray-800 rounded w-4/5"></div>
            <div className="h-4 bg-gray-800 rounded w-full mt-6"></div>
            <div className="h-4 bg-gray-800 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  )
}