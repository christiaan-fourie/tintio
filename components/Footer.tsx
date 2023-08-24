import Image from "next/image"
import Link from "next/link"

export default function Footer() {
    return (
      <div className="absolute bottom-0 py-6  w-screen flex items-center justify-center border-t border-neutral-500">
          <h3 className="text-sm">
            2023 Psytech Studio | Designed In Cape Town
          </h3>
          <div className="absolute right-0">
            <Link target="_blank" href={'https://github.com/christiaan-fourie/tintio'}>
                <Image src="/github.svg" alt="Github Repo" width={50} height={50} />
            </Link>            
          </div>
      </div>    
    )
  }
  