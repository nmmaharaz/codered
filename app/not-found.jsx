import React from 'react'
import errorPage from '@/public/assets/Error-page.png'
import Image from 'next/image'
import Link from 'next/link'

export default function NotFoundPage404() {
  return (
    <div className='text-center h-screen'>
      <div className="image flex justify-center">
        <Image src={errorPage} alt='Error Page' width={500} height={500} />
      </div>
      <Link href={'/'} className='text-blue-500 underline underline-offset-4 btn btn-wide hover:bg-white hover:text-black'>Go back to Home</Link>
    </div>
  )
}
