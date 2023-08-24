import Link from 'next/link'

const inputStyle = 'text-2xl border-2 border-neutral-500 rounded-full py-2 px-4 my-2'

export default function SignupForm() {
  return (
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
}
