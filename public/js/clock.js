/*
  Shared cluster countdown logic

  - The countdown is owned by the server (Cluster.timerStartAt + Cluster.timerDurationSec).
  - This script only:
      * Renders the remaining time using FlipClock.
      * Fetches /api/team-data to get the shared remaining duration.
      * Adjusts UI (buttons, labels) based on whether the timer is running or finished.
  - No timing data is stored in localStorage anymore; the server is the single source of truth.
*/

import * as THREE from 'https://unpkg.com/three@0.159.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.159.0/examples/jsm/controls/OrbitControls.js';

let countdown = null;
const deleteCluster = document.getElementById('endGameBtn');
if (deleteCluster) {
  deleteCluster.style.display = 'none';
}

// Expose test helpers on window for quick manual testing from the console
// (Removed test helpers for confetti/popup)

// Prevent multiple confetti in same session
let _threeConfettiStarted = false;
// Track whether countdown has actually finished (only then allow celebration)
let _countdownHasFinished = false;

// Temporary dev helper: force the countdown-finished flow from the console.
// Call `window.__forceCountdownFinish()` after reloading the page to run the same logic
// that runs when a real countdown finishes. Remove this helper when finished testing.
if (typeof window !== 'undefined') {
  window.__forceCountdownFinish = function () {
    try {
      // Ensure the FlipClock UI shows 0
      initClock();
      if (countdown) {
        try { countdown.setTime(0); countdown.stop(); } catch (e) { /* ignore */ }
      }
      handleCountdownFinished();
    } catch (e) {
      console.warn('forceCountdownFinish failed', e);
    }
  };
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
    showSeconds: true,
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

  // starting a new countdown -> clear finished flag
  _countdownHasFinished = false;
  countdown.setTime(Math.max(0, Math.floor(totalSeconds)));
  countdown.start();
}

/**
 * When the countdown reaches zero (or server says it's done),
 * update UI elements accordingly.
 */
async function handleCountdownFinished({ suppressCelebration = false } = {}) {
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
  // mark finished so confetti/popup only run when appropriate
  _countdownHasFinished = true;

  // Trigger celebration UI and confetti from one central place unless suppressed
  try {
    if (!_countdownHasFinished) {
      console.log('handleCountdownFinished: finished flag not set, nothing to do');
      return;
    }
    if (!suppressCelebration) {
      if (typeof launchThreeConfetti === 'function') launchThreeConfetti();
      showCelebrationPopup();
    } else {
      console.log('handleCountdownFinished: celebration suppressed (UI-only)');
    }
  } catch (e) {
    console.warn('handleCountdownFinished celebration error', e);
  }

  const userId = document.querySelector(".userId").dataset.value
  console.log(userId)

  const url = `/goal/test/${userId}`
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result, 'BLAH');
  } catch (error) {
    console.error(error.message);
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

// Three.js confetti (adapted, simplified)
function launchThreeConfetti() {
  if (_threeConfettiStarted) return;
  _threeConfettiStarted = true;

  const worldRadius = 5;
  const confettiSize = 0.08;
  const confettiNum = 400;

  let camera, scene, renderer, controls;
  let confettiMesh;
  const dummy = new THREE.Object3D();
  const matrix = new THREE.Matrix4();
  const color = new THREE.Color();

  console.log('launchThreeConfetti() starting');
  init();

  function init() {
    camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, worldRadius * 10);
    camera.position.z = worldRadius * 3;

    scene = new THREE.Scene();

    
    const confettiGeometry = new THREE.PlaneGeometry(confettiSize / 2, confettiSize);
    const confettiMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    confettiMesh = new THREE.InstancedMesh(confettiGeometry, confettiMaterial, confettiNum);

    function getRandomColor() {
      const hue = Math.floor(Math.random() * 360);
      return `hsl(${hue}, 80%, 50%)`;
    }

    for (let i = 0; i < confettiNum; i++) {
      matrix.makeRotationFromEuler(new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI));
      matrix.setPosition(
        THREE.MathUtils.randFloatSpread(worldRadius * 2),
        THREE.MathUtils.randFloatSpread(worldRadius * 2),
        THREE.MathUtils.randFloatSpread(worldRadius * 2)
      );
      confettiMesh.setMatrixAt(i, matrix);
      confettiMesh.setColorAt(i, color.set(getRandomColor()));
    }
    scene.add(confettiMesh);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.zIndex = '999999';
    renderer.domElement.style.pointerEvents = 'none';
    document.body.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;

    animate();
    window.addEventListener('resize', onWindowResize);
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function animate() {
    requestAnimationFrame(animate);
    controls.update();

    // simple fall simulation
    if (confettiMesh) {
      for (let i = 0; i < confettiNum; i++) {
        confettiMesh.getMatrixAt(i, matrix);
        matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
        dummy.position.y -= 0.02 * ((i % 4) + 1);
        if (dummy.position.y < -worldRadius) dummy.position.y = worldRadius;
        dummy.rotation.x += 0.01;
        dummy.updateMatrix();
        confettiMesh.setMatrixAt(i, dummy.matrix);
      }
      confettiMesh.instanceMatrix.needsUpdate = true;
    }
    renderer.render(scene, camera);
  }
}

// Celebration popup: list usernames who reached 100%
function showCelebrationPopup() {
  try {
    const userCards = Array.from(document.querySelectorAll('.user-card'));
    const winners = [];
    userCards.forEach(card => {
      const nameEl = card.querySelector('h5');
      const progressBar = card.querySelector('.progress-bar');
      const name = nameEl ? nameEl.innerText.trim() : null;
      const progress = progressBar ? Number(progressBar.getAttribute('aria-valuenow') || 0) : 0;
      if (name && progress >= 100) winners.push(name);
    });

    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.background = 'rgba(0,0,0,0.45)';
    overlay.style.zIndex = '1000001';

    const box = document.createElement('div');
    box.style.background = '#fff';
    box.style.borderRadius = '12px';
    box.style.padding = '20px';
    box.style.maxWidth = '480px';
    box.style.textAlign = 'center';

    const title = document.createElement('h2');
    title.innerText = winners.length ? 'Congratulations!' : 'Womp';
    box.appendChild(title);

    const msg = document.createElement('p');
    if (winners.length) msg.innerText = 'These teammates crushed their goals:';
    else msg.innerText = 'No one reached their goal — let\'s throw a pity party!';
    box.appendChild(msg);

    if (winners.length) {
      const list = document.createElement('ul');
      list.style.listStyle = 'none';
      list.style.padding = '0';
      winners.forEach(n => {
        const li = document.createElement('li');
        li.innerText = n;
        li.style.fontWeight = '600';
        li.style.margin = '6px 0';
        list.appendChild(li);
      });
      box.appendChild(list);
    }

    const close = document.createElement('button');
    close.innerText = 'Close';
    close.style.marginTop = '12px';
    close.addEventListener('click', () => overlay.remove());
    box.appendChild(close);

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    // auto remove after 10s
    setTimeout(() => { if (document.body.contains(overlay)) overlay.remove(); }, 10000);
  } catch (e) {
    console.warn('showCelebrationPopup error', e);
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
      console.log(clusterId)
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

// Test Finish button - sets the clock to 0 and triggers the finished flow (confetti + popup)
// (Removed Test Finish handler for confetti testing)


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

// Developer helper: if the user has set the following localStorage keys as a quick test,
// (Removed localStorage dev simulation helper)
