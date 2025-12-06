import React, { useState } from 'react';
import Link from 'next/link';
// MenuOverlay is now global in _app.js

export default function HumanPage({ onOpenMenu }) {
    // const [isMenuOpen, setIsMenuOpen] = useState(false); // Managed globally

    return (
        <div className="flex justify-center items-end min-h-screen bg-white relative overflow-hidden">
            {/* Background Video */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover object-bottom"
                >
                    <source src="/landing.mp4" type="video/mp4" />
                </video>
            </div>

            {/* MenuOverlay is global now */}

            {/* Logo - Fixed on top (z-300) */}
            <div className="absolute top-0 left-0 w-full px-12 py-10 pointer-events-none z-[300]">
                <div className="pointer-events-auto inline-block">
                    <h1
                        className={`font-sans text-[2.5rem] font-black tracking-[-0.08em] leading-[0.85] m-0 uppercase transition-colors duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] text-black`}
                    >
                        ETERNAI<br />
                    </h1>
                </div>
            </div>

            {/* Header Buttons (z-50) */}
            <div className="absolute top-0 left-0 w-full px-12 py-10 flex justify-end items-start z-50 pointer-events-none">
                {/* Top Right Buttons */}
                <div className="pointer-events-auto flex gap-4 items-center">
                    <Link href="/upload">
                        <button className="bg-transparent border-[1.5px] border-black px-6 h-12 flex justify-center items-center cursor-pointer rounded-md hover:bg-black/10 transition-colors font-sans font-medium text-sm tracking-wider text-black">
                            ENTER APP
                        </button>
                    </Link>
                    <button
                        onClick={onOpenMenu}
                        className="bg-transparent border-[1.5px] border-black w-12 h-12 flex flex-col justify-center items-center gap-[5px] cursor-pointer rounded-md hover:bg-black/10 transition-colors"
                    >
                        <div className="w-[1.2rem] h-[2px] bg-black"></div>
                        <div className="w-[1.2rem] h-[2px] bg-black"></div>
                    </button>
                </div>
            </div>
            {/* Main Content Container */}
            <div className="absolute inset-0 px-12 py-10 pointer-events-none z-10 flex flex-col">
                {/* Middle Section - Tagline & Headline */}
                <div className="flex flex-col justify-center pointer-events-auto mt-30">
                    <div className="mb-6">
                        <p className="font-sans text-sm font-medium tracking-[0.2em] uppercase text-black/60 mb-2">
                            The Echo of a Life
                        </p>
                        <div className="w-8 h-[2px] bg-black/60"></div>
                    </div>
                    <h2 className="font-sans text-[4rem] md:text-[6rem] font-medium leading-[0.9] tracking-tight text-black max-w-5xl">
                        Death is not the<br />ending
                    </h2>
                </div>

                {/* Bottom Section - Description & Line */}
                <div className="pointer-events-auto relative mt-auto">
                    <p className="font-sans text-lg md:text-xl leading-relaxed text-black/80 max-w-xl mb-3">
                        Transform memories into a living dialogue. Keep their wisdom, humor, and voice alive in a secure digital sanctuary.
                    </p>

                    {/* Bottom Decorative Line */}
                    <div className="w-full h-[1px] bg-black/50 relative mb-6">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-black rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
