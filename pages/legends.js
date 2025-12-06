import React from 'react';
import Image from 'next/image';
import ContourBackground from '../components/ContourBackground';
import { useRouter } from 'next/router';

// Mock Data for Legends
const legendsData = [
    { id: 1, name: "KOBE BRYANT", date: "1978 - 2020", imageUrl: "https://cdn.artphotolimited.com/images/59888232b0ba742a2efde168/1000x1000/kobe-bryant-fevrier-2011.jpg", hoverImageUrl: "https://media-cldnry.s-nbcnews.com/image/upload/t_fit-760w,f_auto,q_auto:best/newscms/2016_15/1494926/ss-160413-kobe-bryant-mn-13.jpg" },
    { id: 2, name: "CHARLIE KIRK", date: "1993 - 2025", imageUrl: "https://www.politicon.com/wp-content/uploads/2017/06/Charlie-Kirk-2019.jpg", hoverImageUrl: "https://images.squarespace-cdn.com/content/v1/5fce5393c1e311104da811e6/b30a4bfd-10a6-4a69-8422-712e1206fba4/Charlie+Kirk_Headshot+3.jpg" },
    { id: 3, name: "ELIZABETH II", date: "1926 - 2022", imageUrl: "https://www.royalmint.com/globalassets/queen-elizabeth-ii/social---1200-x-628.jpg", hoverImageUrl: "https://live-production.wcms.abc-cdn.net.au/a348359c632f250428a559c85cfb0e45?impolicy=wcms_crop_resize&cropH=1575&cropW=2800&xPos=0&yPos=144&width=862&height=485" },
    { id: 4, name: "BRUCE LEE", date: "1940 - 1973", imageUrl: "https://s3.amazonaws.com/cms.ipressroom.com/173/files/202211/638c609b2cfac276d006457b_Bruce+Lee/Bruce+Lee_f7f23913-a920-4a5e-bc55-bef86a755316-prv.jpg", hoverImageUrl: "https://substackcdn.com/image/fetch/$s_!Zkyu!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F998c233b-c392-41c7-8c56-6dc8c1a0aba6_1500x1221.jpeg" },
    { id: 5, name: "PAUL WALKER", date: "1973 - 2013", imageUrl: "https://wallpapers.com/images/hd/black-and-white-tribute-paul-walker-jpnga1r7p3lhu462.jpg", hoverImageUrl: "https://www.hollywoodreporter.com/wp-content/uploads/2015/03/paul_walker_furious_7_h_2015.jpg?w=1440&h=810&crop=1" },
    { id: 6, name: "ELVIS PRESLEY", date: "1935 - 1977", imageUrl: "https://images.fineartamerica.com/images/artworkimages/mediumlarge/2/1-elvis-presley-archive-photos.jpg", hoverImageUrl: "https://hips.hearstapps.com/hmg-prod/images/gettyimages-138463874-678aa89c3e2e8.jpg?crop=1.00xw:0.709xh;0,0.110xh" },
    { id: 7, name: "PRINCESS DIANA", date: "1961 - 1997", imageUrl: "https://i.pinimg.com/originals/cb/22/d2/cb22d258de4cf7fff6e85953f07ae515.jpg", hoverImageUrl: "https://www.sheknows.com/wp-content/uploads/2022/12/diana.jpg?w=1440" },
    { id: 8, name: "EINSTEIN", date: "1879 - 1955", imageUrl: "https://res.cloudinary.com/aenetworks/image/upload/c_fill,ar_2,w_3840,h_1920,g_auto/dpr_auto/f_auto/q_auto:eco/v1/albert-einstein-gettyimages-544750041?_a=BAVAZGID0", hoverImageUrl: "https://www.hayadan.org.il/images/content3/2023/04/Depositphotos_178119764_L.jpg" }
];

