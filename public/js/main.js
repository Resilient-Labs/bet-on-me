// INLINE EDITING
document.querySelectorAll("#taskList li").forEach((li) => {
  const editBtn = li.querySelector(".btn-edit");
  const saveBtn = li.querySelector(".btn-save");
  const cancelBtn = li.querySelector(".btn-cancel");
  const span = li.querySelector(".task-text");
  const input = li.querySelector(".task-input");
  const taskId = li.dataset.id;

  // Edit Mode
  editBtn.onclick = () => {
    // hide span & edit button
    span.classList.add("d-none");
    editBtn.classList.add("d-none");

    // show input, save & cancel button
    input.classList.remove("d-none");
    saveBtn.classList.remove("d-none");
    cancelBtn.classList.remove("d-none");

    input.focus();
  };

  const toggleDefaultView = () => {
    // hide input, save & cancel button
    input.classList.add("d-none");
    saveBtn.classList.add("d-none");
    cancelBtn.classList.add("d-none");

    // show span & edit button
    span.classList.remove("d-none");
    editBtn.classList.remove("d-none");
  };

  // Cancel Edit Mode
  cancelBtn.onclick = () => toggleDefaultView();

  // Save Mode
  saveBtn.onclick = async () => {
    const updatedTask = input.value.trim();

    // only hit api if task name has changed
    if (span.textContent !== updatedTask) {
      const response = await fetch(`/task/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task_name: updatedTask }),
      });

      if (response.ok) {
        // update UI without full refresh
        span.textContent = updatedTask;
      } else {
        console.error("Error updating task");
      }
    }

    toggleDefaultView();
  };
});
