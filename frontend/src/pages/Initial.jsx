import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Marquee from '../components/Marquee'
import LocomotiveScroll from 'locomotive-scroll';
import Sky from '../components/Sky';
import Card from '../components/Card';
import Footer from '../components/Footer';

const Initial = () => {
   const locomotiveScroll = new LocomotiveScroll();
  return (
    <div className='relative min-h-screen bg-gradient-to-b from-neutral-900 via-zinc-800 to-neutral-950'>
      <div className="absolute inset-0 grid-background"></div>
      <div className="relative z-10">
        <Navbar />
        <Hero /> 
        <Marquee />
        <Sky />
        <Card />
        <Footer />
      </div>
    </div>
    
  )
}

export default Initial