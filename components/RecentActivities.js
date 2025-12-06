import React, { useState, useRef } from 'react';

const activitiesData = [
    {
        id: 1,
        category: 'DEBATE',
        event: 'CHARLIE KIRK',
        date: '9 NOV 25',
        result: 'WIN',
        mediaType: 'video',
        src: '/Debate.mp4'
    },
    {
        id: 2,
        category: 'STREAM',
        event: 'NBA 2K25',
        date: '6 JUL 25',
        result: 'WIN',
        mediaType: 'video',
        src: '/KobeGame.mp4'
    },
    {
        id: 3,
        category: 'PODCAST',
        event: 'JOE ROGAN',
        date: '25 MAY 25',
        result: 'LIVE',
        mediaType: 'image',
        src: 'https://media-cldnry.s-nbcnews.com/image/upload/t_fit-760w,f_auto,q_auto:best/newscms/2016_15/1494926/ss-160413-kobe-bryant-mn-13.jpg'
    },
    {
        id: 4,
        category: 'CHARITY',
        event: 'MAMBA FOUNDATION',
        date: '16 MAR 25',
        result: 'DONE',
        mediaType: 'image',
        src: 'https://cdn.artphotolimited.com/images/59888232b0ba742a2efde168/1000x1000/kobe-bryant-fevrier-2011.jpg'
    },
    {
        id: 5,
        category: 'TRAINING',
        event: 'MAMBA ACADEMY',
        date: '8 DEC 24',
        result: 'OPEN',
        mediaType: 'image',
        src: 'https://cdn.artphotolimited.com/images/59888232b0ba742a2efde168/1000x1000/kobe-bryant-fevrier-2011.jpg'
    }
];

export default function RecentActivities() {
    const [hoveredId, setHoveredId] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const videoRefs = useRef({});
    const previewVideoRef = useRef(null);

    const handleMouseMove = (e) => {
        setCursorPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = (id) => {
        setHoveredId(id);
        const video = videoRefs.current[id];
        if (video) {
            video.currentTime = 0;
            video.play().catch(e => console.log("Autoplay blocked", e));
        }
    };

    const handleMouseLeave = (id) => {
        setHoveredId(null);
        const video = videoRefs.current[id];
        if (video) {
            video.pause();
        }
    };

    const handleClick = (id) => {
        if (selectedId === id) {
            setSelectedId(null); // Deselect if already selected
        } else {
            setSelectedId(id); // Select new item
        }
    };

    const hoveredItem = activitiesData.find(item => item.id === hoveredId);
    const selectedItem = activitiesData.find(item => item.id === selectedId);

    return (
        <div
            className="w-full max-w-[1400px] mx-auto px-6 pt-12 pb-20 font-sans text-black relative z-20"
            onMouseMove={handleMouseMove}
        >
            {/* Full Screen Overlay */}
            {selectedItem && (
                <div
                    className="fixed inset-0 z-[100] bg-black flex justify-center items-center cursor-pointer"
                    onClick={() => setSelectedId(null)}
                >
                    {selectedItem.mediaType === 'video' ? (
                        <video
                            src={selectedItem.src}
                            className="w-full h-full object-contain"
                            autoPlay
                            controls
                            playsInline
                        />
                    ) : (
                        <img
                            src={selectedItem.src}
                            className="w-full h-full object-contain"
                            alt=""
                        />
                    )}
                </div>
            )}

            {/* Floating Preview (Only show if nothing is selected) */}
            {!selectedId && (
                <div
                    className="fixed pointer-events-none z-50 overflow-hidden rounded-lg shadow-2xl transition-opacity duration-300"
                    style={{
                        left: cursorPos.x,
                        top: cursorPos.y,
                        width: '300px',
                        height: '200px',
                        transform: 'translate(20px, 20px)', // Offset from cursor
                        opacity: hoveredId ? 1 : 0
                    }}
                >
                    {hoveredItem && (
                        hoveredItem.mediaType === 'video' ? (
                            <video
                                key={hoveredItem.id} // Force re-render/reset on change
                                src={hoveredItem.src}
                                className="w-full h-full object-cover"
                                autoPlay
                                loop
                                playsInline
                            />
                        ) : (
                            <img
                                src={hoveredItem.src}
                                className="w-full h-full object-cover"
                                alt=""
                            />
                        )
                    )}
                </div>
            )}

            {/* Header */}
            <div className="flex justify-between items-end mb-16 border-b border-black/20 pb-6">
                <div>
                    <h2 className="text-6xl font-black uppercase tracking-tighter leading-none mb-2">
                        RECENT<br />ACTIVITIES
                    </h2>
                </div>
                <div className="max-w-md text-right">
                    <p className="text-sm font-medium uppercase tracking-wide opacity-60">
                        Throughout his digital afterlife, Kobe has achieved a range of memorable results across the metaverse.
                    </p>
                </div>
            </div>

            {/* List Header */}
            <div className="grid grid-cols-12 gap-4 text-xs font-bold uppercase tracking-widest opacity-40 mb-6 px-4">
                <div className="col-span-3">Category</div>
                <div className="col-span-6">Event</div>
                <div className="col-span-3 text-right">Date</div>
            </div>

            {/* List Items */}
            <div className="flex flex-col">
                {activitiesData.map((item) => (
                    <div
                        key={item.id}
                        onMouseEnter={() => handleMouseEnter(item.id)}
                        onMouseLeave={() => handleMouseLeave(item.id)}
                        onClick={() => handleClick(item.id)}
                        className="group relative grid grid-cols-12 gap-4 items-center py-8 px-4 border-t border-black/10 transition-colors hover:bg-black hover:text-[#ccff00] cursor-pointer"
                    >
                        {/* Background Media (Only visible on hover) */}
                        <div
                            className={`fixed top-0 left-0 w-full h-full z-[-1] pointer-events-none transition-opacity duration-500 ${hoveredId === item.id ? 'opacity-20' : 'opacity-0'}`}
                        >
                            {item.mediaType === 'video' ? (
                                <video
                                    ref={el => videoRefs.current[item.id] = el}
                                    src={item.src}
                                    className="w-full h-full object-cover grayscale"
                                    muted
                                    loop
                                    playsInline
                                />
                            ) : (
                                <img
                                    src={item.src}
                                    className="w-full h-full object-cover grayscale"
                                    alt=""
                                />
                            )}
                        </div>

                        {/* Content */}
                        <div className="col-span-3 text-4xl font-black uppercase tracking-tighter leading-none">
                            {item.category}
                        </div>
                        <div className="col-span-6 text-4xl font-black uppercase tracking-tighter leading-none flex items-center gap-3">
                            {item.event}
                        </div>
                        <div className="col-span-3 text-right text-4xl font-black uppercase tracking-tighter leading-none opacity-50 group-hover:opacity-100">
                            {item.date}
                        </div>
                    </div>
                ))}
            </div>
            <div className="border-t border-black/10"></div>
        </div>
    );
}
