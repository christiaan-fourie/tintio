import { redirect } from 'next/navigation'

import SignupForm from '@/components/SignupForm'
import SigninForm from '@/components/SigninForm'


export default function request({ params }: { params: { request: string } }) {
  
    // If the request is not signup or login, redirect to the home page
    if (params.request !== 'signup' && params.request !== 'signin') {
        redirect('/')
    }

    // Styling for the form and form elements
    const formStyle = 'flex flex-col'
    const buttonStyle = 'text-2xl w-1/2 font-bold bg-neutral-500 py-2 rounded-full mt-12'
    
    
  return (    
    <div className='flex min-h-screen justify-around items-center px-12'>
        <div className='flex flex-col'>
            {/* H1, h3, Button */}
            <h1
                className='text-8xl font-bold'
            >Tintio</h1>
            <h3
                className='text-2xl'
            >Where Every Shade Tells a Story.</h3>
            <button
                className='text-2xl w-1/2 font-bold bg-neutral-500 py-2 rounded-full mt-12'
            >Explore..</button>
        </div>      
        <div>
            {/* A Form Relative To Request */}
            {params.request === 'signup' ? <SignupForm /> : <SigninForm />}

        </div>
    </div>
  )
}

