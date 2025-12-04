import { useEffect, useState } from 'react';

export default function Contract() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('latestContract'));
    setData(stored);
  }, []);

  if (!data) return <p>No contract found.</p>;

  return (
    <div className="contract-page">
      <div id="contractDisplay" className="contract-layout">
        <h2>🤝 Motherhood Contract 🤝</h2>
        <p><strong>{data.giverName}</strong> has entered into a caregiving agreement with <strong>{data.receiverName}</strong>.</p>
        <p><strong>Role:</strong> {data.role}</p>
        <p><strong>Task:</strong> {data.task}</p>
        <p><strong>Duration:</strong> {data.duration}</p>
        <p><strong>Emotional Boundaries:</strong> {data.boundaries}</p>
        <p><strong>Communication:</strong> {data.communication}</p>
        <p><strong>Notes:</strong> {data.notes}</p>
      </div>
    </div>
  );
}