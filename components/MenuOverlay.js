import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ContourBackground from './ContourBackground';

/**
 * A full-screen overlay menu component with animated transitions and image previews.
 * Displays navigation links and interactive visual elements.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the menu overlay is currently open.
 * @param {Function} props.onClose - Callback function to close the menu.
 * @param {string} [props.defaultActiveItem='HOME'] - The label of the menu item to be active by default.
 */
export default function MenuOverlay({ isOpen, onClose, defaultActiveItem = 'HOME' }) {
    const menuItems = [
        { label: 'HOME', href: '/landing' },
        { label: 'REMEMBRANCE', href: '/upload' },
        { label: 'PRESENCE', href: '#' },
        { label: 'SERENITY', href: '#' }
    ];
    const [mouseY, setMouseY] = useState(0);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    // Find the index of the default active item
    const defaultActiveIndex = menuItems.findIndex(item => item.label === defaultActiveItem);

    // Determine which index is currently "active" for image highlighting
    // Priority: Hovered item > Default active item
    const activeIndex = hoveredIndex !== null ? hoveredIndex : defaultActiveIndex;

    useEffect(() => {
        const handleMouseMove = (e) => {
            // Normalize mouseY from -1 to 1
            const y = (e.clientY / window.innerHeight) * 2 - 1;
            setMouseY(y);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div
            className={`fixed inset-0 bg-[#1a1c1a] z-[200] flex flex-col md:flex-row transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] overflow-hidden ${isOpen ? 'translate-y-0 rounded-b-none' : '-translate-y-full rounded-b-[100%]'
                }`}
        >
            {/* Background Contours (Darker & Static) */}
            <div className="absolute inset-0 pointer-events-none">
                <ContourBackground color="#ffffff" isStatic={true} thickness={0.03} opacity={0.2} density={2.2} />
            </div>

            {/* Close Button (Top Right) */}
            <button
                onClick={onClose}
                className={`absolute top-6 right-6 md:top-10 md:right-12 w-12 h-12 bg-[#ccff00] flex justify-center items-center cursor-pointer rounded-md z-50 hover:scale-105 transition-all duration-500 delay-200 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                    }`}
            >
                <div className="relative w-6 h-6">
                    <div className="absolute top-1/2 left-0 w-full h-[2px] bg-black -translate-y-1/2 rotate-45"></div>
                    <div className="absolute top-1/2 left-0 w-full h-[2px] bg-black -translate-y-1/2 -rotate-45"></div>
                </div>
            </button>

            {/* Left Side - Image Grid */}
            <div className={`w-full h-1/2 md:w-1/2 md:h-full p-4 md:p-8 flex gap-4 md:gap-12 relative z-10 transition-all duration-1000 delay-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-20'
                }`}>
                {/* Column 1 (Left) - Moves UP when mouse moves DOWN */}
                <div
                    className="flex-1 flex flex-col justify-center gap-4 md:gap-12 transition-transform duration-100 ease-linear will-change-transform"
                    style={{ transform: `translateY(${-mouseY * 10}vh)` }}
                >
                    {[2, 4].map((i) => {
                        const isHighlighted = (activeIndex + 1) === i;
                        return (
                            <div key={i} className="relative w-full aspect-square overflow-hidden rounded-lg bg-[#2a2c2a]">
                                <Image
                                    src={`/memory${i}.jpg`}
                                    alt={`Memory ${i}`}
                                    fill
                                    className={`object-cover transition-all duration-700 ${isHighlighted
                                        ? 'opacity-100 grayscale-0 mix-blend-normal scale-110'
                                        : 'opacity-60 grayscale mix-blend-luminosity hover:scale-110'
                                        }`}
                                />
                                <div className={`absolute inset-0 bg-[#ccff00] mix-blend-overlay transition-opacity duration-700 ${isHighlighted ? 'opacity-0' : 'opacity-10'
                                    }`}></div>
                            </div>
                        );
                    })}
                </div>

                {/* Column 2 (Right) - Moves DOWN when mouse moves DOWN */}
                <div
                    className="flex-1 flex flex-col justify-center gap-4 md:gap-12 transition-transform duration-100 ease-linear will-change-transform"
                    style={{ transform: `translateY(${mouseY * 10}vh)` }}
                >
                    {[1, 3].map((i) => {
                        const isHighlighted = (activeIndex + 1) === i;
                        return (
                            <div key={i} className="relative w-full aspect-square overflow-hidden rounded-lg bg-[#2a2c2a]">
                                <Image
                                    src={`/memory${i}.jpg`}
                                    alt={`Memory ${i}`}
                                    fill
                                    className={`object-cover transition-all duration-700 ${isHighlighted
                                        ? 'opacity-100 grayscale-0 mix-blend-normal scale-110'
                                        : 'opacity-60 grayscale mix-blend-luminosity hover:scale-110'
                                        }`}
                                />
                                <div className={`absolute inset-0 bg-[#ccff00] mix-blend-overlay transition-opacity duration-700 ${isHighlighted ? 'opacity-0' : 'opacity-10'
                                    }`}></div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Right Side - Navigation */}
            <div className="w-full h-1/2 md:w-1/2 md:h-full flex flex-col justify-center items-center relative z-10 text-[#e0e0e0]">
                <nav className="flex flex-col items-center gap-6 mb-0 md:mb-20">
                    {menuItems.map((item, index) => {
                        const isActive = item.label === defaultActiveItem;
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                className={`font-sans text-[3rem] md:text-[5rem] font-black tracking-tighter leading-[0.9] transition-all duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)] uppercase relative group text-center ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-20'
                                    } ${isActive
                                        ? 'text-[#4a5a4a] pointer-events-none'
                                        : 'text-[#e0e0e0]'
                                    }`}
                                style={{ transitionDelay: isOpen ? `${600 + index * 100}ms` : '500ms' }}
                            >
                                <span className="transition-colors duration-0 group-hover:text-[#ccff00]">
                                    {item.label}
                                </span>
                                {/* Wavy line effect for Home (or active item) */}
                                {isActive && (
                                    <svg className="absolute top-1/2 left-0 w-full h-4 -translate-y-1/2 pointer-events-none opacity-100 transition-opacity" viewBox="0 0 100 10" preserveAspectRatio="none">
                                        <path d="M0 5 Q 10 0, 20 5 T 40 5 T 60 5 T 80 5 T 100 5" stroke="#ccff00" strokeWidth="2" fill="none" />
                                    </svg>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
