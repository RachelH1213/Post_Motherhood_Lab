document.getElementById("contractForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const contractData = Object.fromEntries(formData.entries());

  const existing = JSON.parse(localStorage.getItem("contracts") || "[]");
  existing.push(contractData);
  localStorage.setItem("contracts", JSON.stringify(existing));

  localStorage.setItem("latestContract", JSON.stringify(contractData));
  window.location.href = "contract.html";
});