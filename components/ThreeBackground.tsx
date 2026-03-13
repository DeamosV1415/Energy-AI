import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

/**
 * Three.js animated background: floating energy grid particles
 * with cursor-tracked interaction. Particles gently drift and
 * connect with glowing lines when near each other. The cursor
 * creates a gravitational pull effect on nearby particles.
 */
const ThreeBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // ─── Scene setup ───
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // ─── Particles ───
    const PARTICLE_COUNT = 80;
    const positions: number[] = [];
    const velocities: { x: number; y: number; z: number }[] = [];
    const particleBasePositions: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = (Math.random() - 0.5) * 100;
      const y = (Math.random() - 0.5) * 60;
      const z = (Math.random() - 0.5) * 30;
      positions.push(x, y, z);
      particleBasePositions.push({ x, y, z });
      velocities.push({
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.01,
      });
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x6366f1,
      size: 0.6,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // ─── Glow particles (larger, softer) ───
    const glowMaterial = new THREE.PointsMaterial({
      color: 0x3b82f6,
      size: 2.5,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const glowParticles = new THREE.Points(particleGeometry, glowMaterial);
    scene.add(glowParticles);

    // ─── Connection lines ───
    const lineGeometry = new THREE.BufferGeometry();
    const MAX_LINES = PARTICLE_COUNT * PARTICLE_COUNT;
    const linePositions = new Float32Array(MAX_LINES * 6);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setDrawRange(0, 0);

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // ─── Mouse tracking ───
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // ─── Animation loop ───
    const CONNECTION_DISTANCE = 15;
    const CURSOR_INFLUENCE_RADIUS = 25;
    const CURSOR_FORCE = 0.15;

    const animate = () => {
      const posArray = particleGeometry.attributes.position.array as Float32Array;

      // Convert mouse to world coordinates
      const mouseWorld = new THREE.Vector3(
        mouseRef.current.x * 50,
        mouseRef.current.y * 30,
        0
      );

      // Update particle positions
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const idx = i * 3;

        // Apply base velocity (gentle drift)
        posArray[idx] += velocities[i].x;
        posArray[idx + 1] += velocities[i].y;
        posArray[idx + 2] += velocities[i].z;

        // Cursor interaction: gentle attraction
        const dx = mouseWorld.x - posArray[idx];
        const dy = mouseWorld.y - posArray[idx + 1];
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CURSOR_INFLUENCE_RADIUS && dist > 0.1) {
          const force = (1 - dist / CURSOR_INFLUENCE_RADIUS) * CURSOR_FORCE;
          posArray[idx] += (dx / dist) * force;
          posArray[idx + 1] += (dy / dist) * force;
        }

        // Soft boundary wrap
        if (posArray[idx] > 55) posArray[idx] = -55;
        if (posArray[idx] < -55) posArray[idx] = 55;
        if (posArray[idx + 1] > 35) posArray[idx + 1] = -35;
        if (posArray[idx + 1] < -35) posArray[idx + 1] = 35;
      }

      particleGeometry.attributes.position.needsUpdate = true;

      // Update connection lines
      let lineIdx = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        for (let j = i + 1; j < PARTICLE_COUNT; j++) {
          const ix = i * 3, jx = j * 3;
          const dx = posArray[ix] - posArray[jx];
          const dy = posArray[ix + 1] - posArray[jx + 1];
          const dz = posArray[ix + 2] - posArray[jx + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < CONNECTION_DISTANCE) {
            linePositions[lineIdx++] = posArray[ix];
            linePositions[lineIdx++] = posArray[ix + 1];
            linePositions[lineIdx++] = posArray[ix + 2];
            linePositions[lineIdx++] = posArray[jx];
            linePositions[lineIdx++] = posArray[jx + 1];
            linePositions[lineIdx++] = posArray[jx + 2];
          }
        }
      }

      lineGeometry.attributes.position.needsUpdate = true;
      lineGeometry.setDrawRange(0, lineIdx / 3);

      // Gentle camera sway based on cursor
      camera.position.x += (mouseRef.current.x * 3 - camera.position.x) * 0.02;
      camera.position.y += (mouseRef.current.y * 2 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    // ─── Resize handler ───
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // ─── Cleanup ───
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      glowMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
};

export default ThreeBackground;
