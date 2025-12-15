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

// Toggle password visibility helper used by profile modal
function togglePassword(id, btn) {
  try {
    const input = document.getElementById(id);
    if (!input) return;
    // find icon element inside btn or sibling
    let icon = null;
    if (btn && btn.querySelector) icon = btn.querySelector('i');
    if (!icon && input.parentElement) icon = input.parentElement.querySelector('i');
    const wasHidden = input.type === 'password';
    input.type = wasHidden ? 'text' : 'password';
    if (icon) {
      // Explicitly use Font Awesome solid classes per request
      icon.classList.remove('fa-eye', 'fa-eye-slash', 'fa-solid', 'fas', 'fa-regular');
      if (input.type === 'text') {
        // unmasked -> show solid eye-slash
        icon.classList.add('fa-solid', 'fa-eye-slash');
      } else {
        // masked -> show solid eye
        icon.classList.add('fa-solid', 'fa-eye');
      }
    }
  } catch (e) { console.error('togglePassword error', e); }
}

// expose globally for inline onclick usage
window.togglePassword = togglePassword;

// Delegated handler: listen for any toggle-password clicks and operate by data-target
document.addEventListener('click', function (e) {
  const btn = e.target.closest && e.target.closest('.toggle-password');
  if (!btn) return;
  const target = btn.getAttribute('data-target');
  if (!target) return;
  try {
    togglePassword(target, btn);
  } catch (err) { console.error('delegated toggle error', err); }
});

// AJAX submit for change-password form to avoid redirect/refresh
(function () {
  try {
    const form = document.querySelector('form[action="/profile/changePassword"]');
    if (!form) return;
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const msgEl = document.getElementById('passwordChangeMessage');
      if (msgEl) msgEl.innerHTML = '';
      const currentPassword = (form.querySelector('input[name="currentPassword"]') || {}).value || '';
      const newPassword = (form.querySelector('input[name="newPassword"]') || {}).value || '';
      const confirmPassword = (form.querySelector('input[name="confirmPassword"]') || {}).value || '';
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
        });
        const json = await res.json().catch(() => null);
        if (res.ok && json && json.success) {
          if (msgEl) msgEl.innerHTML = `<div class="alert alert-success w-100 mt-2" role="alert">${json.message}</div>`;
          form.querySelectorAll('input[type="password"], input[type="text"]').forEach(i => i.value = '');
          // reset icons to hidden state
          document.querySelectorAll('.toggle-password i').forEach(icon => {
            icon.className = 'fa-solid fa-eye';
          });
        } else {
          const message = (json && (json.message || (json.errors && json.errors.map(e=>e.msg).join(', ')))) || 'Could not change password';
          if (msgEl) msgEl.innerHTML = `<div class="alert alert-danger w-100 mt-2" role="alert">${message}</div>`;
        }
      } catch (err) {
        if (msgEl) msgEl.innerHTML = `<div class="alert alert-danger w-100 mt-2" role="alert">Network error</div>`;
      }
    });
  } catch (e) { console.error('changePassword AJAX init failed', e); }
})();
