import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import { useNavigate } from 'react-router-dom';

// === 背景 3D 场景 ===
function BackgroundScene({ activeColor }) {
  return (
    <>
      <color attach="background" args={['#1a0005']} />
      <fog attach="fog" args={['#1a0005', 5, 20]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={2} color={activeColor} />
      <Sparkles count={100} scale={10} size={2} color={activeColor} opacity={0.4} speed={0.5} />
      <Stars radius={100} depth={50} count={2000} factor={4} fade opacity={0.3} />
    </>
  );
}

export default function Generate() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  // === 表单数据 ===
  const [formData, setFormData] = useState({
    role: '',           
    name: '',           
    date: new Date().toISOString().split('T')[0], 
    careRoles: [],      // 多选 Roles
    customRole: '',     
    duration: 'Until further notice', 
    customDuration: '', 
    motivation: '',     
    customMotivation: '', 
  });

  // 颜色逻辑：Giver=红, Receiver=蓝
  const activeColor = formData.role === 'Giver' ? '#ff0055' : (formData.role === 'Receiver' ? '#00aaff' : '#ffaa00');

  // === 逻辑处理 ===
  // 1. 选择角色 (Step 1 -> 2)
  const selectRole = (role) => {
    setFormData({ ...formData, role });
    setStep(2);
  };

  // 2. 多选 Care Roles
  const toggleCareRole = (role) => {
    const current = formData.careRoles;
    if (current.includes(role)) {
      setFormData({ ...formData, careRoles: current.filter(r => r !== role) });
    } else {
      setFormData({ ...formData, careRoles: [...current, role] });
    }
  };

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  // 3. 提交
  const handleSubmit = () => {
    const existing = JSON.parse(localStorage.getItem('contracts') || '[]');
    
    // 整理 Roles
    const finalRoles = [...formData.careRoles];
    if (formData.customRole) finalRoles.push(formData.customRole);

    const newContract = { 
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        name: formData.name || "Anonymous",
        timestamp: formData.date, 
        role: formData.role, 
        roles: finalRoles,   
        duration: formData.duration === 'Specific event' ? formData.customDuration : formData.duration,
        motivation: formData.motivation === 'Other' ? formData.customMotivation : formData.motivation,
        visual: 'generated' // 自动生成
    };

    localStorage.setItem('contracts', JSON.stringify([...existing, newContract]));
    navigate('/gallery');
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: 'black', overflow: 'hidden' }}>
      
      {/* 1. 背景 3D 画布 */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <Canvas camera={{ position: [0, 0, 5] }}>
          <BackgroundScene activeColor={activeColor} />
          <EffectComposer disableNormalPass>
            <Bloom luminanceThreshold={0.5} intensity={1.5} levels={9} mipmapBlur />
            <Noise opacity={0.05} />
            <Vignette eskil={false} offset={0.1} darkness={0.7} />
          </EffectComposer>
        </Canvas>
      </div>

      {/* 2. UI 界面层 */}
      <div style={{ 
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10,
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        fontFamily: "'Courier New', monospace", color: '#ffcccc'
      }}>
        
        {/* === STEP 1: 角色选择 (完全保持你提供的代码样式) === */}
        {step === 1 && (
          <div style={{ animation: 'fadeIn 1s' }}>
            <h2 style={{ textAlign: 'center', fontSize: '1.5rem', marginBottom: '40px', letterSpacing: '4px', textShadow: '0 0 10px #ff0055' }}>
              INITIATE PROTOCOL: SELECT ROLE
            </h2>
            
            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {/* Giver Card */}
              <div 
                onClick={() => selectRole('Giver')}
                className="role-card"
                style={{
                  width: '250px', height: '350px', border: '1px solid #ff0055', cursor: 'pointer',
                  background: 'rgba(50, 0, 10, 0.6)', borderRadius: '10px', padding: '20px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(5px)'
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>●</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#ffaa00' }}>GIVER</h3>
                <p style={{ fontSize: '0.8rem', textAlign: 'center', opacity: 0.7, lineHeight: '1.5' }}>
                  The Source. The Vessel.<br/>Provider of biological material or care.
                </p>
              </div>

              {/* Receiver Card */}
              <div 
                onClick={() => selectRole('Receiver')}
                className="role-card"
                style={{
                  width: '250px', height: '350px', border: '1px solid #00aaff', cursor: 'pointer',
                  background: 'rgba(0, 20, 40, 0.6)', borderRadius: '10px', padding: '20px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(5px)'
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>○</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#00aaff' }}>RECEIVER</h3>
                <p style={{ fontSize: '0.8rem', textAlign: 'center', opacity: 0.7, lineHeight: '1.5' }}>
                  The New Life. The Future.<br/>Beneficiary of the contract.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* === STEP 2: Name & Care Types (新表单样式) === */}
        {step === 2 && (
          <div className="fade-in form-container">
            <h2 className="step-title">STEP 2: DEFINE PARAMETERS</h2>
            
            <div className="input-group">
                <label>SUBJECT NAME</label>
                <input 
                  type="text" value={formData.name} placeholder="ENTER NAME..."
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
            </div>
            <div className="input-group">
                <label>DATE OF INCEPTION</label>
                <input 
                  type="date" value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
            </div>

            <hr className="divider"/>

            <label className="section-label">WHAT KIND OF CARE IS OFFERED?</label>
            <div className="checkbox-grid">
                {[
                  { label: "Emotional Supporter", emoji: "🧠" },
                  { label: "Educational Guide", emoji: "📚" },
                  { label: "Night Watcher", emoji: "🛏️" },
                  { label: "Meal Companion", emoji: "🍳" },
                  { label: "Fix-it Ally", emoji: "🛠️" },
                  { label: "Gentle Listener", emoji: "🌸" },
                  { label: "Memory Keeper", emoji: "💬" },
                  { label: "Legal Proxy", emoji: "🧾" },
                ].map((item) => (
                   <div 
                     key={item.label} 
                     className={`checkbox-item ${formData.careRoles.includes(item.label) ? 'selected' : ''}`}
                     onClick={() => toggleCareRole(item.label)}
                   >
                     <span>{item.emoji} {item.label}</span>
                   </div>
                ))}
                
                {/* Other Input */}
                <div 
                     className={`checkbox-item ${formData.customRole ? 'selected' : ''}`}
                     onClick={() => document.getElementById('customRoleInput').focus()}
                >
                     <span>✨ Other: </span>
                     <input 
                        id="customRoleInput"
                        type="text" 
                        value={formData.customRole}
                        onChange={(e) => setFormData({...formData, customRole: e.target.value})}
                        className="inline-input"
                     />
                </div>
            </div>

            <div className="nav-buttons">
                <button onClick={handleBack}>&lt; BACK</button>
                <button onClick={handleNext} disabled={!formData.name}>NEXT &gt;</button>
            </div>
          </div>
        )}

        {/* === STEP 3: Duration === */}
        {step === 3 && (
          <div className="fade-in form-container">
            <h2 className="step-title">STEP 3: TEMPORAL BOUNDS</h2>
            <p className="step-desc">Caregiving is not assumed to be eternal.</p>

            <label className="section-label">CONTRACT DURATION</label>
            <select 
                value={formData.duration} 
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
            >
                <option value="Until further notice">Until further notice</option>
                <option value="3 months">3 Months</option>
                <option value="6 months">6 Months</option>
                <option value="1 year">1 Year</option>
                <option value="Specific event">Specific Event...</option>
            </select>

            {formData.duration === 'Specific event' && (
                <div className="input-group slide-down" style={{marginTop: '20px'}}>
                    <label>SPECIFY EVENT</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Until recovery..."
                      value={formData.customDuration}
                      onChange={(e) => setFormData({...formData, customDuration: e.target.value})}
                    />
                </div>
            )}

            <div className="nav-buttons">
                <button onClick={handleBack}>&lt; BACK</button>
                <button onClick={handleNext}>NEXT &gt;</button>
            </div>
          </div>
        )}

        {/* === STEP 4: Motivation === */}
        {step === 4 && (
          <div className="fade-in form-container">
            <h2 className="step-title">STEP 4: CORE MOTIVATION</h2>
            <p className="step-desc">Why this contract? Why now?</p>

            <div className="radio-list">
                {[
                  "I’ve experienced good care and want to give back",
                  "I’ve lacked care and want to break the cycle",
                  "I believe caregiving should be shared",
                  "I’m trying a new kind of connection"
                ].map((reason) => (
                    <div 
                        key={reason} 
                        className={`radio-item ${formData.motivation === reason ? 'selected' : ''}`}
                        onClick={() => setFormData({...formData, motivation: reason})}
                    >
                        <div className="radio-circle"></div>
                        <span>{reason}</span>
                    </div>
                ))}

                <div 
                    className={`radio-item ${formData.motivation === 'Other' ? 'selected' : ''}`}
                    onClick={() => setFormData({...formData, motivation: 'Other'})}
                >
                    <div className="radio-circle"></div>
                    <span>Other: </span>
                    <input 
                        type="text" 
                        value={formData.customMotivation}
                        onChange={(e) => setFormData({...formData, motivation: 'Other', customMotivation: e.target.value})}
                        className="inline-input"
                        placeholder="..."
                    />
                </div>
            </div>

            {/* 这里直接去 Preview，跳过手动选择 Visual */}
            <div className="nav-buttons">
                <button onClick={handleBack}>&lt; BACK</button>
                <button onClick={handleNext} disabled={!formData.motivation}>PREVIEW &gt;</button>
            </div>
          </div>
        )}

        {/* === STEP 5: Preview (Auto-generated Visual) === */}
        {step === 5 && (
          <div className="fade-in form-container preview-container">
             <div className="preview-header">
                <h2>// CONTRACT PREVIEW</h2>
                <div className="id-badge">ID: PENDING...</div>
             </div>

             <div className="preview-body">
                {/* 自动生成的生物视觉 (Bio-Signature) */}
                <div className="bio-visual-container">
                    <div className={`bio-blob ${formData.role.toLowerCase()}`}></div>
                    <div className="bio-overlay">BIO-SIGNATURE GENERATED</div>
                </div>

                <div className="preview-details">
                    <p><strong>ISSUED TO:</strong> {formData.name}</p>
                    <p><strong>DATE:</strong> {formData.date}</p>
                    <hr className="divider"/>
                    <p><strong>ROLE:</strong> {formData.role}</p>
                    <p><strong>DURATION:</strong> {formData.duration === 'Specific event' ? formData.customDuration : formData.duration}</p>
                    <p><strong>MOTIVATION:</strong> "{formData.motivation === 'Other' ? formData.customMotivation : formData.motivation}"</p>
                </div>
                
                <div className="roles-tags">
                    {formData.careRoles.map(r => <span key={r} className="tag">{r}</span>)}
                    {formData.customRole && <span className="tag">{formData.customRole}</span>}
                </div>

                <div className="poetic-statement">
                    "I step into this bond not by blood, but by choice. 
                    I offer my {formData.careRoles[0] ? formData.careRoles[0].toLowerCase() : 'care'} 
                    to weave a new net of safety."
                </div>
             </div>

             <div className="nav-buttons">
                <button onClick={handleBack}>&lt; EDIT</button>
                <button onClick={handleSubmit} className="primary-btn">SIGN & ARCHIVE</button>
            </div>
          </div>
        )}

      </div>

      {/* 样式表 (保留之前的 CSS，用于 Step 2-5 的美化) */}
      <style>{`
        /* Step 1 Hover Effects */
        .role-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 0 30px rgba(255, 0, 85, 0.3);
          background: rgba(80, 0, 20, 0.8) !important;
        }

        /* Common Styles */
        .fade-in { animation: fadeIn 0.8s ease-out; width: 100%; max-width: 600px; padding: 20px; box-sizing: border-box; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        .step-title { font-size: 1.5rem; letter-spacing: 3px; text-align: center; margin-bottom: 10px; text-shadow: 0 0 10px #ff0055; }
        .step-desc { text-align: center; font-size: 0.9rem; margin-bottom: 30px; opacity: 0.8; }

        /* Form Container */
        .form-container { background: rgba(20, 0, 5, 0.9); border: 1px solid #ff0055; padding: 40px; border-radius: 4px; box-shadow: 0 0 40px rgba(255, 0, 85, 0.15); max-height: 90vh; overflow-y: auto; }
        
        .input-group { margin-bottom: 20px; }
        label, .section-label { display: block; font-size: 0.8rem; margin-bottom: 10px; color: #ffaa00; letter-spacing: 1px; font-weight: bold; }
        input, select { width: 100%; background: rgba(0,0,0,0.5); border: 1px solid #ffcccc; color: white; padding: 12px; font-family: inherit; font-size: 1rem; outline: none; }
        input:focus, select:focus { border-color: #ff0055; box-shadow: 0 0 10px rgba(255, 0, 85, 0.3); }

        .divider { border: 0; border-top: 1px dashed rgba(255, 0, 85, 0.5); margin: 20px 0; }

        /* Checkbox Grid */
        .checkbox-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 30px; }
        .checkbox-item { border: 1px solid rgba(255, 204, 204, 0.3); padding: 10px; cursor: pointer; transition: 0.2s; display: flex; align-items: center; }
        .checkbox-item:hover { background: rgba(255, 255, 255, 0.1); }
        .checkbox-item.selected { background: rgba(255, 0, 85, 0.3); border-color: #ff0055; }
        .inline-input { background: transparent; border: none; border-bottom: 1px solid #ffaa00; margin-left: 10px; width: 40%; padding: 2px; }

        /* Radio List */
        .radio-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 30px; }
        .radio-item { padding: 15px; border: 1px solid rgba(255, 255, 255, 0.2); cursor: pointer; display: flex; align-items: center; transition: 0.2s; }
        .radio-item.selected { border-color: #ff0055; background: rgba(255, 0, 85, 0.1); }
        .radio-circle { width: 12px; height: 12px; border-radius: 50%; border: 1px solid white; margin-right: 15px; }
        .radio-item.selected .radio-circle { background: #ff0055; border-color: #ff0055; }

        /* Auto Visual (Blob) */
        .bio-visual-container { position: relative; width: 100%; height: 150px; background: #000; overflow: hidden; margin-bottom: 20px; border: 1px solid #333; display: flex; justify-content: center; align-items: center; }
        .bio-blob { width: 80px; height: 80px; border-radius: 50%; filter: blur(20px); animation: pulseBlob 4s infinite alternate; }
        .bio-blob.giver { background: radial-gradient(circle, #ff0055, #4a0010); box-shadow: 0 0 40px #ff0055; }
        .bio-blob.receiver { background: radial-gradient(circle, #00aaff, #002244); box-shadow: 0 0 40px #00aaff; }
        .bio-overlay { position: absolute; bottom: 5px; right: 5px; font-size: 0.7rem; color: #666; font-family: sans-serif; }
        
        @keyframes pulseBlob { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(1.5); opacity: 1; } }

        /* Preview Details */
        .preview-body p { margin: 5px 0; font-size: 0.9rem; }
        .tag { display: inline-block; background: rgba(255, 170, 0, 0.2); color: #ffaa00; padding: 2px 8px; margin: 2px; font-size: 0.7rem; border: 1px solid #ffaa00; }
        .poetic-statement { margin-top: 20px; font-style: italic; border-left: 3px solid #ff0055; padding-left: 15px; opacity: 0.9; line-height: 1.5; font-size: 0.9rem; }

        /* Navigation */
        .nav-buttons { display: flex; gap: 20px; margin-top: 20px; }
        button { flex: 1; padding: 15px; background: transparent; border: 1px solid #ffcccc; color: #ffcccc; cursor: pointer; font-family: inherit; font-size: 0.9rem; transition: 0.3s; }
        button:hover { background: rgba(255, 255, 255, 0.1); }
        button:disabled { opacity: 0.3; cursor: not-allowed; }
        button.primary-btn { background: #ff0055; border: none; color: white; font-weight: bold; }
        button.primary-btn:hover { background: #ff3366; box-shadow: 0 0 20px rgba(255, 0, 85, 0.5); }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #1a0005; }
        ::-webkit-scrollbar-thumb { background: #ff0055; }
      `}</style>

    </div>
  );
}