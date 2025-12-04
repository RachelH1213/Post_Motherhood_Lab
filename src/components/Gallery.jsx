import { useEffect, useState } from 'react';

export default function Gallery() {
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('contracts') || '[]');
    setContracts(saved);
  }, []);

  return (
    <div className="gallery-page">
      <header>
        <h1>Motherhood Contract Archive</h1>
        <a href="/generate" className="btn">Create New Contract</a>
      </header>
      <main id="gallery">
        {contracts.map((contract, index) => (
          <div key={index} className="contract-card">
            <h3>{contract.giverName} → {contract.receiverName}</h3>
            <p>{contract.task}</p>
          </div>
        ))}
      </main>
    </div>
  );
}