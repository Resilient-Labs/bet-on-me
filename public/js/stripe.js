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
        amount: parseFloat(amount),
        goalId: goalId,
        goalName: goalName,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const data = await response.json();

    // redirect to Stripe checkout
    window.location.href = data.url;
    
  } catch (error) {
    console.error('Error:', error);
    alert('Payment failed. Please try again.');
    
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
      const amount = document.getElementById('wager-amount').value;
      const goalId = document.getElementById('goal-id').value;
      const goalName = document.getElementById('bigGoal').value;

      if (!amount || amount <= 0) {
        alert('Please enter a valid wager amount');
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