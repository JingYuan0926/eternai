import React from 'react';
import ContourBackground from '../../components/ContourBackground';
import RecentActivities from '../../components/RecentActivities';

export default function KobePage({ onOpenMenu }) {
    return (
        <div className="flex flex-col min-h-screen bg-white relative overflow-hidden font-sans">
            {/* Background Contour Lines - lighter opacity for this design */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
                <ContourBackground density={2.2} />
            </div>

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
                    <button
                        onClick={onOpenMenu}
                        className="bg-transparent border-[1.5px] border-black w-12 h-12 flex flex-col justify-center items-center gap-[5px] cursor-pointer rounded-md hover:bg-black/5 transition-colors"
                    >
                        <div className="w-[1.2rem] h-[2px] bg-black"></div>
                        <div className="w-[1.2rem] h-[2px] bg-black"></div>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full flex-grow flex flex-col justify-center pt-24 pb-20">
                <RecentActivities />
            </div>
        </div>
    );
}
