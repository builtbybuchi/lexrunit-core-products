import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function FloatingParticles() {
  const meshRef = useRef<THREE.Points>(null);
  const particleCount = 200;

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      vel[i * 3] = (Math.random() - 0.5) * 0.002;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.001;
    }
    return [pos, vel];
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const posAttr = meshRef.current.geometry.attributes.position;
    const posArray = posAttr.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      posArray[i * 3] += velocities[i * 3] + Math.sin(Date.now() * 0.001 + i) * 0.0003;
      posArray[i * 3 + 1] += velocities[i * 3 + 1] + Math.cos(Date.now() * 0.0008 + i) * 0.0003;
      posArray[i * 3 + 2] += velocities[i * 3 + 2];

      // Wrap around
      if (Math.abs(posArray[i * 3]) > 8) posArray[i * 3] *= -0.8;
      if (Math.abs(posArray[i * 3 + 1]) > 8) posArray[i * 3 + 1] *= -0.8;
      if (Math.abs(posArray[i * 3 + 2]) > 5) posArray[i * 3 + 2] *= -0.8;
    }
    posAttr.needsUpdate = true;
    meshRef.current.rotation.y += delta * 0.02;
  });

  return (
    <points ref={meshRef} geometry={geometry}>
      <pointsMaterial
        size={0.05}
        color="#0A91F9"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function DNAHelix() {
  const groupRef = useRef<THREE.Group>(null);
  const strand1Ref = useRef<THREE.Points>(null);
  const strand2Ref = useRef<THREE.Points>(null);
  const connectionRefs = useRef<THREE.LineSegments>(null);

  const helixPoints = 100;
  const helixRadius = 1.8;
  const helixHeight = 8;
  const turns = 3;

  const [strand1Positions, strand2Positions, connectionPositions] = useMemo(() => {
    const s1 = new Float32Array(helixPoints * 3);
    const s2 = new Float32Array(helixPoints * 3);
    const conn = new Float32Array(helixPoints * 6); // 2 points per connection

    for (let i = 0; i < helixPoints; i++) {
      const t = (i / helixPoints) * Math.PI * 2 * turns;
      const y = (i / helixPoints) * helixHeight - helixHeight / 2;

      s1[i * 3] = Math.cos(t) * helixRadius;
      s1[i * 3 + 1] = y;
      s1[i * 3 + 2] = Math.sin(t) * helixRadius;

      s2[i * 3] = Math.cos(t + Math.PI) * helixRadius;
      s2[i * 3 + 1] = y;
      s2[i * 3 + 2] = Math.sin(t + Math.PI) * helixRadius;

      // Connections between strands (every 5th point for cleaner look)
      if (i % 3 === 0) {
        const ci = (Math.floor(i / 3)) * 6;
        if (ci < helixPoints * 6) {
          conn[ci] = s1[i * 3];
          conn[ci + 1] = s1[i * 3 + 1];
          conn[ci + 2] = s1[i * 3 + 2];
          conn[ci + 3] = s2[i * 3];
          conn[ci + 4] = s2[i * 3 + 1];
          conn[ci + 5] = s2[i * 3 + 2];
        }
      }
    }
    return [s1, s2, conn];
  }, []);

  const strand1Geo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(strand1Positions, 3));
    return geo;
  }, [strand1Positions]);

  const strand2Geo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(strand2Positions, 3));
    return geo;
  }, [strand2Positions]);

  const connectionGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(connectionPositions, 3));
    return geo;
  }, [connectionPositions]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={[3, 0, -2]}>
      <points ref={strand1Ref} geometry={strand1Geo}>
        <pointsMaterial
          size={0.08}
          color="#0546B6"
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      <points ref={strand2Ref} geometry={strand2Geo}>
        <pointsMaterial
          size={0.08}
          color="#0A91F9"
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      <lineSegments ref={connectionRefs} geometry={connectionGeo}>
        <lineBasicMaterial
          color="#C5ECF4"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

function FloatingOrb() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const shaderData = useMemo(
    () => ({
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color('#0546B6') },
        uColor2: { value: new THREE.Color('#0A91F9') },
        uColor3: { value: new THREE.Color('#C5ECF4') },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float uTime;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          
          vec3 pos = position;
          float displacement = sin(pos.x * 2.0 + uTime) * 0.08
                             + cos(pos.y * 2.0 + uTime * 0.8) * 0.08
                             + sin(pos.z * 2.0 + uTime * 1.2) * 0.06;
          pos += normal * displacement;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        uniform float uTime;
        
        void main() {
          float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
          
          vec3 color = mix(uColor1, uColor2, vPosition.y * 0.5 + 0.5 + sin(uTime * 0.5) * 0.2);
          color = mix(color, uColor3, fresnel * 0.6);
          
          float alpha = 0.35 + fresnel * 0.4;
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
    }),
    []
  );

  useFrame((_, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05;
      meshRef.current.rotation.x += delta * 0.03;
    }
  });

  return (
    <mesh ref={meshRef} position={[-3, 0.5, -1]}>
      <icosahedronGeometry args={[1.5, 32]} />
      <shaderMaterial
        ref={materialRef}
        {...shaderData}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function HeroCanvas() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#0A91F9" />
        <pointLight position={[-10, -10, -5]} intensity={0.3} color="#0546B6" />
        <FloatingParticles />
        <DNAHelix />
        <FloatingOrb />
      </Canvas>
    </div>
  );
}

export default HeroCanvas;
