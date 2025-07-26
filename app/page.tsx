'use client'

import dynamic from 'next/dynamic'

const IDELayout = dynamic(() => import('@/components/IDELayout'), {
  ssr: false,
  loading: () => <div className="h-screen bg-gray-900 flex items-center justify-center text-white">Loading IDE...</div>
})

export default function Home() {
  return <IDELayout />;
}
