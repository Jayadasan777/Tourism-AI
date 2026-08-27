import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Hero3DScene({ scrollProgress = 0 }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || 480;
    const height = currentMount.clientHeight || 480;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 6);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      return; // Graceful fallback
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // 2. Procedural Low-Poly Terrain-Compass Mesh
    const geo = new THREE.ConeGeometry(2.4, 3.8, 8, 5, false);
    const pos = geo.attributes.position;
    const vertex = new THREE.Vector3();

    for (let i = 0; i < pos.count; i++) {
      vertex.fromBufferAttribute(pos, i);
      const angle = Math.atan2(vertex.z, vertex.x);
      const heightFactor = (vertex.y + 1.9) / 3.8;
      const wave = Math.sin(angle * 4 + heightFactor * 6) * 0.28;
      const pinch = 1.0 - Math.pow(Math.abs(heightFactor - 0.5) * 2, 1.8) * 0.35;
      
      vertex.x += (Math.cos(angle * 2) * wave) * pinch;
      vertex.z += (Math.sin(angle * 2) * wave) * pinch;
      
      if (vertex.y > 1.2) {
        vertex.x *= 0.6;
        vertex.z *= 0.6;
      }
      pos.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    geo.computeVertexNormals();

    const mat = new THREE.MeshPhysicalMaterial({
      color: 0x7C5CFF,
      emissive: 0x12131C,
      roughness: 0.2,
      metalness: 0.65,
      clearcoat: 0.6,
      flatShading: true
    });

    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    // 3. Topographic Wireframe Contour
    const wireGeo = new THREE.WireframeGeometry(geo);
    const wireMat = new THREE.LineBasicMaterial({ color: 0xFF8A3D, transparent: true, opacity: 0.4 });
    const wireframe = new THREE.LineSegments(wireGeo, wireMat);
    mesh.add(wireframe);

    // 4. Ambient Floating Particles
    const particlesGroup = new THREE.Group();
    const particleGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const pMat1 = new THREE.MeshBasicMaterial({ color: 0x7C5CFF, transparent: true, opacity: 0.6 });
    const pMat2 = new THREE.MeshBasicMaterial({ color: 0xFF8A3D, transparent: true, opacity: 0.6 });

    for (let i = 0; i < 10; i++) {
      const pMesh = new THREE.Mesh(particleGeo, i % 2 === 0 ? pMat1 : pMat2);
      pMesh.position.set(
        (Math.random() - 0.5) * 7,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 3
      );
      particlesGroup.add(pMesh);
    }
    scene.add(particlesGroup);

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x7C5CFF, 2.5);
    dirLight1.position.set(4, 5, 4);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xFF8A3D, 2.0);
    dirLight2.position.set(-4, -3, -2);
    scene.add(dirLight2);

    // 6. Mouse parallax
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e) => {
      const rect = currentMount.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 7. Animation Loop
    let reqId;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Ambient slow spin
      mesh.rotation.y += 0.008;

      // Parallax smooth interpolation
      mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, mouseY * 0.4 + (scrollProgress * 0.6), 0.05);
      mesh.rotation.z = THREE.MathUtils.lerp(mesh.rotation.z, -mouseX * 0.4, 0.05);

      // Subtle particle float
      particlesGroup.rotation.y = elapsed * 0.05;
      particlesGroup.position.y = Math.sin(elapsed * 0.8) * 0.15;

      renderer.render(scene, camera);
    };
    animate();

    // 8. Resize Handler
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
      geo.dispose();
      mat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      renderer.dispose();
    };
  }, [scrollProgress]);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-[440px] sm:h-[500px] relative flex items-center justify-center cursor-grab active:cursor-grabbing"
    />
  );
}
