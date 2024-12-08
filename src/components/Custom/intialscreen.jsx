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
      opacity: 0,
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
      className="fixed w-full font-neue_montreal inset-0 bg-[#0F172A] flex flex-col justify-center items-center z-[9999]"
    >
      <div
        ref={loaderRef}
        className="w-full relative flex flex-col items-center justify-end px-4"
      >
        <div ref={WellcomeRef} className='relative text-[4rem] md:text-[8rem] lg:text-[13rem] font-bold tracking-widest text-transparent text-center' style={{ WebkitTextStroke: '2px white' }}>
          WELL&nbsp;&nbsp;COME
          <div
            ref={wellcometextRef}
            className='absolute inset-0 text-[4rem] md:text-[8rem] lg:text-[13rem] font-bold text-white w-0 overflow-hidden text-center'
            style={{ WebkitTextStroke: '2px white' }}
          >
            WELL&nbsp;&nbsp;COME
          </div>
        </div>
        <div ref={TORef} className='relative text-[4rem] md:text-[8rem] lg:text-[13rem] font-bold tracking-widest text-transparent hidden text-center' style={{ WebkitTextStroke: '2px white' }}>
          TO
          <div ref={TOtextRef} className='absolute inset-0 text-[4rem] md:text-[8rem] lg:text-[13rem] font-bold text-white overflow-hidden text-center'>
            TO
          </div>
        </div>
        <div ref={MockMasterRef} className='relative text-[3rem] md:text-[5rem] lg:text-[11rem] font-bold tracking-widest text-transparent hidden text-nowrap text-center' style={{ WebkitTextStroke: '2px white' }}>
          MOCK MASTER
          <div ref={MockMastertextRef} className='absolute inset-0 text-white text-[3rem] md:text-[5rem] lg:text-[11rem] font-bold overflow-hidden whitespace-nowrap text-nowrap text-center'>
            MOCK MASTER
          </div>
        </div>
      </div>
    </div>
  )
}

export default InitialLoadingScreen
