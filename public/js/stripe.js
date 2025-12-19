// handle wager payment
async function initiateWagerPayment(amount, goalId, goalName) {
  try {
    // show loading state
    const wagerBtn = document.getElementById('place-wager-btn');
    const originalText = wagerBtn.innerHTML;
    wagerBtn.disabled = true;
    wagerBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';

    const response = await fetch('/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: parseInt(amount),
        goalId: goalId,
        goalName: goalName,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error('Failed to create checkout session');
    }

    const data = await response.json();

    // redirect to Stripe checkout
    window.location.href = data.url;
    
  } catch (error) {
    console.error('Error:', error);
    alert('error.message');
    
    // reset button
    const wagerBtn = document.getElementById('place-wager-btn');
    wagerBtn.disabled = false;
    wagerBtn.innerHTML = '<i class="fa-solid fa-dollar-sign"></i> Place Wager';
  }
}

// Helper function to create styled modals
function showModal(title, message) {
  // Create the dialog
  const dialog = document.createElement("dialog");

  // Add content with proper structure matching the original modal
  dialog.innerHTML = `
    <div class="modal-content login-modal">
      <div class="modal-header">
        <h5 class="modal-title">${title}</h5>
        <button type="button" class="btn-close" onclick="this.closest('dialog').close(); this.closest('dialog').remove();" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p>${message}</p>
        <button type="button" class="btn" onclick="this.closest('dialog').close(); this.closest('dialog').remove();">Close</button>
      </div>
    </div>
  `;

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
    btnClose.style.backgroundColor = "rgb(212, 205, 225)";
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

  // Clean up on close
  dialog.addEventListener('close', () => {
    dialog.remove();
  });
}

// Add event listener to wager button
document.addEventListener('DOMContentLoaded', () => {
  const wagerBtn = document.getElementById('place-wager-btn');
  
  if (wagerBtn) {
    wagerBtn.addEventListener('click', async () => {
      const amountInput = document.getElementById('wager-amount').value;
      const goalId = document.getElementById('goal-id').value;
      const goalName = document.getElementById('bigGoal').value;

      // validate amount is provided
      if (!amountInput || amountInput <= 0) {
        showModal('Invalid amount', 'Please enter a valid wager amount');
        return;
      }

      // convert to integer and validate
      const amount = parseInt(amountInput);
      
      // check if it's a whole number
      if (amount !== parseFloat(amountInput)) {
        showModal('Invalid amount', 'Please enter a whole dollar amount (no cents)');
        return;
      }

      // check maximum
      if (amount > 999) {
        showModal('Amount too high', 'Maximum wager amount is $999');
        return;
      }

      // check minimum
      if (amount < 1) {
        showModal('Amount too low', 'Minimum wager amount is $1');
        return;
      }

      if (!goalId) {
        showModal('Missing goal', 'Please create a goal first');
        return;
      }

      await initiateWagerPayment(amount, goalId, goalName);
    });
  }

  // check if payment was cancelled
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('cancelled') === 'true') {
    showModal('Payment Cancelled', 'Payment was cancelled. You can try again when ready.');
  }
});


