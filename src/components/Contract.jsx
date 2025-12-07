import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';

export default function Contract() {
  const [data, setData] = useState(null);
  const printRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('latestContract'));
    setData(stored);
  }, []);

  const handleDownload = async () => {
    const element = printRef.current;
    if (!element) return;
    const canvas = await html2canvas(element, { backgroundColor: '#fff', scale: 2 });
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `Motherhood-Contract-${data.id}.png`;
    link.click();
  };

  if (!data) return <p>Loading...</p>;

  return (
    <div className="contract-page centered">
      {/* 截图区域 */}
      <div ref={printRef} className="contract-layout paper-look">
        
        {/* 顶部元数据 */}
        <div className="contract-header">
          <span className="contract-id">MOTHERHOOD CONTRACT {data.id}</span>
          <span className="contract-date">{data.timestamp}</span>
        </div>

        <hr className="divider"/>

        {/* 核心内容 */}
        <div className="contract-body">
          <p className="issued-to">
            <strong>Issued to:</strong> {data.isAnonymous ? "Anonymous" : data.name}
          </p>
          
          <div className="tags-row">
             {data.roles.map(r => <span key={r} className="role-tag">{r}</span>)}
          </div>

          <p className="duration-info"><strong>Duration:</strong> {data.duration}</p>

          {/* 自动生成的诗歌 */}
          <div className="poem-section">
            {data.poem.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>

          {/* 抽象的情感图形 (Visual Blob) */}
          <div className="emotional-blob"></div>

          <p className="motivation-text">
            <em>Motivation: {data.motivation}</em>
          </p>
        </div>

        <div className="signature-line">
            Signed digitally via Post-Motherhood Lab
        </div>
      </div>

      <div className="button-group">
        <button onClick={handleDownload} className="btn save-btn">Save to Archive (Image)</button>
        <button onClick={() => navigate('/gallery')} className="btn back-btn">Back to Gallery</button>
      </div>
    </div>
  );
}