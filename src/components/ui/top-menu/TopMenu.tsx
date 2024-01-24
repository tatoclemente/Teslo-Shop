'use client'
import { titleFont } from '@/config/fonts'
import { useCartStore, useUiStore } from '@/store'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import { IoCartOutline, IoSearchOutline } from 'react-icons/io5'

export const TopMenu = () => {

  const openSideMenu = useUiStore( state => state.openSideMenu )
  const totalItemsInCart = useCartStore( state => state.getTotalItems() )

  

  const [loaded, setLoaded] = useState(false)
  // if (totalItemsInCart === 0) {
  //   redirect('/empty')
  // }
  useEffect(() => {
    setLoaded(true)
  }, [])

  return (
    <nav className='flex px-5 py-2 justify-between items-center w-full'>
      {/** logo */}
      <div>
        <Link href='/'>
          <span className={`${titleFont.className} antialiased font-bold`}>Teslo</span>
          <span> | Shop</span>
        </Link>

      </div>
      {/** Center Menu */}
      <div className='hidden sm:block'>

        <Link className='m-2 p-2 rounded-md hover:bg-gray-100' href='/gender/men'>Hombres</Link>
        <Link className='m-2 p-2 rounded-md hover:bg-gray-100' href='/gender/women'>Mujeres</Link>
        <Link className='m-2 p-2 rounded-md hover:bg-gray-100' href='/gender/kid'>Niños</Link>

      </div>

      {/* Search, Cart, Menu */}
      <div className='flex items-center gap-4'>

        <Link href='/search'>
          <IoSearchOutline className='w-5 h-5' />
        </Link>

        <Link href={
          ((totalItemsInCart === 0) && loaded)
          ? '/empty'
          : '/cart'
        }>
          <div className=' fade-in relative'>
            {
              (loaded && totalItemsInCart !== 0) &&
            (<span 
              className='absolute text-xs rounded-full px-1 font-bold -top-2 -right-2 bg-blue-700 text-white'>
                { totalItemsInCart }
            </span>)
            }
          </div>
          <IoCartOutline className='w-5 h-5' />
        </Link>

        <button 
          onClick={ openSideMenu }
          className='p-2 rounded-md transition-all hover:bg-gray-100 text-sm'>MENU</button>
        

      </div>
    </nav>
  )
}
