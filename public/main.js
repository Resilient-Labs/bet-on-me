var edit = document.getElementsByClassName("fa-pen");
var trash = document.getElementsByClassName("fa-trash");

Array.from(edit).forEach(function (element) {
  element.addEventListener('click', function () {
    const task = this.closest('li').innerText.trim()
    document.querySelector('input').value = task

    const _id = this.closest('li').querySelector('span').getAttribute("name")
    document.querySelector('#hide-task').value = _id
  });
});

Array.from(trash).forEach(function (element) {
  element.addEventListener('click', function () {
    const _id = this.closest('li').querySelector('span').getAttribute("name")
    // confirmation before deleting
    const confirmed = window.confirm("Are you sure you want to delete this task? This action cannot be undone.");
    if (!confirmed) return;

    fetch(`/task/${_id}`, {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    }).then(function (response) {
      window.location.reload()
    })
  });
});




// // Big Thing Edit/Save functionality
// document.getElementById('editBigThing').addEventListener('click', function (e) {
//   e.preventDefault();
//   document.getElementById('bigThing').focus();
// });

// document.getElementById('saveBigThing').addEventListener('click', function (e) {
//   e.preventDefault();
//   const bigThing = document.getElementById('bigThing').value;
//   // Add your save logic here
//   console.log('Saving big thing:', bigThing);
// });



// // Checkbox toggle functionality
// var checkboxes = document.getElementsByClassName("checkbox");
// Array.from(checkboxes).forEach(function (checkbox) {
//   checkbox.addEventListener('change', function () {
//     const taskItem = this.closest('li');
//     const task = taskItem.querySelector('span').innerText.trim();
//     const isCompleted = this.checked;

//     // Toggle completed class
//     if (isCompleted) {
//       taskItem.classList.add('completed');
//     } else {
//       taskItem.classList.remove('completed');
//     }

//     // Send update to server
//     fetch('messages/complete', {
//       method: 'put',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         'task': task,
//         'completed': isCompleted
//       })
//     }).then(function (response) {
//       if (!response.ok) {
//         // If request fails, revert the change
//         checkbox.checked = !isCompleted;
//         taskItem.classList.toggle('completed');
//       }
//     });
//   });
// });