'use client'

import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'

const InitialLoadingScreen = () => {
  const [isLoading, setIsLoading] = useState(true)
  const screenRef = useRef(null)
  const TOtextRef = useRef(null)
  const TORef = useRef(null)
  const wellcometextRef = useRef(null)
  const WellcomeRef = useRef(null)
  const MockMasterRef = useRef(null)
  const MockMastertextRef = useRef(null)
  const loaderRef = useRef(null)

useEffect(() => {
  const tl = gsap.timeline()
  tl.to(wellcometextRef.current, {
    width: '100%',
    duration: 2,
    ease: 'power3.inOut',
  })
  tl.to(WellcomeRef.current, {
    opacity:0,
    duration: .5,
    ease: 'power3.inOut',
  })
  tl.to(WellcomeRef.current, {
    display: 'none',
    duration: .5,
    ease: 'power3.inOut',
  })
  tl.set(TOtextRef.current, {
    width: 0,
  })
  tl.set(TORef.current, {
    display: 'block',
  })
  tl.to(TOtextRef.current, {
    width: '100%',
    duration: 1.5,
    ease: 'power3.inOut',
  })
  tl.to(TORef.current, {
    display: 'none',
    duration: .5,
    ease: 'power3.inOut',
  })
  tl.set(MockMasterRef.current, {
    display: 'block',
  })
  tl.set(MockMastertextRef.current, {
    width: 0,
  })
  tl.to(MockMastertextRef.current, {
    width: '100%',
    duration: 1.5,
    ease: 'power3.inOut',
  })
  tl.to(MockMasterRef.current, {
    display: 'none',
    duration: 2,
    ease: 'power3.inOut',
  })
  tl.to(screenRef.current, {
    borderRadius: ['0%', '50%', '0%'],
    scaleY: 0,
    transformOrigin: 'top',
    duration: 1,
    ease: 'power3.inOut',
  })
}, [])

  if (!isLoading) return null

  return (
    <div 
      ref={screenRef}
      className="fixed w-full font-neue_montreal inset-0 bg-[#0F172A] flex flex-col justify-center items-center z-[9999] "
    >
      <div 
        ref={loaderRef}
        className="w-full relative text-[13rem] flex flex-col items-center justify-end"
      >
        <div  ref={WellcomeRef} className='relative text-[13rem] font-bold tracking-widest text-transparent ' style={{WebkitTextStroke: '3px white'}}>
          WELL&nbsp;&nbsp;COME
          <div 
            ref={wellcometextRef} 
            className='absolute inset-0 text-[13rem] font-bold text-white w-0 overflow-hidden'
            style={{WebkitTextStroke: '3px white'}}
          >
            WELL&nbsp;&nbsp;COME
          </div>
        </div>
        <div ref={TORef} className='relative text-[13rem] font-bold tracking-widest text-transparent hidden' style={{WebkitTextStroke: '3px white'}}>TO
          <div  ref={TOtextRef} className='absolute inset-0 text-[13rem] font-bold text-white overflow-hidden'>
            TO
          </div>
        </div>
        <div  ref={MockMasterRef} className='relative text-[13rem] font-bold tracking-widest text-transparent hidden text-nowrap scale-80' style={{WebkitTextStroke: '3px white'}}>MOCK MASTER
          <div  ref={MockMastertextRef} className='absolute inset-0 text-white text-[13rem] font-bold overflow-hidden whitespace-nowrap text-nowrap'>
            MOCK MASTER
          </div>
        </div>
      </div>
    </div>
  )
}

export default InitialLoadingScreen
