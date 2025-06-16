// web/src/app/not-found.tsx

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 min-h-[60vh]">
      <h1 className="text-6xl font-bold text-white">404</h1>
      <p className="text-2xl mt-4 text-white">Page Not Found</p>
      <p className="mt-2 text-gray-400">Sorry, we could not find the page you were looking for.</p>
      <Link 
        href="/" 
        className="mt-8 inline-block bg-white text-black font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
      >
        Go Back Home
      </Link>
    </div>
  )
}