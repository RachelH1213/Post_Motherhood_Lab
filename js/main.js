const sampleContracts = [
  {
    title: "Weekly Check-in with Kai",
    task: "Emotional Support",
    startDate: "2025-12-01",
    endDate: "2026-02-01",
    description: "I agree to call and emotionally support Kai every Sunday."
  },
  {
    title: "Evening Storytime",
    task: "Parenting",
    startDate: "2025-12-05",
    endDate: "2026-03-01",
    description: "I will read a bedtime story to my nephew three times a week."
  }
];

function renderContracts() {
  const container = document.getElementById('contractList');
  if (!container) return;
  sampleContracts.forEach(contract => {
    const div = document.createElement('div');
    div.className = 'contract-card';
    div.innerHTML = `
      <h3>${contract.title}</h3>
      <p><strong>Task:</strong> ${contract.task}</p>
      <p><strong>Duration:</strong> ${contract.startDate} to ${contract.endDate}</p>
      <p>${contract.description}</p>
    `;
    container.appendChild(div);
  });
}

window.onload = renderContracts;