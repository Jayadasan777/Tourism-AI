import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// 3D Low-Poly Topographic Terrain-Compass Mesh with Gradient Shading
function TerrainCompassMesh({ scrollProgress = 0, mousePos = { x: 0, y: 0 } }) {
  const meshRef = useRef();
  const wireframeRef = useRef();

  // Procedural Low-Poly Terrain Geometry resembling Indian Mountain Ridge & Needle Spine
  const { geometry, wireGeometry } = useMemo(() => {
    const geo = new THREE.ConeGeometry(2.4, 3.8, 8, 5, false);
    const pos = geo.attributes.position;
    const vertex = new THREE.Vector3();

    // Sculpt into diamond-compass mountain ridge
    for (let i = 0; i < pos.count; i++) {
      vertex.fromBufferAttribute(pos, i);
      // Asymmetric mountain ridges and river cuts
      const angle = Math.atan2(vertex.z, vertex.x);
      const heightFactor = (vertex.y + 1.9) / 3.8;
      const wave = Math.sin(angle * 4 + heightFactor * 6) * 0.28;
      const pinch = 1.0 - Math.pow(Math.abs(heightFactor - 0.5) * 2, 1.8) * 0.35;
      
      vertex.x += (Math.cos(angle * 2) * wave) * pinch;
      vertex.z += (Math.sin(angle * 2) * wave) * pinch;
      
      // Needle sharp pointer at top/bottom
      if (vertex.y > 1.2) {
        vertex.x *= 0.6;
        vertex.z *= 0.6;
      }
      pos.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    geo.computeVertexNormals();

    const wireGeo = new THREE.WireframeGeometry(geo);
    return { geometry: geo, wireGeometry: wireGeo };
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Ambient continuous rotation
    meshRef.current.rotation.y += delta * 0.45;
    
    // Parallax mouse tilt
    const targetRotX = mousePos.y * 0.45 + (scrollProgress * 0.8);
    const targetRotZ = -mousePos.x * 0.45;
    
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, 0.05);
    meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, targetRotZ, 0.05);

    if (wireframeRef.current) {
      wireframeRef.current.rotation.y = meshRef.current.rotation.y;
      wireframeRef.current.rotation.x = meshRef.current.rotation.x;
      wireframeRef.current.rotation.z = meshRef.current.rotation.z;
    }
  });

  return (
    <group>
      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
        {/* Core Solid Mesh with Violet-to-Marigold Lighting */}
        <mesh ref={meshRef} geometry={geometry}>
          <meshPhysicalMaterial
            color="#7C5CFF"
            emissive="#12131C"
            roughness={0.25}
            metalness={0.7}
            clearcoat={0.6}
            clearcoatRoughness={0.2}
            flatShading={true}
          />
        </mesh>

        {/* Ambient Topographic Wireframe Contour overlay */}
        <lineSegments ref={wireframeRef} geometry={wireGeometry}>
          <lineBasicMaterial color="#FF8A3D" transparent opacity={0.35} />
        </lineSegments>

        {/* Compass Needle Core Light */}
        <pointLight position={[0, 1.8, 1]} color="#FF8A3D" intensity={2.5} distance={6} />
        <pointLight position={[0, -1.8, -1]} color="#7C5CFF" intensity={3.5} distance={8} />
      </Float>
    </group>
  );
}

// Background Floating Ambient Particles (Limited to 8-10 for peak performance)
function AmbientParticles() {
  const count = 10;
  const particles = useMemo(() => {
    const p = [];
    for (let i = 0; i < count; i++) {
      p.push({
        position: [
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 4
        ],
        scale: 0.03 + Math.random() * 0.04,
        speed: 0.5 + Math.random() * 1.5
      });
    }
    return p;
  }, []);

  return (
    <group>
      {particles.map((pt, i) => (
        <Float key={i} speed={pt.speed} rotationIntensity={1} floatIntensity={1.5}>
          <mesh position={pt.position}>
            <sphereGeometry args={[pt.scale, 8, 8]} />
            <meshBasicMaterial color={i % 2 === 0 ? "#7C5CFF" : "#FF8A3D"} transparent opacity={0.6} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export default function Hero3DScene({ scrollProgress = 0 }) {
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { innerWidth, innerHeight } = window;
    setMousePos({
      x: (e.clientX / innerWidth) * 2 - 1,
      y: -(e.clientY / innerHeight) * 2 + 1
    });
  };

  return (
    <div 
      onMouseMove={handleMouseMove} 
      className="w-full h-[460px] lg:h-[540px] relative cursor-grab active:cursor-grabbing"
    >
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 48 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        {/* Violet Key Light */}
        <directionalLight position={[4, 5, 4]} intensity={2.2} color="#7C5CFF" />
        {/* Warm Marigold Fill Light */}
        <directionalLight position={[-4, -3, -2]} intensity={1.8} color="#FF8A3D" />
        
        {/* 3D Signature Mesh */}
        <TerrainCompassMesh scrollProgress={scrollProgress} mousePos={mousePos} />
        
        {/* Ambiance Particles */}
        <AmbientParticles />
      </Canvas>
    </div>
  );
}
