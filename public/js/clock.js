/*
  Shared cluster countdown logic

  - The countdown is owned by the server (Cluster.timerStartAt + Cluster.timerDurationSec).
  - This script only:
      * Renders the remaining time using FlipClock.
      * Fetches /api/team-data to get the shared remaining duration.
      * Adjusts UI (buttons, labels) based on whether the timer is running or finished.
  - No timing data is stored in localStorage anymore; the server is the single source of truth.
*/

let countdown = null;
const deleteCluster = document.getElementById('endGameBtn');
if (deleteCluster) {
  deleteCluster.style.display = 'none';
}

/**
 * Initialize FlipClock instance once.
 */
function initClock() {
  if (countdown) return; // already initialized

  countdown = new FlipClock($('.countdown'), {
    clockFace: 'DailyCounter',
    language: 'en',
    autoStart: false,
    countdown: true,
    callbacks: {
      start() {
        console.log('The clock has started!');
      },
      stop() {
        console.log('The clock has stopped!');
      },
      interval() {
        const time = this.factory.getTime().time;

        if (time <= 0) {
          console.log('Countdown reached zero!');
          this.stop();
          handleCountdownFinished();
        }
      },
    },
  });
}

/**
 * Set the FlipClock time in seconds and start it.
 * totalSeconds should come from the server duration.
 */
function setCountdownSeconds(totalSeconds) {
  initClock();
  if (!countdown) return;

  countdown.setTime(Math.max(0, Math.floor(totalSeconds)));
  countdown.start();
}

/**
 * When the countdown reaches zero (or server says it's done),
 * update UI elements accordingly.
 */
function handleCountdownFinished() {
  // Show leave button, hide start button
  const fetchBtn = document.getElementById('fetchButton');
  const teamProgressTitle = document.getElementById('teamProgressTitle');
  const leaveBtn = document.getElementById('leaveButton');

  if (fetchBtn) fetchBtn.style.display = 'none';
  if (leaveBtn) leaveBtn.style.display = 'block';

  if (deleteCluster) {
    setTimeout(() => {
      deleteCluster.style.display = 'block';
    }, 1000); // slight delay to ensure countdown UI updates first
  }

  if (teamProgressTitle) {
    teamProgressTitle.innerText = 'Cluster Completed!';
  }
}

/**
 * Convert duration { hours, minutes, seconds } into total seconds.
 */
function hmsToSeconds(duration) {
  return (
    Number(duration.hours || 0) * 3600 +
    Number(duration.minutes || 0) * 60 +
    Number(duration.seconds || 0)
  );
}

/**
 * Fetch the shared timer state for this cluster from the server
 * and sync the FlipClock + buttons/UI to it.
 */
async function syncTimerFromServer() {
  try {
    const res = await fetch('/api/data');
    const data = await res.json();

    console.log('Team data from server:', data);

    const duration = data.duration || { hours: 0, minutes: 0, seconds: 0 };
    const totalSeconds = hmsToSeconds(duration);
    const timerRunning = data.timerRunning === true;

    const wholeClock = document.getElementById('wholeClock');
    const challengeCall = document.getElementById('challengeCall');
    const joinChallenge = document.getElementById('joinChallenge');

    // If there is remaining time, show and start the clock
    if (totalSeconds > 0 && timerRunning) {
      if (wholeClock) wholeClock.style.display = 'unset';
      if (challengeCall) challengeCall.disabled = true;
      if (joinChallenge) joinChallenge.style.display = 'unset';

      setCountdownSeconds(totalSeconds);
      updateButtonVisibility({ running: true, hasRun: true });
    } else {
      // Timer finished or not started
      initClock();
      countdown.setTime(0);
      countdown.stop();

      if (wholeClock) wholeClock.style.display = 'unset';

      // If the server says timer has run but is now finished
      if (data.timerStartAt && !timerRunning) {
        handleCountdownFinished();
        updateButtonVisibility({ running: false, hasRun: true });
      } else {
        // Never started
        updateButtonVisibility({ running: false, hasRun: false });
      }
    }
  } catch (error) {
    console.error('Error syncing timer from server:', error);
  }
}

/**
 * Update button visibility based on whether the timer is running
 * or has ever been started.
 *
 * options.running: boolean (timer currently running)
 * options.hasRun: boolean (timer has ever been started)
 */
function updateButtonVisibility({ running, hasRun }) {
  const fetchBtn = document.getElementById('fetchButton');
  const leaveBtn = document.getElementById('leaveButton');
  const endBtn = document.getElementById('endGameBtn');

  if (running) {
    // Timer is running - hide start and leave, hide delete
    if (fetchBtn) fetchBtn.style.display = 'none';
    if (leaveBtn) leaveBtn.style.display = 'none';
    if (endBtn) endBtn.style.display = 'none';
  } else if (hasRun) {
    // Timer finished - show leave and delete, hide start
    if (fetchBtn) fetchBtn.style.display = 'none';
    if (leaveBtn) leaveBtn.style.display = 'block';
    if (endBtn) endBtn.style.display = 'unset';
  } else {
    // Never started - show start only
    if (fetchBtn) fetchBtn.style.display = 'block';
    if (leaveBtn) leaveBtn.style.display = 'none';
    if (endBtn) endBtn.style.display = 'none';
  }
}

/**
 * Fetch button: triggers server-side timer initialization (if not set)
 * and then syncs the client to the shared timer state.
 */
const fetchBtn = document.querySelector('#fetchButton');
if (fetchBtn) {
  fetchBtn.addEventListener('click', async () => {
    try {
      const clusterId = fetchBtn.dataset.clusterId;
      // Start timer on server (only creator can do this)
      await fetch(`/teamPage/${clusterId}/startTimer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      // After starting, load the shared remaining time and start clock
      await syncTimerFromServer();
    } catch (error) {
      console.error('Error starting timer via server:', error);
    }
  });
}


/**
 * Reset button - optional: if you want to truly reset the cluster timer,
 * this should call a dedicated server endpoint that clears/resets
 * timerStartAt and timerDurationSec, then re-sync.
 *
 * For now, this only clears the UI and reloads.
 */
const resetBtn = document.querySelector('#resetChallenge');
if (resetBtn) {
  resetBtn.addEventListener('click', async () => {
    console.log('Resetting cluster timer');

    const clusterId = resetBtn.dataset.clusterId;

    try {
      // Ask server to clear the shared timer
      const res = await fetch(`/teamPage/${clusterId}/resetTimer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        console.error('Failed to reset timer');
        return;
      }

      // Stop the countdown UI
      if (countdown && countdown.running) {
        countdown.stop();
      }
      initClock();
      countdown.setTime(0);

      // Optionally update buttons: show Start again, hide Leave/Delete
      updateButtonVisibility({ running: false, hasRun: false });

    } catch (err) {
      console.error('Error resetting timer:', err);
    }
  });
}

/**
 * On initial load, sync from server so every user sees the same remaining time.
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    syncTimerFromServer();
  });
} else {
  syncTimerFromServer();
}
