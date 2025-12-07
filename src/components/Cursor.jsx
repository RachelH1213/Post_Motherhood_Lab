import { useEffect, useRef, useState } from 'react';
 
export default function Cursor() {
  const cursorRef = useRef(null); // 光球
  const [hovered, setHovered] = useState(false);
  
  // 使用 useRef 存储当前位置和目标位置，实现平滑拖尾
  const pos = useRef({ x: 0, y: 0 });     // 当前光球渲染位置
  const mouse = useRef({ x: 0, y: 0 });   // 真实鼠标位置
  const speed = 0.15; // 跟随速度 (0.01 - 1.0)，越小越飘，越大越跟手

  useEffect(() => {
    // 1. 监听鼠标移动，更新目标坐标
    const onMouseMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    // 2. 监听点击目标，判断是否需要变大
    const onMouseOver = (e) => {
      const target = e.target;
      // 检查是否悬停在可点击元素上 (链接、按钮、门、3D画布等)
      const isClickable = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT' ||
        target.style.cursor === 'pointer' || 
        target.closest('a') || 
        target.closest('button') ||
        target.closest('.door-container-3d'); // 特指我们的3D门

      setHovered(isClickable);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);

    // 3. 动画循环 (使用 requestAnimationFrame 实现平滑跟随)
    const loop = () => {
      if (cursorRef.current) {
        // 核心算法：当前位置 += (目标位置 - 当前位置) * 速度
        pos.current.x += (mouse.current.x - pos.current.x) * speed;
        pos.current.y += (mouse.current.y - pos.current.y) * speed;

        cursorRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }
      requestAnimationFrame(loop);
    };
    
    const animationFrame = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div 
      ref={cursorRef}
      style={{
        position: 'fixed',
        top: 0, 
        left: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        // 居中校正 (假设光球初始大小是 20px，这就偏移 -10px)
        marginTop: -10,
        marginLeft: -10,
        
        // === ✨ 核心样式：发光小球 ✨ ===
        width: 20,
        height: 20,
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // 核心亮白
        
        // 关键：利用多层阴影制造柔和的辉光
        boxShadow: hovered 
          ? '0 0 20px 5px rgba(255, 255, 255, 0.8), 0 0 40px 20px rgba(255, 0, 85, 0.6)' // 悬停：爆亮
          : '0 0 10px 2px rgba(255, 255, 255, 0.5), 0 0 20px 10px rgba(255, 0, 85, 0.3)', // 平时：柔和
        
        // 混合模式：让光球在黑色背景上更亮，在白色上也能看清
        mixBlendMode: 'screen', 
        
        // 交互动画
        transition: 'width 0.3s ease, height 0.3s ease, background-color 0.3s, box-shadow 0.3s',
        transformOrigin: 'center center',
        
        // 悬停时变大
        transform: hovered ? 'scale(2)' : 'scale(1)', // 注意：这个scale会被JS里的translate覆盖，所以我们主要靠宽高变化
      }}
    >
       {/* 内部再加一个小核，增加层次感 */}
       <div style={{
         position: 'absolute',
         top: '50%', left: '50%',
         transform: 'translate(-50%, -50%)',
         width: 4, height: 4,
         background: '#fff',
         borderRadius: '50%',
         opacity: hovered ? 0 : 1 // 悬停变大时隐藏小核，变成一大团光
       }} />
    </div>
  );
}