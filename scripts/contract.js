document.addEventListener("DOMContentLoaded", () => {
  const data = JSON.parse(localStorage.getItem("latestContract"));
  const display = document.getElementById("contractDisplay");

  if (!data) return display.innerHTML = "<p>No contract found.</p>";

  display.innerHTML = `
    <h2>Motherhood Contract</h2>
    <p><strong>${data.giverName}</strong> has entered into a caregiving agreement with <strong>${data.receiverName}</strong>.</p>
    <p><strong>Role:</strong> ${data.role}</p>
    <p><strong>Task:</strong> ${data.task}</p>
    <p><strong>Duration:</strong> ${data.duration}</p>
    <p><strong>Emotional Boundaries:</strong> ${data.boundaries}</p>
    <p><strong>Communication:</strong> ${data.communication}</p>
    <p><strong>Notes:</strong> ${data.notes}</p>
  `;
});