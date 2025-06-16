// web/src/app/loading.tsx

export default function Loading() {
  const skeletonItems = Array.from({ length: 12 }); // Create 12 placeholder items

  return (
    <div className="container mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {skeletonItems.map((_, index) => (
        <div 
          key={index} 
          className="bg-gray-800 rounded-lg aspect-[2/3] animate-pulse" 
        />
      ))}
    </div>
  )
}