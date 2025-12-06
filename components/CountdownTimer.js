import React, { useState, useEffect } from 'react';

export default function CountdownTimer({
    initialDays = 0,
    initialHours = 12,
    initialMinutes = 28,
    initialSeconds = 8,
    overlayText = "Cooking",
    label = "NEXT ACTIVITIES BEGINS IN..."
}) {
    const [timeLeft, setTimeLeft] = useState({
        days: initialDays,
        hours: initialHours,
        minutes: initialMinutes,
        seconds: initialSeconds
    });

    useEffect(() => {
        // Set target date based on props
        const now = new Date();
        const targetDate = new Date(now.getTime() +
            (initialDays * 24 * 60 * 60 * 1000) +
            (initialHours * 60 * 60 * 1000) +
            (initialMinutes * 60 * 1000) +
            (initialSeconds * 1000));

        const interval = setInterval(() => {
            const currentTime = new Date();
            const difference = targetDate - currentTime;

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            } else {
                clearInterval(interval);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [initialDays, initialHours, initialMinutes, initialSeconds]);

    // Format numbers to always be 2 digits
    const formatNumber = (num) => String(num).padStart(2, '0');

    return (
        <div className="w-full bg-transparent py-32 px-6 relative overflow-hidden">
            <div className="max-w-[1400px] mx-auto text-center relative z-10">
                {/* Top Label */}
                <p className="font-sans text-black text-sm md:text-base font-bold tracking-[0.2em] uppercase mb-12">
                    {label}
                </p>

                {/* Main Countdown Container */}
                <div className="relative inline-block mt-4">
                    {/* The Numbers */}
                    <h2 className="font-sans text-[12vw] md:text-[8rem] font-bold leading-none tracking-tight text-black font-mono">
                        {formatNumber(timeLeft.days)}<span className="text-4xl text-zinc-400 mx-2 align-top">D</span>
                        {formatNumber(timeLeft.hours)}<span className="text-4xl text-zinc-400 mx-2 align-top">H</span>
                        {formatNumber(timeLeft.minutes)}<span className="text-4xl text-zinc-400 mx-2 align-top">M</span>
                        {formatNumber(timeLeft.seconds)}<span className="text-4xl text-zinc-400 mx-2 align-top">S</span>
                    </h2>

                    {/* Overlay Text */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full rotate-[-5deg] pointer-events-none z-20">
                        <span className="font-serif italic text-[15vw] md:text-[10rem] text-[#ccff00] leading-none opacity-90 block" style={{ fontFamily: '"Brush Script MT", cursive', textShadow: '2px 2px 4px rgba(0,0,0,0.1), -1px -1px 0 rgba(0,0,0,0.1)' }}>
                            {overlayText}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
