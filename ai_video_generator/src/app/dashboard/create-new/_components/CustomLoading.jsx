import React from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import Image from 'next/image'

function CustomLoading({loading}) {
  return (
    <AlertDialog open={loading}>
  
  <AlertDialogContent className='bg-white max-w-md mx-auto'>
    <AlertDialogHeader>
      <AlertDialogTitle className="text-center text-lg font-semibold">Please wait</AlertDialogTitle>
      <AlertDialogDescription className="text-center text-sm text-gray-600">
        Video generation in progress.
      </AlertDialogDescription>
    </AlertDialogHeader>
    
    <div className='flex flex-col items-center justify-center py-8'>
      <Image src={'/loading.gif'} width={100} height={100} alt="Loading animation" unoptimized />
    </div>
  </AlertDialogContent>
</AlertDialog>
  )
}

export default CustomLoading