import React, { useState, useEffect } from 'react';

export default function UploadModal({ isOpen, onClose, onComplete, mode = 'wizard', isEditing = false }) {
    // mode: 'wizard' | 'memory' | 'voice' | 'personality'
    const [step, setStep] = useState(1);
    const [isVisible, setIsVisible] = useState(false);

    // Reset step when opening in wizard mode
    useEffect(() => {
        if (isOpen && mode === 'wizard') {
            setStep(1);
        }
    }, [isOpen, mode]);

    // Fade in/out logic
    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            const timer = setTimeout(() => document.body.style.overflow = 'hidden', 0);
            return () => clearTimeout(timer);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 500);
            document.body.style.overflow = '';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible) return null;

    const totalSteps = isEditing ? 3 : 4;
    const nextStep = () => setStep((p) => Math.min(p + 1, totalSteps));
    const prevStep = () => setStep((p) => Math.max(p - 1, 1));

    // Content Switching Logic based on Mode
    const isWizard = mode === 'wizard';

    let title, content, footer;

    if (isWizard) {
        title = (
            <div>
                <h2 className="text-3xl font-serif text-[#2a2a2a] font-medium tracking-wide">
                    {isEditing ? 'Reference Update' : 'Human Reconstruction'}
                </h2>
                <p className="text-[#666] text-sm mt-1 tracking-wider uppercase font-sans">
                    Step {step} of {totalSteps}: {['Identity & Memories', 'Voice', 'Personality', 'Review'][step - 1]}
                </p>
            </div>
        );

        if (step === 1) content = <StepMemories />;
        if (step === 2) content = <StepVoice />;
        if (step === 3) content = <StepPersonality />;
        if (step === 4) content = <StepReview />;

        footer = (
            <div className="px-10 py-6 border-t border-white/30 flex justify-between items-center bg-white/20">
                <button
                    onClick={prevStep}
                    className={`text-[#555] font-medium hover:text-black transition-colors px-4 py-2 ${step === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                >
                    Back
                </button>
                {step < totalSteps ? (
                    <button
                        onClick={nextStep}
                        className="bg-[#2a2a2a] text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                    >
                        Continue
                    </button>
                ) : (
                    <button
                        onClick={() => {
                            if (onComplete) onComplete();
                            onClose();
                        }}
                        className="bg-[#ccff00] text-black px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-[0_0_20px_rgba(204,255,0,0.4)] hover:-translate-y-0.5 transition-all duration-300"
                    >
                        {isEditing ? 'Save Updates' : 'Complete Upload'}
                    </button>
                )}
            </div>
        );
    } else {
        // Specific Modes
        let modeTitle = "";
        let modeContent = null;

        if (mode === 'memory') {
            modeTitle = "Manage Memories";
            modeContent = <StepMemories />;
        } else if (mode === 'voice') {
            modeTitle = "Voice Cloning";
            modeContent = <StepVoice />;
        } else if (mode === 'personality') {
            modeTitle = "Personality Core";
            modeContent = <StepPersonality />;
        }

        title = (
            <div>
                <h2 className="text-3xl font-serif text-[#2a2a2a] font-medium tracking-wide">
                    {modeTitle}
                </h2>
                <p className="text-[#666] text-sm mt-1 tracking-wider uppercase font-sans">
                    Single Upload Mode
                </p>
            </div>
        );
        content = modeContent;
        footer = (
            <div className="px-10 py-6 border-t border-white/30 flex justify-end items-center bg-white/20">
                <button
                    onClick={onClose}
                    className="bg-[#2a2a2a] text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                >
                    Save & Close
                </button>
            </div>
        );
    }

    return (
        <div
            className={`fixed inset-0 z-[1000] flex items-center justify-center p-4 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        >
            {/* Backdrop with Blur */}
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-xl transition-all duration-500"
                onClick={onClose}
            ></div>

            {/* Glass Card */}
            <div
                className={`
                    relative w-full max-w-4xl bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] 
                    border border-white/50 overflow-hidden flex flex-col max-h-[90vh]
                    transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] transform
                    ${isOpen ? 'translate-y-0 scale-100' : 'translate-y-10 scale-95'}
                `}
            >
                {/* Header */}
                <div className="px-10 py-8 border-b border-white/30 flex justify-between items-center bg-white/20">
                    {title}

                    {/* Progress Dots (Only for Wizard) */}
                    {isWizard && (
                        <div className="flex gap-2">
                            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((i) => (
                                <div
                                    key={i}
                                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i <= step ? 'bg-[#2a2a2a]' : 'bg-[#ccc]'}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-10 font-sans">
                    {content}
                </div>

                {/* Footer Navigation */}
                {footer}
            </div>
        </div>
    );
}

// --- Steps Components ---

function StepMemories() {
    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Integrated Identity Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputGroup label="Full Name of Loved One" placeholder="e.g. Eleanor Rigby" />
                <InputGroup label="Relationship" placeholder="e.g. Grandmother" />
                <InputGroup label="Date of Birth" type="date" />
                <InputGroup label="Date of Passing" type="date" />
            </div>

            <div className="bg-white/40 p-8 rounded-2xl border border-white/50 text-center hover:bg-white/50 transition-colors cursor-pointer group">
                <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-[#999]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
                <h3 className="text-lg font-medium text-[#444]">Profile Photo</h3>
                <p className="text-sm text-[#888] mt-1">Drag and drop or click to upload</p>
            </div>

            <hr className="border-white/40 my-6" />

            {/* Original Memories Fields */}
            <InputGroup label="Chat History / Letters" type="file" help="Upload PDF, TXT, or JSON exports of conversations." />

            <div className="space-y-4">
                <h3 className="text-lg font-medium text-[#444]">Photo Gallery</h3>
                <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="aspect-square bg-white/40 rounded-xl border border-white/50 flex items-center justify-center cursor-pointer hover:bg-white/60 transition-colors">
                            <span className="text-2xl text-[#ccc]">+</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function StepVoice() {
    return (
        <div className="space-y-8 animate-fade-in-up">
            <InputGroup label="Voice Samples" type="file" multiple help="Upload clear audio clips for voice cloning (MP3, WAV)." />
            <div className="p-6 bg-white/40 rounded-xl border border-white/50 text-[#666] text-sm leading-relaxed">
                Tip: High-quality, isolated vocals work best. Avoid background noise.
            </div>
        </div>
    );
}

function StepPersonality() {
    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-3">
                <label className="block text-sm font-medium text-[#555] uppercase tracking-wide">
                    Personality Notes & Core Memories
                </label>
                <textarea
                    className="w-full h-80 bg-white/50 border border-white/50 rounded-xl p-4 focus:ring-2 focus:ring-[#2a2a2a]/20 focus:border-[#2a2a2a]/30 focus:bg-white/80 transition-all outline-none resize-none text-[#333] placeholder-[#999]"
                    placeholder="Describe their personality, mannerisms, favorite phrases, or specific memories you want to preserve..."
                ></textarea>
            </div>
        </div>
    );
}

function StepReview() {
    return (
        <div className="space-y-8 animate-fade-in-up text-center py-10">
            <div className="w-24 h-24 bg-[#ccff00]/20 rounded-full mx-auto flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-[#556b00]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"></path></svg>
            </div>

            <h3 className="text-2xl font-serif text-[#2a2a2a]">Ready to Reconstruct</h3>
            <p className="text-[#666] max-w-md mx-auto leading-relaxed">
                We have collected the necessary data to begin the digital reconstruction process.
                Please review your inputs before final submission.
            </p>

            <div className="bg-white/40 rounded-xl p-6 max-w-lg mx-auto text-left border border-white/50 space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-black/5">
                    <span className="text-[#888]">Identity & Memories</span>
                    <span className="text-[#333] font-medium">Completed</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-black/5">
                    <span className="text-[#888]">Voice Model</span>
                    <span className="text-[#333] font-medium">Ready</span>
                </div>
                <div className="flex justify-between items-center py-2">
                    <span className="text-[#888]">Personality</span>
                    <span className="text-[#333] font-medium">Added</span>
                </div>
            </div>
        </div>
    );
}

// --- Helper Components ---

function InputGroup({ label, type = "text", placeholder, help, multiple }) {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-[#555] uppercase tracking-wide">
                {label}
            </label>
            {type === 'file' ? (
                <div className="bg-white/40 border-2 border-dashed border-white/50 rounded-xl p-6 text-center transition-colors hover:bg-white/50 cursor-pointer">
                    <span className="text-sm text-[#777]">{placeholder || (multiple ? "Choose files to upload" : "Choose a file to upload")}</span>
                    <input type="file" className="hidden" multiple={multiple} />
                </div>
            ) : (
                <input
                    type={type}
                    className="w-full bg-white/50 border border-white/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#2a2a2a]/20 focus:border-[#2a2a2a]/30 focus:bg-white/80 transition-all outline-none text-[#333] placeholder-[#999]"
                    placeholder={placeholder}
                />
            )}
            {help && <p className="text-xs text-[#888]">{help}</p>}
        </div>
    );
}
