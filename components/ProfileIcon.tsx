'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function ProfileIcon() {

    const [ isActive, setIsActive ] = useState(false)

  return (
    
        isActive ? (
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold">Welcome</h1>
            </div>
        ) : (
            <div>
                <Link href={'/signup'} className='text-lg'> Sign Up </Link>
                <Link href={'/signin'} className='text-lg'> Sign In </Link>
            </div>
        )
    
  )
}
