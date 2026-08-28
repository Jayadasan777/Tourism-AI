import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Procedural Indian Tourism 3D Scenes:
 * @param {'mountains' | 'radar' | 'temple'} type
 */
export default function TourismMotionCanvas({ type = 'mountains', className = '' }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || 320;
    const height = currentMount.clientHeight || 180;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.5, 4.5);
    camera.lookAt(0, 0, 0);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    let animatedGroup = new THREE.Group();
    scene.add(animatedGroup);

    if (type === 'mountains') {
      // 1. Procedural Himalayan Mountain Ridge with River Valley - Monochrome
      const planeGeo = new THREE.PlaneGeometry(6, 4, 24, 16);
      const pos = planeGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const ridge = Math.sin(x * 1.5) * Math.cos(y * 1.2) * 0.75 + Math.sin(x * 3.5) * 0.25;
        const valley = Math.exp(-Math.pow(x + 0.2, 2) * 2.5) * 0.45;
        pos.setZ(i, ridge - valley);
      }
      planeGeo.computeVertexNormals();

      const mountainMat = new THREE.MeshPhysicalMaterial({
        color: 0x111111,
        emissive: 0x000000,
        roughness: 0.2,
        metalness: 0.85,
        flatShading: true
      });
      const mountainMesh = new THREE.Mesh(planeGeo, mountainMat);
      mountainMesh.rotation.x = -Math.PI / 2.6;
      mountainMesh.position.y = -0.5;
      animatedGroup.add(mountainMesh);

      // Wireframe contour lines - Crisp White
      const wireGeo = new THREE.WireframeGeometry(planeGeo);
      const wireMat = new THREE.LineBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.45 });
      const wireMesh = new THREE.LineSegments(wireGeo, wireMat);
      mountainMesh.add(wireMesh);
    } else if (type === 'radar') {
      // 2. High-Tech Geographic Radar Globe with Orbital Pulse Rings - Monochrome
      const globeGeo = new THREE.IcosahedronGeometry(1.2, 2);
      const globeMat = new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        wireframe: true,
        transparent: true,
        opacity: 0.65
      });
      const globe = new THREE.Mesh(globeGeo, globeMat);
      animatedGroup.add(globe);

      // Orbital radar rings - White
      const ringGeo = new THREE.RingGeometry(1.5, 1.55, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      animatedGroup.add(ring);
    }

    // Ambient floating glow points - White & Silver
    const pCount = 8;
    const pGeo = new THREE.SphereGeometry(0.03, 6, 6);
    const pMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    for (let i = 0; i < pCount; i++) {
      const p = new THREE.Mesh(pGeo, pMat);
      p.position.set((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 2 + 0.5, (Math.random() - 0.5) * 2);
      animatedGroup.add(p);
    }

    // Lights - Pure Crisp White
    const ambLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambLight);

    const dirLight1 = new THREE.DirectionalLight(0xFFFFFF, 2.8);
    dirLight1.position.set(3, 4, 3);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xAAAAAA, 1.8);
    dirLight2.position.set(-3, -2, -2);
    scene.add(dirLight2);

    let reqId;
    const startTime = performance.now();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const time = (performance.now() - startTime) * 0.001;

      if (type === 'mountains') {
        animatedGroup.rotation.y = Math.sin(time * 0.4) * 0.15;
      } else {
        animatedGroup.rotation.y = time * 0.5;
        animatedGroup.rotation.x = Math.sin(time * 0.3) * 0.2;
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [type]);

  return (
    <div 
      ref={mountRef} 
      className={`w-full h-full min-h-[160px] pointer-events-none relative ${className}`} 
    />
  );
}
