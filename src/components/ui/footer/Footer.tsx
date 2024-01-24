import { titleFont } from '@/config/fonts'
import Link from 'next/link'
import React from 'react'
import { IoLocationOutline } from 'react-icons/io5'

export const Footer = () => {
  return (
    <div className='flex w-full justify-center text-xs mb-10'>

      <Link href='/' className='mx-3 hover:underline transition-all'>
        <span className={`${titleFont.className} antialiased font-bold`}>Teslo </span>
        <span>| Shop</span>
        <span> &copy; { new Date().getFullYear() }</span>
      </Link>

      <Link href='/' className='mx-3 hover:underline transition-all'>
        Privacidad & legal
      </Link>

      <Link href='/' className='mx-3 flex items-center gap- hover:underline transition-all'>
        <span>
          <IoLocationOutline />
        </span>
        <span>
          Ubicaciones
        </span>
      </Link>

    </div>
  )
}
