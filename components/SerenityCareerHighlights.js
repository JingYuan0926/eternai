import React from 'react';

const achievements = [
    {
        title: 'ACADEMIC EXCELLENCE AND HONOR ROLL CERTIFICATE',
        year: '2011, 2012, 2013, 2014',
        color: 'gold'
    },
    {
        title: 'MERIT BASED SCHOLARSHIP',
        year: '2015',
        color: 'gold'
    },
    {
        title: 'DEANS LIST AND FACULTY HONORS',
        year: '2017, 2018',
        color: 'gold'
    },
    {
        title: 'UNIVERSITY LEADERSHIP AND SERVICE AWARD',
        year: '2019',
        color: 'silver'
    },
    {
        title: 'INTERNSHIP COMPLETION CERTIFICATE',
        year: '2020, 2021',
        color: 'silver'
    },
    {
        title: 'GRADUATE DISTINCTION WITH HONORS',
        year: '2022',
        color: 'silver'
    },
    {
        title: 'OUTSTANDING NEW HIRE AWARD',
        year: '2023',
        color: 'silver'
    },
    {
        title: 'MARATHON WINNER',
        year: '2025',
        color: 'gold'
    }
];

const Trophy = ({ className }) => (
    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M8 21H16M12 17V21M17 4H7C5.89543 4 5 4.89543 5 6V8C5 9.10457 5.89543 10 7 10H17C18.1046 10 19 9.10457 19 8V6C19 4.89543 18.1046 4 17 4ZM17 4V2H7V4M7 4H4V8H5M19 8H20V4H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 17C14.7614 17 17 14.7614 17 12V10H7V12C7 14.7614 9.23858 17 12 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function SerenityCareerHighlights() {
    return (
        <div className="w-full max-w-[1400px] mx-auto px-6 py-20 font-sans text-black relative z-20">
            {/* Header */}
            <div className="flex justify-between items-end mb-16 border-b border-black/20 pb-6">
                <div className="max-w-2xl">
                    <h2 className="text-6xl font-black uppercase tracking-tighter leading-none mb-2">
                        LIFE ACHIEVEMENT<br />
                        <span className="italic font-light">2010 — 2025</span>
                    </h2>
                </div>
                <div className="max-w-md text-right pt-4">
                    <p className="text-sm font-medium uppercase tracking-wide opacity-60 leading-relaxed">
                        Prior to his digital afterlife, Derek survived university and managed to clock in a full year of work experience as a fresh graduate. He is everyone's best friend at heart.
                    </p>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-12 gap-8">
                {/* Left Column - Image */}
                <div className="col-span-5 relative h-full bg-gray-200 rounded-lg overflow-hidden">
                    <img
                        src="/life-achievement.png"
                        alt="Serenity Career"
                        className="w-full h-full object-cover transition-all duration-700"
                    />
                </div>

                {/* Right Column - Achievements */}
                <div className="col-span-7 pl-12">
                    <div className="grid grid-cols-2 gap-x-12 gap-y-16">
                        {achievements.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-6 group cursor-default"
                            >
                                <div className="pt-1 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                                    <Trophy className={item.color === 'gold' ? "text-[#ccff00]" : "text-zinc-400"} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black uppercase tracking-tighter leading-none mb-2 transition-colors duration-300">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm font-bold uppercase tracking-widest opacity-40">
                                        {item.year}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
