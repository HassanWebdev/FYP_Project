"use client";
import Navbar from '@/components/Custom/Navbar';
import Hero from '@/components/Custom/Hero';
import withauth from '../components/Custom/withauth';

function Page() {
  return (
    <div className='overflow-hidden'>
      <Navbar background={'bg-[#0F172A] text-white'}/>
      <Hero/>
    </div>
  );
}

export default withauth(Page);
