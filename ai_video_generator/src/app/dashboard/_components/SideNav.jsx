"use client"
import React from 'react'
import { CircleUser, FileVideo, PanelsTopLeft, ShieldPlus } from 'lucide-react'
import { usePathname } from 'next/navigation'
function SideNav() {
 
    const MenuItems = [
        {
            id:1,
            name:'Dashboard',
            path:'/dashboard',
            icon:PanelsTopLeft
        },
        {
            id:2,
            name:'Create new',
            path:'/dashboard/create-new',
            icon:FileVideo
        },
        {
            id:3,
            name:'Upgrade',
            path:'/upgrade',
            icon:ShieldPlus
        },
        {
            id:4,
            name:'Account',
            path:'/account',
            icon:CircleUser
        }

    ]

    const path=usePathname();
    console.log(path)
  return (
    <div className='w-64 h-screen shadow-md p-5'>
        <div className='grid gap-3'>
            {MenuItems.map(
                (item) => (
                    <div key={item.id} className={`flex items-center gap-3 p-3 hover:bg-primary hover:text-white rounded-md cursor-pointer 
                    ${path==item.path ? 'bg-primary text-white' : ''}`} >
                        <item.icon/>
                        <h2>{item.name}</h2>
                    </div>
                )
            )}
        </div>
        </div>
  )
}

export default SideNav