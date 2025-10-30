import React from 'react';
import { motion } from 'framer-motion';

const Marquee = () => {
  return (
    <div  className='w-full mt-20 py-14 rounded-tl-3xl rounded-tr-3xl bg-[#004D43]'>
      <div className="flex text-white overflow-hidden border-t-2 border-b-2 text whitespace-nowrap border-zinc-300">
        <motion.h1 
          initial={{ x: 0 }} 
          animate={{ x: "-100%" }} 
          transition={{ ease: "linear", repeat: Infinity, duration: 15 }} 
          className='text-[16vw] tracking-tighter leading-none font-bold mb-[3vw]'>
          Launch Your Tech Career  
        </motion.h1> 
        <motion.h1 
          initial={{ x: 0 }} 
          animate={{ x: "-100%" }} 
          transition={{ ease: "linear", repeat: Infinity, duration: 15 }} 
          className='ml-20 text-[16vw] tracking-tighter leading-none font-bold mb-[3vw]'>
          Launch Your Tech Career
        </motion.h1>
      </div>
    </div>
  );
};

export default Marquee;
