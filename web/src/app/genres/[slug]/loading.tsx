// web/src/app/genres/[slug]/loading.tsx

export default function Loading() {
  const skeletonItems = Array.from({ length: 12 });

  return (
    <div className="container mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 animate-pulse">
      {skeletonItems.map((_, index) => (
        <div key={index} className="bg-gray-800 rounded-lg aspect-[2/3]" />
      ))}
    </div>
  )
}