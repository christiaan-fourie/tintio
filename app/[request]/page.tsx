import { redirect } from 'next/navigation'
// Import Link
import Link from 'next/link'


export default function request({ params }: { params: { request: string } }) {
  
    // If the request is not signup or login, redirect to the home page
    if (params.request !== 'signup' && params.request !== 'signin') {
        redirect('/')
    }

    // Styling for the form and form elements
    const formStyle = 'flex flex-col'
    const inputStyle = 'text-2xl border-2 border-neutral-500 rounded-full py-2 px-4 my-2'
    const buttonStyle = 'text-2xl w-1/2 font-bold bg-neutral-500 py-2 rounded-full mt-12'
    

    // Sign Up Form
    let signup = (
        <form className='flex flex-col'>
            <div className='flex justify-around p-4'>
                <Link href={'/signup'} className='text-xl'> Sign Up </Link>
                <Link href={'/signin'} className='text-xl'> Sign In </Link>
            </div>
            <input
                type='text'
                placeholder='name'
                className={inputStyle}
            />
            <input
                type='email'
                placeholder='Email'
                className={inputStyle}
            />
            <input
                type='password'
                placeholder='Password'
                className={inputStyle}
            />
            <button
                className='text-2xl w-1/2 font-bold bg-neutral-500 py-2 rounded-full mt-12'
            >Sign Up</button>
        </form>
    )

    // Sign In Form
    let signin = (
        <form className='flex flex-col'>
            <div className='flex justify-around p-4'>
                <Link href={'/signup'} className='text-xl'> Sign Up </Link>
                <Link href={'/signin'} className='text-xl'> Sign In </Link>
            </div>
            <input
                type='email'
                placeholder='Email'
                className={inputStyle}
            />
            <input
                type='password'
                placeholder='Password'
                className={inputStyle}
            />
            <button
                className='text-2xl w-1/2 font-bold bg-neutral-500 py-2 rounded-full mt-12'
            >Sign In</button>
        </form>
    )

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
            {params.request === 'signup' ? signup : signin}

        </div>
    </div>
  )
}

