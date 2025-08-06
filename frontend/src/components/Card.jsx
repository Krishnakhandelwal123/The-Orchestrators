import React from 'react';
import { Link } from 'react-router-dom';

const Card = () => {
  return (
    <div
    
      style={{
        backgroundImage: `url('https://c14.patreon.com/Patreon_website_Module2_2x_wide_72dpi_0000s_0009_Layer_0_a133299db7.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      className="min-h-screen w-full flex items-center justify-center p-4"
    >
      <div
        data-scroll
        data-scroll-speed="0.2"
        data-scroll-direction="vertical"
        className="bg-white rounded-3xl p-8 sm:p-12 max-w-[25vw] flex flex-col items-center text-center shadow-2xl">
        {/* Logo */}
        <div className="w-16 h-16">
          <img
            src="https://c5.patreon.com/external/marketing/new_marketing_pages/logomark-animated.webp"
            alt="Logo"
          />
        </div>

        <h1 className="text-3xl font-semibold text-neutral-800 mt-6">
          Your world to create
        </h1>

        <a
          href="#"
          className="w-full mt-12 bg-black text-white font-semibold py-3 rounded-full hover:bg-neutral-800 transition-colors text-lg"
        >
          Get started
        </a>

        <p className="text-sm text-neutral-500 mt-6">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-black underline hover:text-neutral-700"
          >
            Log in
          </Link>
        </p>

        <div className=" h-[10vh] gap-3 w-[21vw] mt-6 flex items-center justify-center">
          <div className='h-10 w-[35%] cursor-pointer flex border-1 rounded-lg '>
            <div className='w-[35%] rounded-lg  h-full'>
              <img className='h-[32px] w-[32px] mt-0.5 ml-0.5' src="https://yt3.googleusercontent.com/PJh5BeCRze4_08Qp8zOtb2bV6JGLiqmmc9QIRTVeTlrVmC2828C7gw5KIOU8uk70jN__SSY5Ug=s900-c-k-c0x00ffffff-no-rj" alt="" />
            </div>
            <div className='w-[65%] h-full flex flex-col  justify-center '>
              <p className='text-[8px] text-start'>Get It ON</p>
              <div className='text-[10px] font-bold text-start'>GOOGLE PLAY</div>
            </div>
          </div>
          <div className='h-10 cursor-pointer w-[35%] flex border-1 rounded-lg '>
            <div className='w-[35%] rounded-lg  h-full'>
              <img className='h-[32px] w-[32px] mt-0.5 ml-0.5' src="https://www.shutterstock.com/image-vector/batumi-georgia-december-1-2023-600nw-2395541231.jpg" alt="" />
            </div>
            <div className='w-[65%] h-full flex flex-col  justify-center '>
              <p className='text-[8px] text-start'>Get It ON</p>
              <div className='text-[10px] font-bold text-start'>APPLE STORE</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Card;
