"use client"
import Image from 'next/image'
import React, { useState } from 'react'

function SelectStyle({ onUserSelect }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const styleOptions = [
    {
      name: 'Realistic',
      image: '/real.jpg'
    },
    {
      name: 'Cartoon',
      image: '/cartoon.jpeg'
    },
    {
      name: 'Comic',
      image: '/comic.jpeg'
    },
    {
      name: 'GTA',
      image: '/gta.jpg'
    },
    {
      name: 'Historic',
      image: '/historical.jpg'
    },
    {
      name: 'Watercolor',
      image: '/watercolor.jpg'
    },
  ];
  return (
    <div className='mt-8'>
      <h2 className='font-bold text-2xl text-primary'>Style</h2>
      <p className='text-gray-500'>Select your video style</p>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-3'>
        {styleOptions.map((item) => (
          <div
            className={`relative hover:scale-105 transition-all cursor-pointer rounded-xl ${selectedOption === item.name ? 'border-2 border-primary' : ''}`}
            key={item.name}
          >
            <Image
              src={item.image}
              width={100}
              height={100}
              className='h-48 rounded-lg w-full object-cover'
              alt={item.name}
              onClick={() => {
                setSelectedOption(item.name);
                onUserSelect && onUserSelect('imageStyle', item.name);
              }}
            />
            <h2 className='absolute p-1 bg-black bottom-0 w-full text-white text-center rounded-b-lg'>{item.name}</h2>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SelectStyle