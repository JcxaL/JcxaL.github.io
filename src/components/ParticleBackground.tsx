"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Particle {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  rotationSpeed: THREE.Vector3;
  baseScale: number;
  baseOpacity: number;
}

const ParticleBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    camera.position.z = 5;

    // Create particles
    const particleCount = 100;
    const colors = [
      new THREE.Color(0xff1f4b), // Folly
      new THREE.Color(0x00ffff), // Neon Cyan
      new THREE.Color(0x0080ff), // Electric Blue
      new THREE.Color(0x9ca2ab), // Cadet Gray
    ];

    // Create different geometries for variety
    const geometries = [
      new THREE.SphereGeometry(0.02, 8, 8),
      new THREE.BoxGeometry(0.04, 0.04, 0.04),
      new THREE.OctahedronGeometry(0.03),
      new THREE.TetrahedronGeometry(0.035),
    ];

    for (let i = 0; i < particleCount; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const material = new THREE.MeshBasicMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        transparent: true,
        opacity: Math.random() * 0.6 + 0.2,
      });

      const mesh = new THREE.Mesh(geometry, material);
      
      // Random initial position
      mesh.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10
      );

      scene.add(mesh);

      // Store particle data
      particlesRef.current.push({
        mesh,
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ),
        rotationSpeed: new THREE.Vector3(
          Math.random() * 0.02,
          Math.random() * 0.02,
          Math.random() * 0.02
        ),
        baseScale: Math.random() * 0.5 + 0.5,
        baseOpacity: material.opacity,
      });
    }

    // Mouse movement handler
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      // Update particles
      particlesRef.current.forEach((particle, index) => {
        const { mesh, velocity, rotationSpeed, baseScale, baseOpacity } = particle;
        
        // Update position
        mesh.position.add(velocity);
        
        // Update rotation
        mesh.rotation.x += rotationSpeed.x;
        mesh.rotation.y += rotationSpeed.y;
        mesh.rotation.z += rotationSpeed.z;

        // Mouse interaction - attract particles to mouse
        const mouseInfluence = 0.01;
        const mouseX = mouseRef.current.x * 5;
        const mouseY = mouseRef.current.y * 5;
        
        velocity.x += (mouseX - mesh.position.x) * mouseInfluence * 0.001;
        velocity.y += (mouseY - mesh.position.y) * mouseInfluence * 0.001;

        // Boundary conditions - wrap around
        if (mesh.position.x > 10) mesh.position.x = -10;
        if (mesh.position.x < -10) mesh.position.x = 10;
        if (mesh.position.y > 10) mesh.position.y = -10;
        if (mesh.position.y < -10) mesh.position.y = 10;
        if (mesh.position.z > 5) mesh.position.z = -5;
        if (mesh.position.z < -5) mesh.position.z = 5;

        // Pulsing opacity effect
        const time = Date.now() * 0.001;
        const material = mesh.material as THREE.MeshBasicMaterial;
        material.opacity = baseOpacity + Math.sin(time + index) * 0.1;

        // Scale variation
        mesh.scale.setScalar(baseScale + Math.sin(time * 2 + index) * 0.1);
      });

      // Slight camera movement based on mouse
      camera.position.x += (mouseRef.current.x * 0.5 - camera.position.x) * 0.05;
      camera.position.y += (mouseRef.current.y * 0.5 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!camera || !renderer) return;
      
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      
      // Dispose of Three.js objects
      geometries.forEach(geom => geom.dispose());
      scene.children.forEach(child => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => mat.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="particles-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -5,
        opacity: 0.6,
      }}
    />
  );
};

export default ParticleBackground; 