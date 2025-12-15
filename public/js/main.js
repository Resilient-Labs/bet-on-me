// Home page - Show form to create a group
const showFormBtn = document.getElementById("showFormBtn");
if (showFormBtn) {
  showFormBtn.addEventListener("click", function () {
    this.style.display = "none";
    document.getElementById("createGroupForm").style.display = "block";
  });
}

// Close late-join modal. ---Innocent
function closeLateModal() {
  const modal = document.querySelector(".modal-overlay");
  if (modal) {
    modal.remove();
  }
}
