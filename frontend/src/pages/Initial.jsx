import React, { useEffect, useRef } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Marquee from '../components/Marquee'
import Card from '../components/Card';
import Footer from '../components/Footer';
import Sky from '../components/Sky';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';

const Initial = () => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!scrollRef.current) return;

    const scroll = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
      lerp: 0.05,
    });

    return () => {
      scroll.destroy();
    };
  }, []);

   return (
    <div ref={scrollRef} data-scroll-container className='relative min-h-screen bg-gradient-to-b from-neutral-900 via-zinc-800 to-neutral-950'>
      <div className="absolute inset-0 grid-background"></div>
      <div data-scroll-section className="relative z-10">
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