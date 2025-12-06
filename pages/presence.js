import React, { useState, useEffect, useRef } from 'react';
import ContourBackground from '../components/ContourBackground';



export default function PresencePage({ onOpenMenu, onTriggerTransition }) {
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [currentVideo, setCurrentVideo] = useState('/Q1.mp4');
    const [hasStarted, setHasStarted] = useState(false);
    const [showInvitation, setShowInvitation] = useState(false);
    const videoRefs = useRef({});
    const videos = ['/Q1.mp4', '/Q2.mp4', '/Q3.mp4', '/Q4.mp4'];

    const handleVoiceClick = () => {
        setIsRecording(!isRecording);
    };

    const handleVideoEnd = (src) => {
        if (src === '/Q3.mp4') {
            setTimeout(() => {
                setShowInvitation(true);
            }, 2000);
        }
    };

    const handleInvitationResponse = (response) => {
        setShowInvitation(false);
        if (response === 'yes') {
            setCurrentVideo('/Q4.mp4');
            if (videoRefs.current['/Q4.mp4']) {
                videoRefs.current['/Q4.mp4'].currentTime = 0;
                videoRefs.current['/Q4.mp4'].play().catch(e => console.log("Play failed", e));
            }
        }
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (['1', '2', '3'].includes(e.key)) {
                setHasStarted(true);

                let nextVideo = '';
                if (e.key === '1') nextVideo = '/Q1.mp4';
                if (e.key === '2') nextVideo = '/Q2.mp4';
                if (e.key === '3') nextVideo = '/Q3.mp4';

                if (nextVideo) {
                    setCurrentVideo(nextVideo);
                    // Play the new video immediately
                    if (videoRefs.current[nextVideo]) {
                        videoRefs.current[nextVideo].currentTime = 0;
                        videoRefs.current[nextVideo].play().catch(e => console.log("Play failed", e));
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        // Pause other videos when current changes
        videos.forEach(src => {
            if (src !== currentVideo && videoRefs.current[src]) {
                videoRefs.current[src].pause();
                videoRefs.current[src].currentTime = 0;
            }
        });

        // Ensure current video plays if started
        if (hasStarted && videoRefs.current[currentVideo]) {
            videoRefs.current[currentVideo].play().catch(e => console.log("Play failed", e));
        }
    }, [currentVideo, hasStarted]);

    return (
        <div className="flex flex-col min-h-screen bg-black relative overflow-hidden font-sans">
            {/* Background Contour Lines - lighter opacity for this design */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
                <ContourBackground density={2.2} />
            </div>

            {/* Background Videos */}
            <div className="fixed inset-0 z-[1] pointer-events-none bg-black">
                {videos.map((src) => (
                    <video
                        key={src}
                        ref={el => videoRefs.current[src] = el}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-0 ${currentVideo === src ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                        playsInline
                        onEnded={() => handleVideoEnd(src)}
                    >
                        <source src={src} type="video/mp4" />
                    </video>
                ))}
            </div>

            {/* Logo - Fixed on top (z-300) */}
            {!isFullScreen && (
                <div className="absolute top-0 left-0 w-full px-12 py-10 pointer-events-none z-[300]">
                    <div className="pointer-events-auto inline-block">
                        <h1
                            className={`font-sans text-[2.5rem] font-black tracking-[-0.08em] leading-[0.85] m-0 uppercase transition-colors duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] text-black`}
                        >
                            ETERNAI<br />
                        </h1>
                    </div>
                </div>
            )}

            {/* Invitation Popup */}
            {showInvitation && (
                <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl max-w-md text-center transform transition-all scale-100">
                        <h3 className="text-2xl font-bold text-white mb-6 drop-shadow-md">
                            Do you want to go to the beach together?
                        </h3>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => handleInvitationResponse('yes')}
                                className="px-8 py-3 bg-[#ccff00] text-black font-bold rounded-full hover:bg-[#b3e600] transition-colors shadow-lg"
                            >
                                Yes
                            </button>
                            <button
                                onClick={() => handleInvitationResponse('no')}
                                className="px-8 py-3 bg-white/20 text-white font-bold rounded-full hover:bg-white/30 transition-colors shadow-lg backdrop-blur-sm"
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header Buttons (z-50) */}
            {!isFullScreen && (
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
            )}

            {/* Main Content */}
            <div className="relative z-10 w-full flex-grow flex flex-col justify-center pt-24 pb-0">

                {/* Input Bar */}
                <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 w-full max-w-xl px-4 z-50">
                    <div className="relative flex items-center w-full bg-white/10 backdrop-blur-md border border-black/10 rounded-full shadow-lg transition-all focus-within:bg-white/20 focus-within:border-black/30">
                        {/* Voice Message Button */}
                        <button
                            onClick={handleVoiceClick}
                            className={`p-4 transition-all rounded-full focus:outline-none ${isRecording ? 'text-red-500 bg-red-500/10 animate-pulse' : 'text-black/60 hover:text-black'}`}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill={isRecording ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                                <line x1="12" y1="19" x2="12" y2="23"></line>
                                <line x1="8" y1="23" x2="16" y2="23"></line>
                            </svg>
                        </button>

                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-grow bg-transparent border-none py-4 text-lg focus:outline-none placeholder:text-black/40 text-black px-2"
                        />

                        {/* Send Button */}
                        <button className="p-4 text-black/60 hover:text-black transition-colors rounded-full focus:outline-none">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
