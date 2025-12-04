import { useNavigate } from 'react-router-dom';

export default function Generate() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const existing = JSON.parse(localStorage.getItem('contracts') || '[]');
    existing.push(data);
    localStorage.setItem('contracts', JSON.stringify(existing));
    localStorage.setItem('latestContract', JSON.stringify(data));

    navigate('/contract');
  };

  return (
    <div className="generate-page">
      <form id="contractForm" onSubmit={handleSubmit}>
        <label>Your Name <input type="text" name="giverName" required /></label>
        <label>You are a:
          <select name="role" required>
            <option value="giver">Giver</option>
            <option value="receiver">Receiver</option>
          </select>
        </label>
        <label>Receiver Name <input type="text" name="receiverName" required /></label>
        <label>Task Description <input type="text" name="task" required /></label>
        <label>Duration <input type="text" name="duration" placeholder="e.g. 3 weeks" /></label>
        <label>Emotional Boundaries <textarea name="boundaries" /></label>
        <label>Communication Method <input type="text" name="communication" /></label>
        <label>Optional Notes <textarea name="notes" /></label>
        <button type="submit">Generate Contract</button>
      </form>
    </div>
  );
}