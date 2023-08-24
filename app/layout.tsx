import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import Header from "@/components/Header";
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tintio - Build color palettes for the web',
  description: 'a Color Picker for the Web',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
