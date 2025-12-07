import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function DoorSingle({ onOpen, isEntering }) {
  const hingeRef = useRef();
  const glowMeshRef = useRef();
  const [hovered, setHover] = useState(false);

  // === 🎨 颜色定义 ===
  
  // 1. 门板颜色 (极深红黑，接近黑色，但保留一点点红调)
  const doorColor = new THREE.Color("#4a001e"); 
  
  // 2. 门框颜色 (纯黑哑光)
  const frameColor = new THREE.Color("#4a001e");

  // 3. 内部光颜色 (RGB > 1 才能发光)
  const glowNormal = new THREE.Color(2, 0.1, 0.5); 
  const glowHover = new THREE.Color(10, 2, 5);     
  const glowEnter = new THREE.Color(50, 50, 50);   

  useFrame((state, delta) => {
    // --- 门旋转动画 ---
    const targetRotation = (hovered || isEntering) ? -1.6 : 0;
    hingeRef.current.rotation.y = THREE.MathUtils.lerp(hingeRef.current.rotation.y, targetRotation, delta * 3);

    // --- 发光板动画 ---
    if (glowMeshRef.current) {
      let targetColor = glowNormal;
      if (isEntering) targetColor = glowEnter;
      else if (hovered) targetColor = glowHover;

      glowMeshRef.current.material.color.lerp(targetColor, delta * 4);
      
      const targetScale = isEntering ? 8 : 1; 
      glowMeshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, 1), delta * 1);
    }
  });

  return (
    <group 
      onClick={onOpen}
      onPointerOver={() => { document.body.style.cursor = 'pointer'; setHover(true); }}
      onPointerOut={() => !isEntering && setHover(false)}
    >
      {/* === 1. 构建极细空心门框 === */}
      <group>
        {/* 左柱子 (变细：宽度 0.1) */}
        <mesh position={[-0.7, 0, 0]}>
          <boxGeometry args={[0.1, 2.6, 0.25]} />
          <meshStandardMaterial color={frameColor} roughness={0.7} metalness={0.2} />
        </mesh>
        
        {/* 右柱子 (变细：宽度 0.1) */}
        <mesh position={[0.7, 0, 0]}>
          <boxGeometry args={[0.1, 2.6, 0.25]} />
          <meshStandardMaterial color={frameColor} roughness={0.7} metalness={0.2} />
        </mesh>
        
        {/* 顶梁 (变细：高度 0.1) */}
        <mesh position={[0, 1.25, 0]}>
          <boxGeometry args={[1.5, 0.1, 0.25]} />
          <meshStandardMaterial color={frameColor} roughness={0.7} metalness={0.2} />
        </mesh>
        
        {/* 底座/门槛 */}
        <mesh position={[0, -1.25, 0]}>
          <boxGeometry args={[1.5, 0.1, 0.25]} />
          <meshStandardMaterial color={frameColor} roughness={0.7} metalness={0.2} />
        </mesh>
      </group>

      {/* === 2. 发光背板 (Bloom 源头) === */}
      <mesh ref={glowMeshRef} position={[0, 0, -0.5]}>
        <planeGeometry args={[1.3, 2.3]} />
        {/* toneMapped={false} 必须加，否则不发光 */}
        <meshBasicMaterial color={[2, 0.1, 0.5]} toneMapped={false} />
      </mesh>

      {/* === 3. 门板组 === */}
      {/* 铰链轴位置微调以匹配更细的边框 (-0.65) */}
      <group position={[-0.65, 0, 0.15]} ref={hingeRef}>
        
        {/* 门板主体 */}
        <mesh position={[0.65, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.3, 2.4, 0.08]} /> {/* 门板稍微薄一点 0.08 */}
          <meshPhysicalMaterial 
            color={doorColor}
            metalness={0.4} 
            roughness={1} // 稍微粗糙一点，显得更黑更沉稳
            clearcoat={0.1} // 降低反光，防止发白
          />
        </mesh>

        {/* 门把手 (保留金色作为点缀) */}
        <mesh position={[1.1, 0, 0.06]}>
          <sphereGeometry args={[0.06, 32, 32]} />
          <meshStandardMaterial color="#886600" metalness={1} roughness={0.4} />
        </mesh>

      </group>
    </group>
  );
}