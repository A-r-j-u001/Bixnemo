"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const ParticleBackground = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;

        // 1. Basic Setup
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0xffffff, 0.002);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 1000;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        container.appendChild(renderer.domElement);

        // Helper for Gaussian Random (Box-Muller transform)
        const gaussianRandom = (mean: number, stdev: number) => {
            const u = 1 - Math.random();
            const v = Math.random();
            const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
            return z * stdev + mean;
        };

        // Helper to create a circle texture
        const getTexture = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 32;
            canvas.height = 32;
            const ctx = canvas.getContext('2d');
            if (!ctx) return null;

            const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
            gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 32, 32);

            const texture = new THREE.Texture(canvas);
            texture.needsUpdate = true;
            return texture;
        };

        // 2. Create Particles
        const particleCount = 8000;
        const geometry = new THREE.BufferGeometry();
        const positions: number[] = [];
        const sizes: number[] = [];
        const speeds: number[] = [];
        const colors: number[] = [];

        const singleColor = new THREE.Color(0x4285F4); // Google Blue

        for (let i = 0; i < particleCount; i++) {
            // Gaussian distribution for X and Y
            const x = gaussianRandom(0, 500);
            const y = gaussianRandom(0, 500);
            const z = (Math.random() - 0.5) * 2000;
            positions.push(x, y, z);

            sizes.push(Math.random() * 4 + 2); // Increased size range
            speeds.push(Math.random() * 0.5 + 0.1);

            colors.push(singleColor.r, singleColor.g, singleColor.b);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 6, // Increased base size
            sizeAttenuation: true,
            transparent: true,
            opacity: 1.0, // Max opacity
            vertexColors: true,
            map: getTexture() || undefined,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });

        const starField = new THREE.Points(geometry, material);
        scene.add(starField);

        // Mouse Interactivity
        let mouseX = 0;
        let mouseY = 0;

        const handleMouseMove = (event: MouseEvent) => {
            mouseX = (event.clientX - window.innerWidth / 2) * 0.5;
            mouseY = (event.clientY - window.innerHeight / 2) * 0.5;
        };
        document.addEventListener('mousemove', handleMouseMove);

        // 3. Animation Loop
        let animationId: number;
        const animate = () => {
            animationId = requestAnimationFrame(animate);

            const positions = starField.geometry.attributes.position.array as Float32Array;

            for (let i = 0; i < particleCount; i++) {
                positions[i * 3 + 2] += speeds[i];

                if (positions[i * 3 + 2] > 1000) {
                    positions[i * 3 + 2] = -1000;
                    // Recycle with Gaussian distribution
                    positions[i * 3] = gaussianRandom(0, 500);
                    positions[i * 3 + 1] = gaussianRandom(0, 500);
                }
            }

            starField.geometry.attributes.position.needsUpdate = true;
            starField.rotation.z += 0.001;

            camera.position.x += (mouseX - camera.position.x) * 0.05;
            camera.position.y += (-mouseY - camera.position.y) * 0.05;

            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        };

        animate();

        // Resize Handler
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            cancelAnimationFrame(animationId);
            document.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            if (container && container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
            geometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, []);

    return <div ref={containerRef} className="absolute inset-0 -z-10" />;
};

export default ParticleBackground;
