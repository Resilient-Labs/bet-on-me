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

  // Add content
  dialog.innerHTML =
 `<h2>Invalid Input</h2>
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
  dialog.querySelector("button").addEventListener("mouseover", function() {
    this.style.backgroundColor = "#0056b3";
  });
  dialog.querySelector("button").addEventListener("mouseout", function() {
    this.style.backgroundColor = "#007BFF";
  });
  dialog.style.maxWidth = "300px";
  dialog.style.width = "80%";
  dialog.style.margin = " 10% auto";
  // Append to body
  document.body.appendChild(dialog);

  // Show it
  dialog.showModal();
  }
});



// Justin Jimenez worked on this logic here to make the button only appear when things are submitted.

let goalButton = document.getElementById('submitTaskButton')
goalButton.style.display = 'none'
let bigGoal = document.getElementById('bigGoal')
bigGoal.addEventListener('input', buttonLive )


function buttonLive () {
  let bigGoal = document.getElementById('bigGoal')
bigGoal.addEventListener('input', buttonLive )
if (bigGoal.value !== ''){  
  goalButton.style.display = 'unset'
} else {
  goalButton.style.display = 'none'
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

    checkbox.dataset.completed = isCompleted;
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
