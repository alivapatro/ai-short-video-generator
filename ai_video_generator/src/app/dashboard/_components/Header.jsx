import React, { useContext } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import { UserDetailContext } from '@/app/_context/UserDetailContext'


function Header() {
  const {userDetail,setUserDetail}=useContext(UserDetailContext);
  return (
    <div className='p-2 px-2 flex justify-between items-center shadow-sm'>
        <div className='flex items-center gap-2'>
            <Image src={'/logo.svg'} alt='logo' width={32} height={32}/>
            <h2 className='text-xl font-bold'>AI Video Generator</h2>
        </div>
        <div className='flex items-center gap-3'>
            <Link href='/dashboard'>
              <div className="flex items-center gap-3">
                <div className='flex gap-1 items-center'>
                <Image src={'/star.png'} alt='star' width={20} height={20}/>
                <h2>{userDetail?.credits}</h2>
                </div>
                <Button>Dashboard</Button>
              </div>
            </Link>
            <UserButton/>
        </div>
    </div>
  )
}

export default Header