import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function IndianTourismGlobe3D({ scrollProgress = 0 }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || 520;
    const height = currentMount.clientHeight || 520;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.2);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Central Holographic Planet Sphere
    const sphereGeo = new THREE.SphereGeometry(2.1, 48, 48);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0x06140E,
      roughness: 0.25,
      metalness: 0.75,
      emissive: 0x020805
    });
    const globe = new THREE.Mesh(sphereGeo, sphereMat);
    mainGroup.add(globe);

    // 2. Glowing Topographic Wireframe Grid
    const wireGeo = new THREE.WireframeGeometry(new THREE.SphereGeometry(2.12, 28, 28));
    const wireMat = new THREE.LineBasicMaterial({
      color: 0x10B981,
      transparent: true,
      opacity: 0.4
    });
    const wireframe = new THREE.LineSegments(wireGeo, wireMat);
    globe.add(wireframe);

    // 3. Indian Geo-Hotspots (Madurai, Chennai, Varanasi, Munnar, Himalayas, Jaipur, Goa)
    const indianLocations = [
      { name: 'Madurai & Meenakshi', lat: 9.92, lon: 78.12, color: 0xF59E0B, label: '🏛️' },
      { name: 'Chennai Coast', lat: 13.08, lon: 80.27, color: 0x34D399, label: '🌊' },
      { name: 'Varanasi Ghats', lat: 25.31, lon: 82.97, color: 0xF59E0B, label: '🪔' },
      { name: 'Munnar Tea Hills', lat: 10.08, lon: 77.06, color: 0x10B981, label: '🌿' },
      { name: 'Himalayan Ridge', lat: 32.24, lon: 77.18, color: 0x34D399, label: '🏔️' },
      { name: 'Jaipur Palaces', lat: 26.91, lon: 75.78, color: 0xF59E0B, label: '🏰' },
      { name: 'Goa Beaches', lat: 15.29, lon: 74.12, color: 0x10B981, label: '🌴' }
    ];

    // Helper: Convert Lat/Lon to 3D Sphere Coordinates
    const latLonToVector3 = (lat, lon, radius) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -(radius * Math.sin(phi) * Math.cos(theta)),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
    };

    const pinPoints = [];
    const pinGroup = new THREE.Group();
    globe.add(pinGroup);

    indianLocations.forEach((loc) => {
      // Offset coords to focus on visible hemisphere
      const targetPos = latLonToVector3(loc.lat + 10, loc.lon - 15, 2.15);
      
      // Pin Sphere
      const pinGeo = new THREE.SphereGeometry(0.07, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({ color: loc.color });
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.position.copy(targetPos);
      pinGroup.add(pin);
      pinPoints.push(targetPos);

      // Vertical Beacon Beam
      const beamGeo = new THREE.CylinderGeometry(0.01, 0.02, 0.6, 8);
      const beamMat = new THREE.MeshBasicMaterial({ color: loc.color, transparent: true, opacity: 0.8 });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.copy(targetPos.clone().multiplyScalar(1.08));
      beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), targetPos.clone().normalize());
      pinGroup.add(beam);
    });

    // 4. Glowing 3D Curved Flight & Route Navigation Arcs
    const createCurvedRoute = (v1, v2, colorHex) => {
      const distance = v1.distanceTo(v2);
      const mid = v1.clone().add(v2).multiplyScalar(0.5);
      const midLength = mid.length();
      mid.normalize();
      mid.multiplyScalar(midLength + distance * 0.45); // Arc outward

      const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
      const points = curve.getPoints(32);
      const curveGeo = new THREE.BufferGeometry().setFromPoints(points);
      const curveMat = new THREE.LineBasicMaterial({ color: colorHex, transparent: true, opacity: 0.75 });
      return new THREE.Line(curveGeo, curveMat);
    };

    if (pinPoints.length >= 4) {
      globe.add(createCurvedRoute(pinPoints[0], pinPoints[1], 0xF59E0B)); // Madurai -> Chennai
      globe.add(createCurvedRoute(pinPoints[1], pinPoints[2], 0x10B981)); // Chennai -> Varanasi
      globe.add(createCurvedRoute(pinPoints[2], pinPoints[4], 0x34D399)); // Varanasi -> Himalayas
      globe.add(createCurvedRoute(pinPoints[4], pinPoints[5], 0xF59E0B)); // Himalayas -> Jaipur
      globe.add(createCurvedRoute(pinPoints[0], pinPoints[3], 0x10B981)); // Madurai -> Munnar
    }

    // 5. Orbital Compass Navigation Ring
    const orbitRingGeo = new THREE.RingGeometry(2.7, 2.74, 64);
    const orbitRingMat = new THREE.MeshBasicMaterial({
      color: 0x10B981,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5
    });
    const orbitRing = new THREE.Mesh(orbitRingGeo, orbitRingMat);
    orbitRing.rotation.x = Math.PI / 2.3;
    mainGroup.add(orbitRing);

    // Outer Amber Sunrise Atmosphere Ring
    const outerRingGeo = new THREE.RingGeometry(3.1, 3.12, 64);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0xF59E0B,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.3
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRing.rotation.x = -Math.PI / 3;
    mainGroup.add(outerRing);

    // 6. Ambient Floating Particles
    const particleCount = 18;
    const particleGeo = new THREE.SphereGeometry(0.035, 8, 8);
    const pMatEmerald = new THREE.MeshBasicMaterial({ color: 0x10B981, transparent: true, opacity: 0.7 });
    const pMatAmber = new THREE.MeshBasicMaterial({ color: 0xF59E0B, transparent: true, opacity: 0.7 });
    const pMatMint = new THREE.MeshBasicMaterial({ color: 0x34D399, transparent: true, opacity: 0.7 });
    const particles = new THREE.Group();

    for (let i = 0; i < particleCount; i++) {
      const mat = i % 3 === 0 ? pMatEmerald : i % 3 === 1 ? pMatAmber : pMatMint;
      const p = new THREE.Mesh(particleGeo, mat);
      p.position.set(
        (Math.random() - 0.5) * 8.5,
        (Math.random() - 0.5) * 6.5,
        (Math.random() - 0.5) * 4.5
      );
      particles.add(p);
    }
    mainGroup.add(particles);

    // 7. Lighting System
    const ambLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambLight);

    const dirLightEmerald = new THREE.DirectionalLight(0x10B981, 3.2);
    dirLightEmerald.position.set(5, 4, 4);
    scene.add(dirLightEmerald);

    const dirLightAmber = new THREE.DirectionalLight(0xF59E0B, 2.8);
    dirLightAmber.position.set(-5, -3, -2);
    scene.add(dirLightAmber);

    const dirLightMint = new THREE.DirectionalLight(0x34D399, 2.0);
    dirLightMint.position.set(0, -4, 3);
    scene.add(dirLightMint);

    // 8. Mouse Tilt & Parallax Interactivity
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e) => {
      const rect = currentMount.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 9. Animation Loop
    let reqId;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Ambient self-rotation of the Indian tourism globe
      globe.rotation.y += 0.006;
      globe.rotation.x = Math.sin(elapsed * 0.5) * 0.08;

      // Orbit rings subtle counter-rotation
      orbitRing.rotation.z = elapsed * 0.15;
      outerRing.rotation.z = -elapsed * 0.1;

      // Particles float
      particles.rotation.y = elapsed * 0.04;
      particles.position.y = Math.sin(elapsed * 0.6) * 0.12;

      // Mouse Parallax Lerp
      mainGroup.rotation.y = THREE.MathUtils.lerp(mainGroup.rotation.y, mouseX * 0.4 + (scrollProgress * 0.5), 0.05);
      mainGroup.rotation.x = THREE.MathUtils.lerp(mainGroup.rotation.x, -mouseY * 0.35, 0.05);

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
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      sphereGeo.dispose();
      sphereMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      orbitRingGeo.dispose();
      orbitRingMat.dispose();
      outerRingGeo.dispose();
      outerRingMat.dispose();
      renderer.dispose();
    };
  }, [scrollProgress]);

  return (
    <div
      ref={mountRef}
      className="w-full h-[460px] sm:h-[520px] relative flex items-center justify-center cursor-grab active:cursor-grabbing"
    />
  );
}
