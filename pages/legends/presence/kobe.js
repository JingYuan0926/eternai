import React, { useState } from 'react';
import ContourBackground from '../../../components/ContourBackground';
import SerenityRecentActivities from '../../../components/SerenityRecentActivities';
import SerenityCareerHighlights from '../../../components/SerenityCareerHighlights';
import SerenityCountdownTimer from '../../../components/SerenityCountdownTimer';

export default function PresencePage({ onOpenMenu, onTriggerTransition }) {
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isRecording, setIsRecording] = useState(false);

    const handleVoiceClick = () => {
        setIsRecording(!isRecording);
    };

    return (
        <div className="flex flex-col min-h-screen bg-white relative overflow-hidden font-sans">
            {/* Background Contour Lines - lighter opacity for this design */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
                <ContourBackground density={2.2} />
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

            {/* Center Title - Presence (Placeholder Data) */}
            {!isFullScreen && (
                <div className="absolute top-0 left-0 w-full h-[120px] flex justify-center items-center pointer-events-none z-[250]">
                    <h2 className="text-[#ccff00] text-5xl md:text-7xl transform -rotate-2 opacity-90" style={{ fontFamily: '"Brush Script MT", cursive', textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>
                        Presence
                    </h2>
                </div>
            )}

            {/* Header Buttons (z-50) */}
            {!isFullScreen && (
                <div className="absolute top-0 left-0 w-full px-12 py-10 flex justify-end items-start z-50 pointer-events-none">
                    {/* Top Right Buttons */}
                    <div className="pointer-events-auto flex gap-4 items-center">
                        <button
                            onClick={() => onTriggerTransition('/legends/serenity/kobe')}
                            className="bg-[#ccff00] text-black border-none px-6 h-12 flex justify-center items-center cursor-pointer rounded-md font-sans font-bold text-sm tracking-wider shadow-[0_2px_10px_rgba(204,255,0,0.3)] hover:shadow-[0_4px_15px_rgba(204,255,0,0.4)] transition-shadow"
                        >
                            SERENITY
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
            )}

            {/* Main Content */}
            <div className="relative z-10 w-full flex-grow flex flex-col justify-center pt-24 pb-0">
                {/* Main Content - Kobe Image */}
                <div className="flex-grow flex items-end justify-center pb-0">
                    <img
                        src="/kobe.png"
                        alt="Kobe Bryant"
                        className="h-[85vh] object-contain drop-shadow-2xl"
                    />
                </div>

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
