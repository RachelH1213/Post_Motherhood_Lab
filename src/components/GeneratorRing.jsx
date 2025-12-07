import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useNavigate } from 'react-router-dom';
import { Float, useGLTF, Sparkles, Html } from '@react-three/drei'; // 引入 Html
import * as THREE from 'three';

export default function GeneratorRing() {
  const navigate = useNavigate();
  const ringRef = useRef();   
  const fetusRef = useRef();  
  const glowRef = useRef();   
  const [hovered, setHovered] = useState(false);

  // 加载模型
  const ringPath = import.meta.env.BASE_URL + 'models/organic_ring.glb';
  const fetusPath = import.meta.env.BASE_URL + 'models/fetus.glb';
  
  const ringGLTF = useGLTF(ringPath);
  const fetusGLTF = useGLTF(fetusPath);

  // 材质设置
  useEffect(() => {
    ringGLTF.scene.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshPhysicalMaterial({
          color: '#4a0010',
          emissive: '#ff0055',
          emissiveIntensity: 0.3,
          metalness: 0.4,
          roughness: 0.3,
          transmission: 0.2,
          thickness: 1,
          clearcoat: 1,
        });
      }
    });

    fetusGLTF.scene.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshPhysicalMaterial({
          color: '#da7e64',       
          emissive: '#ff5500',    
          emissiveIntensity: 0.8, 
          metalness: 0.2,
          roughness: 0.2,
          transmission: 0.5,      
          thickness: 0.5,
          clearcoat: 1,
        });
      }
    });
  }, [ringGLTF.scene, fetusGLTF.scene]);

  useFrame((state, delta) => {
    if (ringRef.current) {
      const targetScale = hovered ? 2.7 : 2.5;
      ringRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 3);
    }
    if (fetusRef.current) {
      fetusRef.current.rotation.y += delta * 0.2; 
      const fetusTargetScale = hovered ? 0.6 : 0.5;
      fetusRef.current.scale.lerp(new THREE.Vector3(fetusTargetScale, fetusTargetScale, fetusTargetScale), delta * 2);
    }
    if (glowRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.5 + 1.5;
      const targetIntensity = hovered ? 10 : 3 * pulse;
      const targetColor = hovered ? new THREE.Color('#ffffff') : new THREE.Color('#ff0055');
      glowRef.current.intensity = THREE.MathUtils.lerp(glowRef.current.intensity, targetIntensity, delta * 2);
      glowRef.current.color.lerp(targetColor, delta * 2);
    }
  });

  return (
    <group position={[0.1, 0, 2]}>
      <Float speed={2} rotationIntensity={0} floatIntensity={0.5} floatingRange={[-0.1, 0.1]}>
        
        {/* 外圈 */}
        <primitive 
          ref={ringRef} 
          object={ringGLTF.scene} 
          scale={2.5} 
          rotation={[-Math.PI / 0.5, 0, 0]} 
        />

        {/* 胚胎 */}
        <group position={[0, 0, 0]}> 
           <primitive 
             ref={fetusRef}
             object={fetusGLTF.scene}
             scale={0.6} 
             rotation={[0, Math.PI / 2, 0]} 
           />
        </group>

        {/* 光源和粒子 */}
        <pointLight ref={glowRef} position={[0, 0, 0]} distance={4} decay={2} />
        <Sparkles count={30} scale={1.2} size={5} speed={0.4} opacity={0.6} color="#ffcccc" />

        {/* 点击区域 */}
        <mesh 
          onClick={() => navigate('/generate')}
          onPointerOver={() => { document.body.style.cursor = 'pointer'; setHovered(true); }}
          onPointerOut={() => { document.body.style.cursor = 'auto'; setHovered(false); }}
          position={[0, 0, 0.5]}
        >
          <circleGeometry args={[0.6, 32]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
        
        
        <Html 
          position={[0, -2.3, -5]} 
          center 
          zIndexRange={[10, 0]} 
          distanceFactor={10} // 让文字随距离缩放，看起来更像 3D 的一部分
        >
          <div style={{ 
            width: '400px',
            textAlign: 'center', 
            pointerEvents: 'none', // 关键！让鼠标能穿透文字点到后面的模型
            opacity: 0.9,
          }}>
            <div style={{ 
              color: '#ffcccc', 
              fontSize: '40px', 
              marginBottom: '5px',
              textShadow: '0 0 15px #ff0055',
              animation: 'bounce 2s infinite'
            }}>
              ↑
            </div>
            <div style={{ 
              color: '#ffcccc', 
              fontFamily: "'Courier New', monospace", 
              fontSize: '14px', 
              letterSpacing: '2px',
              fontWeight: 'bold',
              textShadow: '0 0 10px #ff0055',
            
              padding: '8px 16px',
            //   borderRadius: '20px',
            //   border: '1px solid rgba(255, 0, 85, 0.3)',
              display: 'inline-block'
            }}>
              CLICK THE FETUS TO START
            </div>
          </div>
          <style>{`
            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
          `}</style>
        </Html>

      </Float>
    </group>
  );
}

useGLTF.preload(import.meta.env.BASE_URL + 'models/organic_ring.glb');
useGLTF.preload(import.meta.env.BASE_URL + 'models/fetus.glb');