// Custom Card Component with Notched Border
const LegendCard = ({ legend, onTriggerTransition }) => {
    // Unique IDs for SVG elements
    const pathId = `border-path-${legend.id}`;
    const clipId = `card-clip-${legend.id}`;

    const handleClick = () => {
        if (legend.name === "KOBE BRYANT") {
            onTriggerTransition('/legends/presence/kobe');
        }
    };

    return (
        <div onClick={handleClick} className="relative w-full aspect-square group cursor-pointer">
            {/* SVG Container */}
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 400 400"
                preserveAspectRatio="none"
                className="overflow-visible"
            >
                <defs>
                    {/* 
                        Path Description:
                        Start Top-Left (rounded) -> Top-Right (rounded)
                        -> Down Right Side -> Curve In (Notch Start) -> Curve Down (Notch End) -> Bottom Left (rounded) -> Close
                    */}
                    <path
                        id={pathId}
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
                    />
                    <clipPath id={clipId}>
                        <use href={`#${pathId}`} />
                    </clipPath>
                </defs>

                {/* Background/Image Layer - Clipped to the path */}
                {legend.imageUrl ? (
                    <>
                        {/* Main Image - Fades out on hover if there's a hover image */}
                        <image
                            href={legend.imageUrl}
                            x="0"
                            y="0"
                            width="400"
                            height="400"
                            preserveAspectRatio="xMidYMid slice"
                            clipPath={`url(#${clipId})`}
                            className={`transition-all duration-500 grayscale group-hover:grayscale-0 ${legend.hoverImageUrl ? 'group-hover:opacity-0' : ''}`}
                        />
                        {/* Hover Image - Fades in on hover */}
                        {legend.hoverImageUrl && (
                            <image
                                href={legend.hoverImageUrl}
                                x="0"
                                y="0"
                                width="400"
                                height="400"
                                preserveAspectRatio="xMidYMid slice"
                                clipPath={`url(#${clipId})`}
                                className="transition-all duration-500 opacity-0 group-hover:opacity-100"
                            />
                        )}
                    </>
                ) : (
                    <g clipPath={`url(#${clipId})`}>
                        <rect width="400" height="400" fill="transparent" />
                        <text x="50%" y="50%" textAnchor="middle" dy=".3em" fontSize="20" fill="black" opacity="0.4" letterSpacing="0.1em">
                            PORTRAIT
                        </text>
                    </g>
                )}

                {/* Border Layer - Drawn on top */}
                <use
                    href={`#${pathId}`}
                    fill="none"
                    stroke="#333" // Dark grey border
                    strokeWidth="1.5"
                    className="transition-all duration-300 group-hover:stroke-[#ccff00] group-hover:stroke-[3px]"
                    vectorEffect="non-scaling-stroke"
                />
            </svg>

            <div className="absolute bottom-0 right-1 z-30 flex flex-col items-end text-right pr-0 pb-0 translate-y-1">
                <h3 className="font-sans text-xl font-bold uppercase tracking-tight text-black mb-1 leading-none">
                    {legend.name}
                </h3>
                <p className="font-sans text-lg font-extrabold tracking-tight text-[#ccff00] mt-0 leading-none">
                    {legend.date}
                </p>
            </div>
        </div>
    );
};

export default function LegendsPage({ onOpenMenu, onTriggerTransition }) {
    return (
        <div className="flex flex-col min-h-screen bg-white relative overflow-hidden">
            {/* Background Contour Lines */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <ContourBackground density={2.2} />
            </div>

            {/* Header - Fixed (Logo & Menu) */}
            {/* Logo - Fixed on top (z-300) */}
            <div className="fixed top-0 left-0 w-full px-12 py-10 z-[300] pointer-events-none">
                <div className="pointer-events-auto inline-block">
                    <h1 className="font-sans text-[2.5rem] font-black tracking-[-0.08em] leading-[0.85] m-0 uppercase text-black">
                        ETERNAI<br />
                    </h1>
                </div>
            </div>

            {/* Right Actions - Fixed (z-50) to allow MenuOverlay to cover them */}
            <div className="fixed top-0 left-0 w-full px-12 py-10 z-50 flex justify-end items-start pointer-events-none">
                <div className="pointer-events-auto flex items-center gap-4">
                    <button
                        className="bg-[#ccff00] text-black border-none px-7 h-12 flex items-center justify-center text-sm font-extrabold cursor-pointer rounded-md font-sans tracking-wide shadow-[0_2px_10px_rgba(204,255,0,0.3)] hover:shadow-[0_4px_15px_rgba(204,255,0,0.4)] transition-shadow"
                    >
                        HONOR
                    </button>
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
                        <LegendCard key={legend.id} legend={legend} onTriggerTransition={onTriggerTransition} />
                    ))}
                </div>
            </div>
        </div>
    );
}
