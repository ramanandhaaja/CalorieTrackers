import { getPayload } from 'payload'
import config from '@/payload.config'

import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Gallery from '../../components/Gallery'
import AboutUs from '../../components/AboutUs'
import Testimonials from '../../components/Testimonials'
import Hero from '../../components/Hero'
import ContactInfo from '../../components/ContactInfo'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import Menu from '../../components/Menu'
import HowItWorks from '../../components/HowItWorks'
import Pricing from '../../components/Pricing'

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
