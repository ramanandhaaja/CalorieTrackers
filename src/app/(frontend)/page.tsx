import { getPayload } from 'payload'
import config from '@/payload.config'

import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Gallery from '../../components/layout/Gallery'
import AboutUs from '../../components/layout/AboutUs'
import Testimonials from '../../components/layout/Testimonials'
import Hero from '../../components/layout/Hero'
import ContactInfo from '../../components/layout/ContactInfo'
import Footer from '../../components/layout/Footer'
import Header from '../../components/layout/Header'
import Menu from '../../components/layout/Menu'
import HowItWorks from '../../components/layout/HowItWorks'
import Pricing from '../../components/layout/Pricing'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />
      
      {/* Hero Section */}
      <Hero />

      {/* Menu Section */}
      <Menu />

      {/* How It Works Section */}
      <HowItWorks />

      {/* About Us Section */}
      <AboutUs />

      {/* Testimonials Section */}
      <Testimonials />

      {/* Pricing Section */}
      <Pricing />

      {/* Gallery Section */}
      <Gallery />

      {/* Contact Info Section */}
      <ContactInfo />

      {/* Footer */}
      <Footer />
    </div>
  )
}
