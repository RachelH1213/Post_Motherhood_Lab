import { Suspense, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Stars, Sparkles, Float } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import DoorSingle from './DoorSingle';

function SceneContent() {
  const navigate = useNavigate();
  const [isEntering, setIsEntering] = useState(false);
  const bloomRef = useRef();

  const handleEnter = () => {
    setIsEntering(true);
    setTimeout(() => {
      navigate('/gallery');
    }, 2000);
  };

  useFrame((state, delta) => {
    if (isEntering && bloomRef.current) {
      // 爆发光芒
      bloomRef.current.intensity = THREE.MathUtils.lerp(bloomRef.current.intensity, 50, delta * 2);
      // 镜头拉近
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 2, delta * 0.5);
    }
  });

  return (
    <>
      <color attach="background" args={['#020005']} /> 
      
      <ambientLight intensity={0.2} /> 
      <spotLight position={[5, 10, 5]} angle={0.2} penumbra={1} intensity={10} color="#ffffff" castShadow />
      <pointLight position={[0, 2, -3]} intensity={5} color="#ff0055" />
      <pointLight position={[-3, -5, 2]} intensity={2} color="#001133" />

      <Suspense fallback={null}>
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5} floatingRange={[-0.2, 0.2]}>
          <DoorSingle isEntering={isEntering} onOpen={handleEnter} />
        </Float>
      </Suspense>

      <Stars radius={100} depth={50} count={3000} factor={4} fade opacity={0.6} />
      <Sparkles count={80} scale={6} size={1.5} color="white" opacity={0.4} speed={0.2} />

      <Environment preset="city" />

      <EffectComposer disableNormalPass>
        <Bloom 
          ref={bloomRef}
          luminanceThreshold={0.8} 
          intensity={1.5} 
          levels={9}
          mipmapBlur 
        />
        <Noise opacity={0.05} />
        <Vignette eskil={false} offset={0.1} darkness={0.7} />
      </EffectComposer>
    </>
  );
}

export default function Index() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      
      {/* ✨在此处定义闪烁动画的 CSS ✨ */}
      <style>{`
        @keyframes mystic-flicker {
          0%, 100% {
            opacity: 0.3;
            text-shadow: 0 0 0px rgba(255, 0, 85, 0);
            filter: blur(1px);
          }
          5% {
            opacity: 1;
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 0, 85, 0.6);
            filter: blur(0px);
          }
          10% { opacity: 0.3; text-shadow: none; }
          15% { opacity: 1; text-shadow: 0 0 10px rgba(255, 255, 255, 0.8); }
          50% {
            opacity: 0.8;
            text-shadow: 0 0 15px rgba(255, 0, 85, 0.4);
            filter: blur(0.5px);
          }
          60% { opacity: 0.2; }
          70% { opacity: 0.9; text-shadow: 0 0 20px rgba(255, 0, 85, 0.8); }
        }
        
        .flicker-title {
          animation: mystic-flicker 4s infinite alternate;
        }

        .flicker-text {
          animation: mystic-flicker 6s infinite reverse; /* 反向闪烁，错开节奏 */
        }
      `}</style>

      <div style={{
        position: 'absolute', bottom: '5%', left: '50%', transform: 'translate(-50%, 0)', 
        zIndex: 10, textAlign: 'center', color: '#ffc0cb', pointerEvents: 'none',
        fontFamily: 'Courier New', letterSpacing: '2px'
      }}>
        {/* 应用闪烁 CSS 类 */}
        {/* <h1 className="flicker-title" style={{ fontSize: '3rem', margin: 0 }}>POST-MOTHERHOOD LAB</h1> */}
        
        <p className="flicker-text" style={{ 
          marginTop: '10px', 
          fontSize: '1rem',
          letterSpacing: '4px',
          fontWeight: 'bold'
        }}>
          CLICK THE DOOR TO ENTER
        </p>
      </div>

      <Canvas camera={{ position: [0, 0, 5], fov: 40 }}>
        <SceneContent />
      </Canvas>
    </div>
  );
}