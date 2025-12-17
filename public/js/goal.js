//prevent submitting Goal if the input is empty
let goalForm = document.querySelector(".goal-setting");
goalForm.addEventListener("submit", (e) => {
  e.preventDefault();
  document.querySelector("#bigGoal")
  const goalInput = document.querySelector("#bigGoal")
  if (goalInput.value.trim() !== '') {
    goalForm.submit()
  }
  else {
    // Create the dialog
    const dialog = document.createElement("dialog");

<<<<<<< HEAD
    // Add content with proper structure matching the original modal
dialog.innerHTML = `
<div class="modal-content login-modal">
  <div class="modal-header">
    <h5 class="modal-title">Invalid Input</h5>
    <button type="button" class="btn-close" onclick="this.closest('dialog').close()" aria-label="Close"></button>
  </div>
  <div class="modal-body">
    <p>Where's that goal at? Huh???</p>
    <button type="button" class="btn" onclick="this.closest('dialog').close()">Close</button>
  </div>
</div>
`;
=======
    // Add content
    dialog.innerHTML =
      `<h2>Invalid input</h2>
  <p>Where's that goal at? Huh???</p>
  <button onclick="this.closest('dialog').close()">Close</button>`;
    dialog.style.padding = "20px";
    dialog.style.borderRadius = "8px";
    dialog.style.border = "1px solid #ccc";
    dialog.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
    dialog.style.fontFamily = "Arial, sans-serif";
    dialog.style.textAlign = "center";
    dialog.querySelector("h2").style.marginBottom = "10px";
    dialog.querySelector("p").style.marginBottom = "20px";
    dialog.querySelector("button").style.padding = "8px 16px";
    dialog.querySelector("button").style.border = "none";
    dialog.querySelector("button").style.borderRadius = "4px";
    dialog.querySelector("button").style.backgroundColor = "#007BFF";
    dialog.querySelector("button").style.color = "#fff";
    dialog.querySelector("button").style.cursor = "pointer";
    dialog.querySelector("button").addEventListener("mouseover", function () {
      this.style.backgroundColor = "#0056b3";
    });
    dialog.querySelector("button").addEventListener("mouseout", function () {
      this.style.backgroundColor = "#007BFF";
    });
    dialog.style.maxWidth = "300px";
    dialog.style.width = "80%";
    dialog.style.margin = " 10% auto";
    // Append to body
    document.body.appendChild(dialog);
>>>>>>> afc96d6 (fix text and punctuation)

// Apply styles to match your CSS
dialog.style.padding = "0";
dialog.style.border = "2px solid var(--color-black)";
dialog.style.borderRadius = "1rem";
dialog.style.overflow = "hidden";
dialog.style.maxWidth = "500px";
dialog.style.width = "90%";
dialog.style.backgroundColor = "transparent";

// Style the modal header
const modalHeader = dialog.querySelector('.modal-header');
if (modalHeader) {
modalHeader.style.padding = "1rem";
modalHeader.style.display = "flex";
modalHeader.style.justifyContent = "space-between";
modalHeader.style.alignItems = "center";
modalHeader.style.backgroundColor = "rgb(174, 223, 194)";
}

// Style the title
const modalTitle = dialog.querySelector('.modal-title');
if (modalTitle) {
modalTitle.style.margin = "0";
modalTitle.style.color = "var(--color-black)";
modalTitle.style.fontSize = "1.25rem";
modalTitle.style.fontWeight = "bold";
}

// Style the close button (X)
const btnClose = dialog.querySelector('.btn-close');
if (btnClose) {
btnClose.style.backgroundColor = "rgb(212 205 225)";
btnClose.style.height = "1.2rem";
btnClose.style.width = "1.4rem";
btnClose.style.opacity = "1";
btnClose.style.border = "none";
btnClose.style.cursor = "pointer";
}

// Style the modal body
const modalBody = dialog.querySelector('.modal-body');
if (modalBody) {
modalBody.style.backgroundColor = "rgb(174, 223, 194)";
modalBody.style.padding = "1.5rem";
modalBody.style.textAlign = "center";
}

// Style the paragraph
const paragraph = dialog.querySelector('.modal-body p');
if (paragraph) {
paragraph.style.color = "var(--color-black)";
paragraph.style.marginBottom = "1.5rem";
paragraph.style.fontSize = "1rem";
}

// Style the Close button
const closeBtn = dialog.querySelector('.modal-body button');
if (closeBtn) {
closeBtn.style.backgroundColor = "var(--color-yellow)";
closeBtn.style.border = "1px solid var(--color-black)";
closeBtn.style.color = "var(--color-black)";
closeBtn.style.fontSize = "1.2rem";
closeBtn.style.fontWeight = "bold";
closeBtn.style.padding = ".5rem 1.5rem";
closeBtn.style.borderRadius = ".25rem";
closeBtn.style.cursor = "pointer";
closeBtn.style.transition = "all 0.3s ease";

// Hover effects
closeBtn.addEventListener('mouseover', function() {
  this.style.backgroundColor = "var(--color-sky-blue)";
  this.style.borderColor = "var(--color-black)";
});

closeBtn.addEventListener('mouseout', function() {
  this.style.backgroundColor = "var(--color-yellow)";
  this.style.borderColor = "var(--color-black)";
});
}

// Remove default dialog backdrop and add custom styling
dialog.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";

// Append to body
document.body.appendChild(dialog);

// Show it
dialog.showModal();
  }
});

