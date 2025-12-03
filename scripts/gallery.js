
document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById("gallery");
  const sampleContracts = JSON.parse(localStorage.getItem("contracts") || "[]");

  sampleContracts.forEach(contract => {
    const card = document.createElement("div");
    card.className = "contract-card";
    card.innerHTML = `<h3>${contract.giverName} ↔ ${contract.receiverName}</h3>
      <p>${contract.task}</p>`;
    gallery.appendChild(card);
  });
});