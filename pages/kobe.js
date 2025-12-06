import React, { useState, useRef, useEffect } from 'react';
import ContourBackground from '../components/ContourBackground';

export default function KobePage({ onOpenMenu }) {
    const [hoveredCardId, setHoveredCardId] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const videoRefs = useRef({});

    // Mock data for the fan cards
    const cards = [
        {
            id: 1,
            type: 'image',
            src: 'https://cdn.artphotolimited.com/images/59888232b0ba742a2efde168/1000x1000/kobe-bryant-fevrier-2011.jpg',
            rotate: '-rotate-12',
            translateY: 'translate-y-12',
            zIndex: 'z-10'
        },
        {
            id: 2,
            type: 'video',
            src: '/Debate.mp4',
            rotate: '-rotate-6',
            translateY: 'translate-y-4',
            zIndex: 'z-20'
        },
        {
            id: 3,
            type: 'video',
            src: '/KobeGame.mp4',
            rotate: 'rotate-0',
            translateY: 'translate-y-0',
            zIndex: 'z-30'
        },
        {
            id: 4,
            type: 'image',
            src: 'https://media-cldnry.s-nbcnews.com/image/upload/t_fit-760w,f_auto,q_auto:best/newscms/2016_15/1494926/ss-160413-kobe-bryant-mn-13.jpg',
            rotate: 'rotate-6',
            translateY: 'translate-y-4',
            zIndex: 'z-20'
        },
        {
            id: 5,
            type: 'image',
            src: 'https://cdn.artphotolimited.com/images/59888232b0ba742a2efde168/1000x1000/kobe-bryant-fevrier-2011.jpg',
            rotate: 'rotate-12',
            translateY: 'translate-y-12',
            zIndex: 'z-10'
        }
    ];

    const handleMouseEnter = (id) => {
        setHoveredCardId(id);
        setIsMuted(false); // Auto-unmute on hover
    };

    const handleMouseLeave = () => {
        setHoveredCardId(null);
        setIsMuted(true); // Mute when leaving
    };

    const toggleMute = (e) => {
        e.stopPropagation();
        setIsMuted(!isMuted);
    };

    useEffect(() => {
        // Handle video playback based on hover state
        Object.entries(videoRefs.current).forEach(([id, video]) => {
            if (!video) return;

            const cardId = parseInt(id);
            if (hoveredCardId === cardId) {
                // Try to play unmuted first
                video.muted = false;
                video.currentTime = 0;
                const playPromise = video.play();

                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.log("Autoplay prevented:", error);
                        // Fallback: play muted
                        video.muted = true;
                        setIsMuted(true);
                        video.play();
                    });
                }
            } else {
                video.pause();
                video.currentTime = 0;
            }
        });
    }, [hoveredCardId]);

    // Update mute state when isMuted changes
    useEffect(() => {
        if (hoveredCardId && videoRefs.current[hoveredCardId]) {
            videoRefs.current[hoveredCardId].muted = isMuted;
        }
    }, [isMuted, hoveredCardId]);

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
            <div className="relative z-10 w-full flex-grow flex flex-col justify-center items-center pt-20 pb-10">
                {/* Title */}
                <div className={`text-center mb-16 relative z-20 transition-opacity duration-300 ${hoveredCardId ? 'opacity-0' : 'opacity-100'}`}>
                    <h2 className="font-serif text-[5rem] leading-[0.9] font-normal tracking-tight text-black">
                        WHAT'S UP<br />
                        <span className="italic font-light">ON SOCIALS</span>
                    </h2>
                </div>

                {/* Fan Cards Container */}
                <div className="relative flex justify-center items-center h-[500px] w-full max-w-6xl mx-auto perspective-1000">
                    <div className="flex justify-center items-end -space-x-16 md:-space-x-24">
                        {cards.map((card) => {
                            const isHovered = hoveredCardId === card.id;
                            const isVideo = card.type === 'video';

                            return (
                                <div
                                    key={card.id}
                                    onMouseEnter={() => handleMouseEnter(card.id)}
                                    onMouseLeave={handleMouseLeave}
                                    className={`
                                        relative 
                                        transition-all duration-500 ease-out 
                                        ${isHovered
                                            ? 'w-[600px] aspect-video z-50 rotate-0 translate-y-[-100px] scale-110 shadow-[0_30px_60px_rgba(0,0,0,0.5)]'
                                            : `w-[200px] md:w-[280px] aspect-[9/16] ${card.rotate} ${card.translateY} ${card.zIndex} hover:z-40 shadow-2xl`
                                        }
                                        rounded-3xl overflow-hidden border-[4px] border-white
                                        group cursor-pointer bg-black
                                    `}
                                    style={{
                                        transformOrigin: 'bottom center'
                                    }}
                                >
                                    {isVideo ? (
                                        <>
                                            <video
                                                ref={el => videoRefs.current[card.id] = el}
                                                src={card.src}
                                                className={`w-full h-full object-cover transition-opacity ${isHovered ? 'opacity-100' : 'opacity-90'}`}
                                                loop
                                                playsInline
                                            // Removed autoPlay and muted props to let useEffect handle it
                                            />
                                            {isHovered && (
                                                <button
                                                    onClick={toggleMute}
                                                    className="absolute bottom-6 right-6 z-50 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm transition-all"
                                                >
                                                    {isMuted ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                                                        </svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                                                        </svg>
                                                    )}
                                                </button>
                                            )}
                                        </>
                                    ) : (
                                        <img
                                            src={card.src}
                                            alt="Social Media Post"
                                            className={`w-full h-full object-cover transition-opacity ${isHovered ? 'opacity-100' : 'opacity-90'}`}
                                        />
                                    )}

                                    {/* Overlay Gradient - fade out on hover */}
                                    <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 pointer-events-none transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}></div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
