import Image from 'next/image';
import React, { useState } from 'react';
import SplashCursor from '../components/SplashCursor';
import ContourBackground from '../components/ContourBackground';
// MenuOverlay global
import UploadModal from '../components/UploadModal';

export default function UploadPage({ onOpenMenu }) {
    // const [isMenuOpen, setIsMenuOpen] = useState(false); // Global
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadMode, setUploadMode] = useState('wizard'); // 'wizard', 'memory', 'voice', 'personality'
    const [activeZone, setActiveZone] = useState(null); // 'memory', 'voice', 'personality', or null
    const [isReconstructed, setIsReconstructed] = useState(false);

    const openModal = (mode) => {
        setUploadMode(mode);
        setIsUploadModalOpen(true);
    };

    const getSkeletonImage = () => {
        switch (activeZone) {
            case 'memory': return '/skeleton-memory.png';
            case 'voice': return '/skeleton-voice.png';
            case 'personality': return '/skeleton-personality.png';
            default: return '/skeleton.png';
        }
    };

    return (
        <div className="flex justify-center items-end min-h-screen bg-white relative overflow-hidden">
            {/* MenuOverlay Global */}
            <UploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                mode={uploadMode}
                onComplete={() => setIsReconstructed(true)}
                isEditing={isReconstructed}
            />

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

            {/* Background Contour Lines */}
            <div className="absolute inset-0 z-0">
                <ContourBackground density={2.2} />
            </div>

            {/* Bottom Right Button */}
            <div className="absolute bottom-0 right-0 px-12 py-10 z-50 pointer-events-none flex flex-col items-end gap-3">
                {isReconstructed ? (
                    <>
                        <button
                            onClick={() => setIsReconstructed(false)}
                            className="pointer-events-auto bg-[#1a1c1a] text-white border-none px-7 h-12 flex items-center justify-center text-sm font-bold cursor-pointer rounded-md font-sans tracking-wide shadow-lg hover:scale-105 transition-transform"
                        >
                            DELETE DATA
                        </button>
                        <button
                            onClick={() => openModal('wizard')}
                            className="pointer-events-auto bg-[#ccff00] text-black border-none px-7 h-12 flex items-center justify-center text-sm font-extrabold cursor-pointer rounded-md font-sans tracking-wide shadow-[0_2px_10px_rgba(204,255,0,0.3)] hover:shadow-[0_4px_15px_rgba(204,255,0,0.4)] transition-shadow"
                        >
                            EDIT HUMAN
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => openModal('wizard')}
                        className="pointer-events-auto bg-[#ccff00] text-black border-none px-7 h-12 flex items-center justify-center text-sm font-extrabold cursor-pointer rounded-md font-sans tracking-wide shadow-[0_2px_10px_rgba(204,255,0,0.3)] hover:shadow-[0_4px_15px_rgba(204,255,0,0.4)] transition-shadow"
                    >
                        UPLOAD 0/3
                    </button>
                )}
            </div>

            <div className="w-full h-[95vh] relative z-10 max-w-[95vw]">
                <SplashCursor>
                    {(isHovering) => (
                        <>
                            {/* State 1: Interactive Skeleton (Not Reconstructed) */}
                            <Image
                                src={getSkeletonImage()}
                                alt="Skeleton"
                                fill
                                sizes="(max-width: 768px) 100vw, 90vw"
                                priority
                                className={`object-cover md:object-contain object-bottom absolute inset-0 pointer-events-none transition-opacity duration-1000 ${isReconstructed ? 'opacity-0' : 'opacity-100'}`}
                            />

                            {/* State 2: Reconstructed (Reveal Effect) */}
                            {/* Human Image - Inverse Mask (Visible everywhere EXCEPT cursor) */}
                            <Image
                                src="/human.png"
                                alt="Human"
                                fill
                                sizes="(max-width: 768px) 100vw, 90vw"
                                priority
                                className={`object-cover md:object-contain object-bottom absolute inset-0 pointer-events-none ${isReconstructed ? 'opacity-100' : 'opacity-0'}`}
                                style={{
                                    mask: isReconstructed ? 'url(#splash-mask-inverse)' : 'none',
                                    WebkitMask: isReconstructed ? 'url(#splash-mask-inverse)' : 'none',
                                    clipPath: isReconstructed ? 'inset(0 0 0 0)' : 'inset(100% 0 0 0)',
                                    transition: 'clip-path 2.5s ease-in-out, opacity 1s',
                                }}
                            />

                            {/* Scanner Line Effect */}
                            <div
                                className={`absolute left-0 w-full h-[2px] bg-[#ccff00] shadow-[0_0_15px_#ccff00] pointer-events-none transition-all duration-[2500ms] ease-in-out z-20 ${isReconstructed ? 'top-0 opacity-0' : 'top-[100%] opacity-100'}`}
                                style={{
                                    transitionDelay: isReconstructed ? '0ms' : '0ms',
                                    // Fade out quickly at the end
                                    opacity: isReconstructed ? 0 : 1,
                                    transitionProperty: 'top, opacity',
                                    transitionDuration: '2500ms, 500ms',
                                    transitionDelay: '0ms, 2000ms' // Delay fade out until near end
                                }}
                            />

                            {/* Skeleton Image - Positive Mask (Visible ONLY in cursor) */}
                            <Image
                                src="/skeleton.png"
                                alt="Skeleton Reveal"
                                fill
                                sizes="(max-width: 768px) 100vw, 90vw"
                                priority
                                className={`object-cover md:object-contain object-bottom absolute inset-0 pointer-events-none transition-opacity duration-1000 ${isReconstructed ? 'opacity-100' : 'opacity-0'}`}
                                style={{
                                    mask: isReconstructed ? 'url(#splash-mask)' : 'none',
                                    WebkitMask: isReconstructed ? 'url(#splash-mask)' : 'none',
                                    clipPath: isReconstructed ? 'inset(0 0 0 0)' : 'inset(100% 0 0 0)', // Sync with Human
                                    transition: 'clip-path 2.5s ease-in-out, opacity 1s',
                                }}
                            />

                            {/* Interaction Zones Layer - Only Active when NOT reconstructed */}
                            {!isReconstructed && (
                                <div className="absolute inset-0 z-20 w-full h-full">
                                    {/* Zone container: Match the image's object-contain/bottom alignment approximately */}
                                    {/* Since object-fit is contain, we need to center the zones. 
                                    Assuming mostly vertical skeleton in center. 
                                    These percentages are estimates based on standard human proportion in the image. 
                                */}
                                    <div className="relative w-full h-full max-w-[50vh] mx-auto md:max-w-[60vh]">
                                        {/* These widths allow the zones to be roughly over the skeleton body in the center */}

                                        {/* Head Zone (Memory) */}
                                        <div
                                            className="absolute cursor-pointer"
                                            style={{
                                                top: '10%',
                                                left: '25%',
                                                width: '55%',
                                                height: '46%'
                                            }} // Positioning
                                            onMouseEnter={() => setActiveZone('memory')}
                                            onMouseLeave={() => setActiveZone(null)}
                                            onClick={() => openModal('memory')}
                                            title="Memory"
                                        />

                                        {/* Throat Zone (Voice) */}
                                        <div
                                            className="absolute cursor-pointer"
                                            style={{
                                                top: '60%',
                                                left: '33%',
                                                width: '35%',
                                                height: '16%'
                                            }} // Positioning
                                            onMouseEnter={() => setActiveZone('voice')}
                                            onMouseLeave={() => setActiveZone(null)}
                                            onClick={() => openModal('voice')}
                                            title="Voice"
                                        />

                                        {/* Chest/Ribcage Zone (Personality) */}
                                        <div
                                            className="absolute cursor-pointer"
                                            style={{
                                                top: '80%',
                                                left: '13%',
                                                width: '80%',
                                                height: '25%'
                                            }} // Positioning
                                            onMouseEnter={() => setActiveZone('personality')}
                                            onMouseLeave={() => setActiveZone(null)}
                                            onClick={() => openModal('personality')}
                                            title="Personality"
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </SplashCursor>
            </div>
        </div>
    );
}
