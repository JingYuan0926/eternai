import React, { useEffect, useRef, useState } from 'react';

export default function SplashCursor({ children }) {
    const [isHovering, setIsHovering] = useState(false);

    // Refs for Mouse Trail
    const pathRef = useRef(null);
    const turbulenceRef = useRef(null);
    const pointsRef = useRef([]);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const rafRef = useRef(null);
    const seedRef = useRef(0);

    // Refs for Automated Trail
    const autoPathRef = useRef(null);
    const autoPointsRef = useRef([]);
    const autoPositionRef = useRef({ x: 0, y: 0 });
    const autoVelocityRef = useRef({ x: 60, y: 10 }); // Increased speed
    const autoPauseRef = useRef(0); // Timestamp when pause started (0 if not paused)
    const containerRef = useRef(null);

    const lastInteractionRef = useRef(Date.now());

    useEffect(() => {
        // Initialize automated position
        if (typeof window !== 'undefined') {
            autoPositionRef.current = { x: 0, y: window.innerHeight / 4 };
        }

        const loop = (timestamp) => {
            const timeSinceInteraction = Date.now() - lastInteractionRef.current;
            const isIdle = timeSinceInteraction > 3000;

            // --- Mouse Trail Logic ---
            const points = pointsRef.current;
            const mouse = mouseRef.current;

            if (!isIdle) {
                // Add new point if mouse has moved or just to keep the trail alive
                points.push({ x: mouse.x, y: mouse.y, age: 0 });

                // Remove old points (trail length)
                if (points.length > 12) {
                    points.shift();
                }

                // Construct SVG Path command for Mouse
                if (points.length > 1 && pathRef.current) {
                    const pathData = getTaperedPath(points, 120);
                    pathRef.current.setAttribute('d', pathData);
                }

                // Clear Auto Trail when active
                autoPointsRef.current = [];
                if (autoPathRef.current) autoPathRef.current.setAttribute('d', '');
            } else {
                // Clear Mouse Trail when idle
                pointsRef.current = [];
                if (pathRef.current) pathRef.current.setAttribute('d', '');
            }

            // --- Automated Trail Logic ---
            const container = containerRef.current;
            if (container && isIdle) {
                // Check for pause
                if (autoPauseRef.current > 0) {
                    if (timestamp - autoPauseRef.current < 3000) {
                        // Still paused, skip update but keep animating turbulence
                        // Keep points static to maintain trail visibility (even if off-screen)
                        const pos = autoPositionRef.current;
                        const autoPoints = autoPointsRef.current;
                        autoPoints.push({ x: pos.x, y: pos.y, age: 0 });
                        if (autoPoints.length > 20) autoPoints.shift();

                        if (autoPoints.length > 1 && autoPathRef.current) {
                            const pathData = getTaperedPath(autoPoints, 100);
                            autoPathRef.current.setAttribute('d', pathData);
                        }

                        // Continue loop
                        if (turbulenceRef.current) {
                            seedRef.current += 1;
                            turbulenceRef.current.setAttribute('seed', seedRef.current);
                        }
                        rafRef.current = requestAnimationFrame(loop);
                        return;
                    } else {
                        // Pause over
                        autoPauseRef.current = 0;
                    }
                }

                const { width, height } = container.getBoundingClientRect();
                const pos = autoPositionRef.current;
                const vel = autoVelocityRef.current;

                // Update position
                pos.x += vel.x;
                pos.y += vel.y;

                // Bounce horizontally (Standard bounce)
                if (pos.x >= width || pos.x <= 0) {
                    vel.x *= -1;
                    pos.x = Math.max(0, Math.min(pos.x, width));
                }

                // Bounce vertically with "Moving Out" effect and Delay
                // Allow moving past the edge by 200px before pausing/reversing
                const offset = 200;
                if (pos.y >= height + offset || pos.y <= -offset) {
                    vel.y *= -1;
                    // Clamp to the extended boundary to prevent drifting further
                    pos.y = Math.max(-offset, Math.min(pos.y, height + offset));
                    autoPauseRef.current = timestamp; // Start pause
                }

                // Update auto trail points
                const autoPoints = autoPointsRef.current;
                autoPoints.push({ x: pos.x, y: pos.y, age: 0 });

                // Remove old points
                if (autoPoints.length > 15) {
                    autoPoints.shift();
                }

                // Construct Tapered Path for Auto Trail
                if (autoPoints.length > 1 && autoPathRef.current) {
                    const pathData = getTaperedPath(autoPoints, 100);
                    autoPathRef.current.setAttribute('d', pathData);
                }
            }

            // --- Shared Animation ---
            // Animate Turbulence
            if (turbulenceRef.current) {
                seedRef.current += 1;
                turbulenceRef.current.setAttribute('seed', seedRef.current);
            }

            rafRef.current = requestAnimationFrame(loop);
        };

        rafRef.current = requestAnimationFrame(loop);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    const handleMouseMove = (e) => {
        lastInteractionRef.current = Date.now();
        const rect = e.currentTarget.getBoundingClientRect();
        mouseRef.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        // Move trail off screen
        mouseRef.current = { x: -1000, y: -1000 };
    };

    // Helper to create a tapered polygon from points (for automated trail)
    const getTaperedPath = (points, maxThickness = 100) => {
        if (points.length < 2) return '';

        const leftSide = [];
        const rightSide = [];

        for (let i = 0; i < points.length; i++) {
            const p = points[i];
            const nextP = points[i + 1] || points[i];
            const prevP = points[i - 1] || points[i];

            let dx = nextP.x - prevP.x;
            let dy = nextP.y - prevP.y;

            if (i === 0) {
                dx = nextP.x - p.x;
                dy = nextP.y - p.y;
            } else if (i === points.length - 1) {
                dx = p.x - prevP.x;
                dy = p.y - prevP.y;
            }

            const len = Math.sqrt(dx * dx + dy * dy);
            if (len === 0) continue;

            const nx = -dy / len;
            const ny = dx / len;

            const progress = i / (points.length - 1);
            const thickness = maxThickness * progress;

            leftSide.push({ x: p.x + nx * thickness, y: p.y + ny * thickness });
            rightSide.push({ x: p.x - nx * thickness, y: p.y - ny * thickness });
        }

        if (leftSide.length === 0) return '';

        let d = `M ${leftSide[0].x} ${leftSide[0].y}`;
        for (let i = 1; i < leftSide.length; i++) {
            d += ` L ${leftSide[i].x} ${leftSide[i].y}`;
        }

        // Round the head with an arc
        // A rx ry x-axis-rotation large-arc-flag sweep-flag x y
        // We are at leftSide[last], arc to rightSide[last]
        const lastIndex = leftSide.length - 1;
        if (lastIndex >= 0) {
            d += ` A ${maxThickness} ${maxThickness} 0 0 0 ${rightSide[lastIndex].x} ${rightSide[lastIndex].y}`;
        }

        for (let i = rightSide.length - 2; i >= 0; i--) {
            d += ` L ${rightSide[i].x} ${rightSide[i].y}`;
        }
        d += ' Z';
        return d;
    };

    return (
        <div
            ref={containerRef}
            style={{ position: 'relative', width: '100%', height: '100%' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* SVG Definitions for Masks */}
            <svg style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
                <defs>
                    <filter id="splash-turbulence">
                        {/* 1. Generate Noise */}
                        <feTurbulence
                            ref={turbulenceRef}
                            type="fractalNoise"
                            baseFrequency="0.03"
                            numOctaves="1"
                            result="noise"
                        />
                        {/* 2. Distort the source graphic (path) using the noise */}
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="30" result="distorted" />

                        {/* 3. Blur the distorted shape to smooth edges */}
                        <feGaussianBlur in="distorted" stdDeviation="15" result="blurred" />

                        {/* 4. Increase contrast to sharpen the blur into a hard, rounded edge ("Gooey" effect) */}
                        <feColorMatrix
                            in="blurred"
                            type="matrix"
                            values="1 0 0 0 0  
                                    0 1 0 0 0  
                                    0 0 1 0 0  
                                    0 0 0 19 -9"
                            result="gooey"
                        />
                    </filter>

                    {/* Mouse Trail Path */}
                    <path
                        id="trail-path"
                        ref={pathRef}
                    />

                    {/* Automated Trail Path - No Filter in Defs */}
                    <path
                        id="auto-trail-path"
                        ref={autoPathRef}
                    />

                    <mask id="splash-mask">
                        <rect x="0" y="0" width="100%" height="100%" fill="black" />
                        <use href="#trail-path" fill="white" filter="url(#splash-turbulence)" />
                        <use href="#auto-trail-path" fill="white" filter="url(#splash-turbulence)" />
                    </mask>

                    <mask id="splash-mask-inverse">
                        <rect x="0" y="0" width="100%" height="100%" fill="white" />
                        <use href="#trail-path" fill="black" filter="url(#splash-turbulence)" />
                        <use href="#auto-trail-path" fill="black" filter="url(#splash-turbulence)" />
                    </mask>
                </defs>

                {/* Visible Mouse Trail */}
                <use
                    href="#trail-path"
                    fill="rgb(230, 230, 230)"
                    filter="url(#splash-turbulence)"
                    opacity="0.3"
                />

                {/* Visible Automated Trail (Grey with Opacity) */}
                <use
                    href="#auto-trail-path"
                    fill="rgb(230, 230, 230)"
                    filter="url(#splash-turbulence)"
                    opacity="0.3"
                />
            </svg>

            {typeof children === 'function' ? children(isHovering) : children}
        </div>
    );
}