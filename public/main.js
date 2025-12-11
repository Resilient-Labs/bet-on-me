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
    fetch(`/post/deleteTask/${_id}`, {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
      })
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




// !!!!!! TEST INFO FOR TEAMSPAGE.ejs!!!!!!////////
/// !!!!!! START!!!!!////////
router.get("/team-progress", ensureAuth, (req, res) => {
  const groupCode = {
    GroupName: "Task Team",
    groupTime: "30 Days",
    users: [
      {
        name: "Sarah Johnson",
        wager: 50,
        progress: 65
      },
      {
        name: "Mike Chen",
        wager: 75,
        progress: 42
      },
      {
        name: "Emily Rodriguez",
        wager: 100,
        progress: 88
      },
      {
        name: "James Parker",
        wager: 50,
        progress: 55
      },
      {
        name: "Lisa Anderson",
        wager: 80,
        progress: 73
      }
    ]
  };

  const cashJar = {
    total: groupCode.users.reduce((sum, user) => sum + user.wager, 0)
  };

  res.render('team-progress', { groupCode, cashJar });
});

// !!!!!! TEST INFO FOR TEAMS PAGE!!!!!!////////
/// !!!!!! END!!!!!////////