// Justin Jimenez worked on this logic here to make the button only appear when things are submitted.

let goalButton = document.getElementById("submitTaskButton");
if (goalButton) {
  goalButton.style.display = "none";
  let bigGoal = document.getElementById("bigGoal");
  bigGoal.addEventListener("input", buttonLive);
}

function buttonLive() {
  let bigGoal = document.getElementById("bigGoal");
  bigGoal.addEventListener("input", buttonLive);
  if (bigGoal.value !== "") {
    goalButton.style.display = "unset";
  } else {
    goalButton.style.display = "none";
  }
}

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

  // allow esc key to also cancel editing
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!input.classList.contains("d-none")) {
        console.log("by");
        cancelBtn.onclick();
      }
    }
  });

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

  let isCompleted = checkbox.dataset.completed === "true";

  // Update task completion status
  checkbox.onclick = async () => {
    isCompleted = !isCompleted;

    const response = await fetch(`/task/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        task_is_completed: isCompleted,
      }),
    });

    if (!response.ok) {
      console.error("Error updating task");
    }

    // update styling
    isCompleted
      ? span.classList.add("strike-through")
      : span.classList.remove("strike-through");

    const data = await response.json();

    document.getElementById("goalCompletedBtn").disabled = !data.goalCompleted;

    checkbox.dataset.completed = isCompleted;

    // update team preview bars if memberProgress provided
    if (data && data.memberProgress && Array.isArray(data.memberProgress)) {
      data.memberProgress.forEach(mp => {
        try {
          const sel = `.tp-progress-bar[data-user-id="${mp.userId}"]`;
          const bar = document.querySelector(sel);
          if (bar) {
            bar.setAttribute('data-percent', mp.percent);
            bar.style.width = Math.max(0, Math.min(100, mp.percent)) + '%';
            bar.setAttribute('aria-valuenow', mp.percent);
            
            // update small percent text - find by matching user-id in the team-member-card
            const percentText = document.querySelector(`.member-percent[data-user-id="${mp.userId}"]`);
            if (percentText) {
              percentText.textContent = mp.percent + '% Complete';
            }
          }
        } catch (e) { console.error('update team preview failed', e); }
      });
    }

    const goalBtn = document.getElementById("goalCompletedBtn");
    if (data.goalCompleted && goalBtn) {
      goalBtn.classList.add("all-tasks-done");
    } else if (goalBtn) {
      goalBtn.classList.remove("all-tasks-done");
    }

  };
});

// DELETE TASK
// const trash = document.querySelectorAll("#task-list .delete-btn");

// Array.from(trash).forEach(function (element) {
//   element.addEventListener("click", async function () {
//     const _id = this.closest("li").querySelector("span").getAttribute("name");

//     // confirmation before deleting
//     const confirmed = window.confirm(
//       "Are you sure you want to delete this task? This action cannot be undone."
//     );
//     if (!confirmed) return;

//     const response = await fetch(`/task/${_id}`, {
//       method: "delete",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({}),
//     });

//     if (response.ok) {
//       window.location.reload();
//     } else {
//       console.error("Failed to delete task");
//     }
//   });
// });

// DELETE TASK
const trash = document.querySelectorAll("#task-list .delete-btn");
const deleteModal = document.getElementById("deleteModal");
const confirmDeleteBtn = document.getElementById("confirmDelete");
const cancelDeleteBtn = document.getElementById("cancelDelete");
let taskToDelete = null;

Array.from(trash).forEach(function (element) {
  element.addEventListener("click", function () {
    const _id = this.closest("li").querySelector("span").getAttribute("name");
    taskToDelete = _id;
    
    // Show modal
    deleteModal.showModal();
  });
});

// Cancel delete
cancelDeleteBtn.addEventListener("click", () => {
  deleteModal.close();
  taskToDelete = null;
});

// Confirm delete
confirmDeleteBtn.addEventListener("click", async () => {
  if (!taskToDelete) return;
  
  const response = await fetch(`/task/${taskToDelete}`, {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  if (response.ok) {
    window.location.reload();
  } else {
    console.error("Failed to delete task");
  }
  
  deleteModal.close();
  taskToDelete = null;
});

// Close modal when clicking outside
deleteModal.addEventListener("click", (e) => {
  if (e.target === deleteModal) {
    deleteModal.close();
    taskToDelete = null;
  }
});
