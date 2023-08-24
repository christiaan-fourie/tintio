export default function Header() {
  return (
    <div className="absolute top-0 px-6 w-screen flex items-center justify-between border-b border-neutral-500">
        <div className="flex items-center gap-4">
            {/* Logo svg in the public dir */}
            <img src="/logo.svg" alt="Tintio Logo" className="w-16 h-16" />
            <h1 className="text-2xl font-bold">Tintio</h1>
        </div>
        <div>
                        
        </div>
    </div>    
  )
}
