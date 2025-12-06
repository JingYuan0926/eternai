import React from 'react';
import Image from 'next/image';
import ContourBackground from '../components/ContourBackground';

// Mock Data for Legends
const legendsData = [
    { id: 1, name: "ALAN TURING", date: "1912 - 1954" },
    { id: 2, name: "GRACE HOPPER", date: "1906 - 1992" },
    { id: 3, name: "NIKOLA TESLA", date: "1856 - 1943" },
    { id: 4, name: "MARIE CURIE", date: "1867 - 1934" },
    { id: 5, name: "ADA LOVELACE", date: "1815 - 1852" },
    { id: 6, name: "STEPHEN HAWKING", date: "1942 - 2018" }
];

// Custom Card Component with Notched Border
const LegendCard = ({ legend }) => {
    return (
        <div className="relative w-full aspect-square group cursor-pointer">
            {/* SVG Border Layer */}
            <div className="absolute inset-0 z-20 pointer-events-none">
                <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 400 400"
                    preserveAspectRatio="none"
                    className="overflow-visible"
                >
                    <defs>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>
                    {/* 
                        Path Description:
                        Start Top-Left (rounded) -> Top-Right (rounded)
                        -> Down Right Side -> Curve In (Notch Start) -> Curve Down (Notch End) -> Bottom Left (rounded) -> Close
                    */}
                    <path
                        d="
                            M 20 0 
                            L 380 0 
                            Q 400 0 400 20 
                            L 400 320 
                            Q 400 340 380 340
                            L 230 340 
                            Q 210 340 190 360
                            L 170 380
                            Q 150 400 130 400
                            L 20 400 
                            Q 0 400 0 380 
                            L 0 20 
                            Q 0 0 20 0 
                            Z"
                        vectorEffect="non-scaling-stroke" // Keep border width constant
                        fill="none"
                        stroke="#333" // Dark grey border
                        strokeWidth="1.5"
                        className="transition-all duration-300 group-hover:stroke-[#ccff00]"
                    />
                    {/* Dynamic Notch Path for correct filling/masking if needed, but for now just the border */}
                </svg>
            </div>

            {/* Content Container - Masked or just placed inside */}
            {/* 
                Since masking a complex shape with varying aspect ratio is hard with CSS alone, 
                we'll just use a slightly smaller inner container or a clip-path if we want to perfect the image cut.
                For now, a standard rounded square image is "good enough" if the background is black,
                but for the authentic 'cut' look, the image needs to be clipped.
            */}
            {/* Content Container - Masked or just placed inside */}
            <div className="absolute inset-2 z-10 overflow-hidden"
                style={{
                    clipPath: 'polygon(0 0, 100% 0, 100% 80%, 70% 80%, 60% 90%, 50% 100%, 0 100%)'
                }}>
                <div className="w-full h-full bg-transparent relative">
                    {/* Placeholder Effect */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-40">
                        <span className="font-sans text-xs tracking-widest uppercase text-black">Portrait</span>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-1 right-1 z-30 flex flex-col items-end text-right pr-0 pb-1">
                <h3 className="font-sans text-xl font-bold uppercase tracking-tight text-black mb-0 leading-none translate-y-1">
                    {legend.name}
                </h3>
                <p className="font-sans text-lg font-extrabold tracking-tight text-[#ccff00] mt-0 leading-none">
                    {legend.date}
                </p>
            </div>
        </div>
    );
};

export default function LegendsPage({ onOpenMenu }) {
    return (
        <div className="flex flex-col min-h-screen bg-white relative overflow-hidden">
            {/* Background Contour Lines */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <ContourBackground density={2.2} />
            </div>

            {/* Header - Fixed (Logo & Menu) */}
            <div className="fixed top-0 left-0 w-full px-12 py-10 z-[300] flex justify-between items-start pointer-events-none">
                {/* Logo */}
                <div className="pointer-events-auto">
                    <h1 className="font-sans text-[2.5rem] font-black tracking-[-0.08em] leading-[0.85] m-0 uppercase text-black">
                        ETERNAI<br />
                    </h1>
                </div>

                {/* Menu Button */}
                <div className="pointer-events-auto">
                    <button
                        onClick={onOpenMenu}
                        className="bg-transparent border-[1.5px] border-black w-12 h-12 flex flex-col justify-center items-center gap-[5px] cursor-pointer rounded-md hover:bg-black/5 transition-colors"
                    >
                        <div className="w-[1.2rem] h-[2px] bg-black"></div>
                        <div className="w-[1.2rem] h-[2px] bg-black"></div>
                    </button>
                </div>
            </div>

            {/* Main Content - Scrollable Grid */}
            <div className="relative z-10 w-full max-w-[1600px] mx-auto pt-40 px-6 md:px-12 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                    {legendsData.map((legend) => (
                        <LegendCard key={legend.id} legend={legend} />
                    ))}
                </div>
            </div>
        </div>
    );
}
