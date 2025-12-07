import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Sparkles, Float, Text, ScrollControls, useScroll, RoundedBox } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import GeneratorRing from './GeneratorRing';

// === 生物芯片切片 ===
function ContractSlice({ data, position, rotation }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const groupRef = useRef();

  // 材质：凝固的红色羊水/琥珀感
  const bioGlassMaterial = new THREE.MeshPhysicalMaterial({
    color: '#3a0005',
    emissive: '#4a0010',
    emissiveIntensity: 0.2,
    metalness: 0.2,
    roughness: 0.2,
    transmission: 0.8,
    thickness: 1.5,
    ior: 1.5,
    attenuationColor: '#ff0033',
    attenuationDistance: 0.8,
    clearcoat: 1,
  });

  const frameMaterial = new THREE.MeshStandardMaterial({
    color: '#8a4b2c',
    metalness: 1,
    roughness: 0.4,
  });

  useFrame((state, delta) => {
    const targetScale = hovered ? 1.05 : 1;
    if(groupRef.current) {
        groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);
    }
  });

  return (
    <group position={position} rotation={rotation}>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5} floatingRange={[-0.1, 0.1]}>
        <group
          ref={groupRef}
          onPointerOver={() => { document.body.style.cursor = 'pointer'; setHovered(true); }}
          onPointerOut={() => { document.body.style.cursor = 'auto'; setHovered(false); }}
          onClick={() => navigate('/contract')} 
        >
          {/* 主体 */}
          <RoundedBox args={[2.2, 3.2, 0.05]} radius={0.1} smoothness={4} material={bioGlassMaterial} />
          {/* 边框 */}
          <group position={[0, 0, -0.01]}>
             <RoundedBox args={[2.3, 3.3, 0.04]} radius={0.12} smoothness={4} material={frameMaterial} />
          </group>
          {/* 顶部发光条 */}
          <mesh position={[0, 1.4, 0.03]}>
             <boxGeometry args={[1.5, 0.02, 0.02]} />
             <meshBasicMaterial color="#ffcc00" toneMapped={false} />
          </mesh>

          {/* === 内容 === */}
          <group position={[0, 0, 0.06]}>
            {/* 名字 */}
            <Text
              position={[0, 0.5, 0]}
              fontSize={0.25}
              color={hovered ? "#ffffff" : "#ffcccc"}
              maxWidth={1.8}
              textAlign="center"
              letterSpacing={0.1}
            >
              {data.name?.toUpperCase() || "UNKNOWN SUBJECT"}
            </Text>
            
            {/* 角色 */}
            <group position={[0, 0.1, 0]}>
                <Text fontSize={0.12} color="#ffaa00" letterSpacing={0.2}>
                    {data.role ? `// ${data.role.toUpperCase()}` : "// UNKNOWN ROLE"}
                </Text>
            </group>

            {/* 装饰线 */}
            <mesh position={[0, -0.2, 0]}>
                <planeGeometry args={[1.5, 0.01]} />
                <meshBasicMaterial color="#4a0010" transparent opacity={0.5} />
            </mesh>

            {/* ⬇️ 这里修改了：显示日期 */}
            <Text
               position={[0, -1, 0]}
               fontSize={0.1}
               color="#ffcccc"
               opacity={0.6}
               letterSpacing={0.05}
            >
               {data.timestamp || "DATE UNKNOWN"}
            </Text>
            
            {/* ID 码 */}
            <Text position={[0, -1.3, 0]} fontSize={0.08} color="#ff0055" opacity={0.8}>
               ID: {data.id ? data.id.substr(0, 8).toUpperCase() : Math.random().toString(36).substr(2, 8).toUpperCase()}
            </Text>
          </group>

          {/* 悬停光晕 */}
          {hovered && (
            <mesh position={[0, 0, 0]}>
               <boxGeometry args={[2.35, 3.35, 0.05]} />
               <meshBasicMaterial color="#ff0055" wireframe />
            </mesh>
          )}
        </group>
      </Float>
    </group>
  );
}

// === 场景逻辑 ===
function RiverContent({ contracts }) {
  const scroll = useScroll();
  const groupRef = useRef();

  useFrame((state, delta) => {
    const xOffset = scroll.offset * -25; 
    if (groupRef.current) {
        groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, xOffset, delta * 2);
    }
  });

  return (
    <group ref={groupRef}>
      <GeneratorRing />
      {contracts.map((contract, index) => {
        const x = index * 4 + 4; 
        const y = Math.sin(index * 0.8) * 1.8; 
        const z = Math.cos(index * 0.8) * 2 - 2; 
        const rotX = (Math.random() - 0.5) * 0.3;
        const rotY = (Math.random() - 0.5) * 0.5;
        const rotZ = (Math.random() - 0.5) * 0.1;
        return (
          <ContractSlice key={index} data={contract} position={[x, y, z]} rotation={[rotX, rotY, rotZ]} />
        );
      })}
    </group>
  );
}

export default function Gallery() {
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('contracts') || '[]');
    // 如果没有数据，给一个示例
    if (saved.length === 0) {
        setContracts([
            { name: "Sample Subject", role: "Giver", timestamp: "2045-05-12", id: "INIT-001" },
        ]);
    } else {
        setContracts(saved);
    }
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#1a0005', position: 'relative' }}>
      <div style={{
        position: 'absolute', bottom: '5%', left: '50%', transform: 'translate(-50%, 0)', 
        zIndex: 10, textAlign: 'center', color: '#ffcccc', pointerEvents: 'none', opacity: 0.6,
        fontFamily: 'Courier New', letterSpacing: '2px', fontSize: '12px'
      }}>
        SCROLL TO EXPLORE THE ARCHIVE &rarr;
      </div>
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <color attach="background" args={['#1a0005']} />
        <fog attach="fog" args={['#1a0005', 5, 25]} /> 
        <ambientLight intensity={0.2} />
        <spotLight position={[10, 10, 10]} intensity={5} color="#ff3333" angle={0.5} penumbra={1} />
        <pointLight position={[-5, 0, -5]} intensity={5} color="#00aaff" />
        <Sparkles count={150} scale={15} size={2} color="#ff3366" opacity={0.3} speed={0.2} />
        <ScrollControls pages={Math.max(2, contracts.length * 0.8 + 1)} damping={0.3} horizontal>
           <RiverContent contracts={contracts} />
        </ScrollControls>
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={0.2} intensity={1.0} levels={9} mipmapBlur />
          <Noise opacity={0.05} />
          <Vignette eskil={false} offset={0.1} darkness={0.7} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}