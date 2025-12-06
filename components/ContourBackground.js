import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const vertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColor;
uniform float uThickness;
uniform float uOpacity;
uniform float uDensity;
varying vec2 vUv;

// Simplex 3D Noise 
// by Ian McEwan, Ashima Arts
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //  x0 = x0 - 0.0 + 0.0 * C 
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

// Permutations
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients
// ( N*N points uniformly over a square, mapped onto an octahedron.)
  float n_ = 1.0/7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}

void main() {
    // Normalize coordinates
    vec2 uv = vUv;
    
    // Adjust aspect ratio
    float aspect = uResolution.x / uResolution.y;
    uv.x *= aspect;

    // Noise parameters
    float scale = 2.5; // Even smaller shapes
    float speed = 0.03; 
    
    // Calculate noise value using 3D noise
    float noiseVal = snoise(vec3(uv * scale, uTime * speed));
    
    // Create isolines
    float density = uDensity; 
    
    float sawtooth = fract(noiseVal * density);
    float line = smoothstep(0.0, uThickness, sawtooth) - smoothstep(uThickness, uThickness * 2.0, sawtooth);
    
    // Make lines fade out at edges (vignette)
    float dist = length(vUv - 0.5);
    float vignette = 1.0 - smoothstep(0.3, 0.8, dist);
    
    // Final color
    vec3 finalColor = uColor * line; 
    
    gl_FragColor = vec4(finalColor, line * vignette * uOpacity); 
}
`;

/**
 * A background component that renders animated or static contour lines using Three.js and custom shaders.
 * Creates a topographic map-like effect with Simplex noise.
 *
 * @param {Object} props
 * @param {string} [props.color='#d1d1d1'] - The color of the contour lines.
 * @param {boolean} [props.isStatic=false] - If true, the animation is paused.
 * @param {number} [props.thickness=0.008] - The thickness of the contour lines.
 * @param {number} [props.opacity=0.4] - The opacity of the contour lines.
 * @param {number} [props.density=6.0] - The density of the contour lines (frequency of the noise).
 */
export default function ContourBackground({ color = '#d1d1d1', isStatic = false, thickness = 0.008, opacity = 0.4, density = 6.0 }) {
    const containerRef = useRef(null);
    const rendererRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        const uniforms = {
            uTime: { value: 0 },
            uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
            uColor: { value: new THREE.Color(color) },
            uThickness: { value: thickness },
            uOpacity: { value: opacity },
            uDensity: { value: density }
        };

        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms,
            transparent: true
        });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        const onResize = () => {
            if (!container) return;
            renderer.setSize(container.clientWidth, container.clientHeight);
            uniforms.uResolution.value.set(container.clientWidth, container.clientHeight);
        };
        window.addEventListener('resize', onResize);

        let animationId;
        const animate = (time) => {
            if (!isStatic) {
                uniforms.uTime.value = time * 0.001;
            }
            renderer.render(scene, camera);
            if (!isStatic) {
                animationId = requestAnimationFrame(animate);
            }
        };

        // Render at least once
        if (isStatic) {
            renderer.render(scene, camera);
        } else {
            animate(0);
        }

        return () => {
            window.removeEventListener('resize', onResize);
            if (animationId) cancelAnimationFrame(animationId);
            renderer.dispose();
            geometry.dispose();
            material.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, [color, isStatic, density, thickness, opacity]);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none'
            }}
        />
    );
}
