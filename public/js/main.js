// INLINE EDITING
document.querySelectorAll("#task-list li").forEach((li) => {
  const editBtn = li.querySelector(".edit-btn");
  const deleteBtn = li.querySelector(".delete-btn");
  const saveBtn = li.querySelector(".save-btn");
  const cancelBtn = li.querySelector(".cancel-btn");
  const span = li.querySelector(".task-text");
  const checkbox = li.querySelector(".checkbox");
  const input = li.querySelector(".task-input");
  const editForm = li.querySelector(".edit-task-form");
  const taskId = li.dataset.id;

  // prevent page refresh
  editForm.addEventListener("submit", (e) => {
    e.preventDefault();
  });

  // Edit Mode
  editBtn.onclick = () => {
    // hide span & edit button
    span.classList.add("d-none");
    editBtn.classList.add("d-none");
    deleteBtn.classList.add("d-none");
    checkbox.classList.add("d-none");

    input.focus();

    // show input, save & cancel button
    input.classList.remove("d-none");
    saveBtn.classList.remove("d-none");
    cancelBtn.classList.remove("d-none");
    editForm.classList.remove("d-none");

    input.focus();
  };

  const toggleDefaultView = () => {
    // hide input, save & cancel button
    input.classList.add("d-none");
    saveBtn.classList.add("d-none");
    cancelBtn.classList.add("d-none");
    editForm.classList.add("d-none");

    // show span & edit button
    span.classList.remove("d-none");
    editBtn.classList.remove("d-none");
    deleteBtn.classList.remove("d-none");
    checkbox.classList.remove("d-none");
  };

  // Cancel Edit Mode
  cancelBtn.onclick = () => {
    // reset input value to prevent stale text on edit
    input.value = span.textContent;
    toggleDefaultView();
  };

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

// DELETE TASK
const trash = document.getElementsByClassName("fa-trash");
Array.from(trash).forEach(function (element) {
  element.addEventListener("click", function () {
    const _id = this.closest("li").querySelector("span").getAttribute("name");
    fetch(`/task/${_id}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    }).then(function (response) {
      window.location.reload();
    });
  });
});
