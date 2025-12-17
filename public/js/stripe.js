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

// add event listener to wager button
document.addEventListener('DOMContentLoaded', () => {
  const wagerBtn = document.getElementById('place-wager-btn');
  
  if (wagerBtn) {
    wagerBtn.addEventListener('click', async () => {
      const amountInput = document.getElementById('wager-amount').value;
      const goalId = document.getElementById('goal-id').value;
      const goalName = document.getElementById('bigGoal').value;

      // validate amount is provided
      if (!amountInput || amountInput <= 0) {
        alert('Please enter a valid wager amount');
        return;
      }

      // convert to integer and validate
      const amount = parseInt(amountInput);
      
      // check if it's a whole number
      if (amount !== parseFloat(amountInput)) {
        alert('Please enter a whole dollar amount (no cents)');
        return;
      }

      // check maximum
      if (amount > 999) {
        alert('Maximum wager amount is $999');
        return;
      }

      // check minimum
      if (amount < 1) {
        alert('Minimum wager amount is $1');
        return;
      }

      if (!goalId) {
        alert('Please create a goal first');
        return;
      }

      await initiateWagerPayment(amount, goalId, goalName);
    });
  }

  // check if payment was cancelled
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('canceled') === 'true') {
    alert('Payment was canceled. You can try again when ready.');
  }
});