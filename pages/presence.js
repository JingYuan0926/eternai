import React, { useState } from 'react';
import ContourBackground from '../components/ContourBackground';

export default function PresencePage({ onOpenMenu }) {
    return (
        <div className="flex flex-col min-h-screen bg-white relative overflow-hidden font-sans">
            <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
                <ContourBackground density={2.2} />
            </div>

            <div className="absolute top-0 left-0 w-full px-12 py-10 pointer-events-none z-[300]">
                <div className="pointer-events-auto inline-block">
                    <h1 className="font-sans text-[2.5rem] font-black tracking-[-0.08em] leading-[0.85] m-0 uppercase text-black">
                        ETERNAI<br />
                    </h1>
                </div>
            </div>

            <div className="absolute top-0 left-0 w-full px-12 py-10 flex justify-end items-start z-50 pointer-events-none">
                <div className="pointer-events-auto flex gap-4 items-center">
                    <button
                        onClick={onOpenMenu}
                        className="bg-transparent border-[1.5px] border-black w-12 h-12 flex flex-col justify-center items-center gap-[5px] cursor-pointer rounded-md hover:bg-black/5 transition-colors"
                    >
                        <div className="w-[1.2rem] h-[2px] bg-black"></div>
                        <div className="w-[1.2rem] h-[2px] bg-black"></div>
                    </button>
                </div>
            </div>

            <div className="relative z-10 w-full flex-grow flex flex-col justify-center items-center pt-24 pb-0 text-center">
                <h2 className="text-[#ccff00] text-6xl md:text-8xl transform -rotate-2 opacity-90 mb-8" style={{ fontFamily: '"Brush Script MT", cursive', textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>
                    Presence
                </h2>
                <p className="font-sans text-xl font-bold uppercase tracking-widest opacity-60">
                    Active Legacy
                </p>
                <div className="mt-8 border-t border-black/20 pt-8 w-64 mx-auto">
                    <p className="text-sm opacity-50 font-mono">Select a legend to view their presence.</p>
                </div>
            </div>
        </div>
    );
}
