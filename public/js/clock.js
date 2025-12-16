/* 
This is the functionality for the clock
@author Justin Jimenez
How it works:
It sets up the first countdown as 48 hours.
The additional 0.16 is so that the user can see it is 2 days, otherwise it starts from 1 day, 23:59 hours.
On the second go around it will calculate time elapsed from time.now to when challengeCaller set the challenge till.

Next Steps:
Setting up a day to save this in localStorage so it doesn't go away as you navigate the app.

*/
/**
 * sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjoz
 * LCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiPGFub255bW91cz4iXSwibmF
 * tZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLFNBQUEsRUFBQSxjQUFBLEVBQUE7O0VBQU
 * EsU0FBQSxHQUFZLGNBQUEsR0FBaUIsUUFBQSxDQUFBLENBQUE7SUFDekIsU0FBQSxHQUFZLElBQUksU0FBSixDQUFj
 * LENBQUEsQ0FBRSxZQUFGLENBQWQsRUFDWjtNQUFBLFNBQUEsRUFBVyxXQUFYO01BQ0EsUUFBQSxFQUFVLElBRFY7TUFFQSxTQUF
 * BLEVBQVcsS0FGWDtNQUdBLFNBQUEsRUFBVyxJQUhYO01BSUEsV0FBQSxFQUFhLElBSmI7TUFLQSxTQUFBLEVBQ0U7UUFBQSxLQUFBLEVBQU
 * 8sUUFBQSxDQUFBLENBQUE7aUJBQ0wsT0FBTyxDQUFDLEdBQVIsQ0FBWSx3QkFBWjtRQURLLENBQVA7UUFFQSxJQUFBLEVBQU0sUUFBQSxDQUFBLENBQUE
 * 7aUJBQ0osT0FBTyxDQUFDLEdBQVIsQ0FBWSx3QkFBWjtRQURJLENBRk47UUFJQSxRQUFBLEVBQVUsUUFBQSxDQUFBLENBQUE7QUFDaEIsY0FBQTtVQUFRLElBQUEsR0FB
 * TyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQWIsQ0FBQSxDQUFzQixDQUFDO1VBQzlCLElBQUcsSUFBSDttQkFDRSxPQUFPLENBQUMsR0FBUixDQUFZLGdCQUFaLEVBQThCLElBQTlCLEVBR
 * Y7O1FBRlE7TUFKVjtJQU5GLENBRFk7QUFnQlosV0FBTztFQWpCa0I7O0VBb0I3QixhQUFBLEdBQWdCLFFBQUEsQ0FBQyxPQUFELEVBQVUsS0FBVixDQUFBO0FBRWhCLFFBQUEsT0FBQSxFQUFBLEdBQU
 * EsRUFBQSxTQUFBLEVBQUEsR0FBQSxFQUFBO0lBQUksSUFBRyxTQUFTLENBQUMsT0FBYjtBQUNFLGFBREY7O0lBR0EsT0FBQSxHQUFVLE9BQUEsR0FBVTtJQUVwQixHQUFBLEdBQU0sSUFBSSxJQUFKLENBQUE7SUFDT
 * ixLQUFBLEdBQVEsSUFBSSxJQUFKLENBQVMsS0FBVDtJQUNSLEdBQUEsR0FBTSxLQUFLLENBQUMsT0FBTixDQUFBLENBQUEsR0FBa0IsT0FBQSxHQUFVO0lBRWxDLFNBQUEsR0FBWSxJQUFJLENBQUMsS0FBTCxDQUFXLENBQUMsR0
 * FBQSxHQUFNLEdBQUcsQ0FBQyxPQUFKLENBQUEsQ0FBUCxDQUFBLEdBQXdCLElBQW5DO0lBRVosT0FBQSxHQUFVO0lBQ1YsSUFBRyxTQUFBLEdBQVksQ0FBZjtNQUNFLFNBQUEsSUFBYSxDQUFDO01BQ2QsT0FBQSxHQUFVLEtBRlo7O0lBSUEsU0FBUy
 * xDQUFDLE9BQVYsQ0FBa0IsU0FBbEI7V0FDQSxTQUFTLENBQUMsS0FBVixDQUFBO0VBbkJZOztFQXFCaEIsY0FBQSxDQUFBOztFQUNBLGFBQUEsQ0FBYyxJQUFkLEVBQW9CLElBQUksSUFBSixDQUFBLENBQXBCO0FBMUNBIiwic291cmNlc0NvbnRlbnQiOlsiY291bnRkb3duID
 * 0gaW5pdF9jb3VudGRvd24gPSAoKSAtPlxuICAgIGNvdW50ZG93biA9IG5ldyBGbGlwQ2xvY2sgJCgnLmNvdW50ZG93bicpLFxuICAgIGNsb2NrRmFjZTogJ2NvdW50ZG93bicsXG4gICAgbGFuZ3VhZ2U6ICdlbicsXG4gICAgYXV0b1N0YXJ0OiBmYWxzZSxcbiAgICBjb3VudGRvd246IHRydWUsXG4g
 * ICAgc2hvd1NlY29uZHM6IHRydWVcbiAgICBjYWxsYmFja3M6XG4gICAgICBzdGFydDogKCkgLT5cbiAgICAgICAgY29uc29sZS5sb2cgJ1RoZSBjbG9jayBoYXMgc3RhcnRlZCEnXG4gICAgICBzdG9wOiAoKSAtPlxuICAgICAgICBjb25zb2xlLmxvZyAnVGhlIGNsb2NrIGhhcyBzdG9wcGVkISdcbiAgICAgIGludGVyd
 * mFsOiAoKSAtPlxuICAgICAgICB0aW1lID0gdGhpcy5mYWN0b3J5LmdldFRpbWUoKS50aW1lXG4gICAgICAgIGlmIHRpbWUgXG4gICAgICAgICAgY29uc29sZS5sb2cgJ0Nsb2NrIGludGVydmFsJywgdGltZVxuXG4gICAgcmV0dXJuIGNvdW50ZG93blxuICBcblxuc2V0X2NvdW50ZG93biA9IChtaW51dGVzLCBzdGFydCkgLT5cblxuICAgIGlmIGNvd
 * W50ZG93bi5ydW5uaW5nXG4gICAgICByZXR1cm5cblxuICAgIHNlY29uZHMgPSBtaW51dGVzICogNjBcblxuICAgIG5vdyA9IG5ldyBEYXRlXG4gICAgc3RhcnQgPSBuZXcgRGF0ZSBzdGFydFxuICAgIGVuZCA9IHN0YXJ0LmdldFRpbWUoKSArIHNlY29uZHMgKiAxMDAwXG5cbiAgICBsZWZ0X3NlY3MgPSBNYXRoLnJvdW5kIChlbmQgLSBub3cuZ2V0VGltZSgpKSAvIDEwMDBcb
 * lxuICAgIGVsYXBzZWQgPSBmYWxzZVxuICAgIGlmIGxlZnRfc2VjcyA8IDBcbiAgICAgIGxlZnRfc2VjcyAqPSAtMVxuICAgICAgZWxhcHNlZCA9IHRydWVcblxuICAgIGNvdW50ZG93bi5zZXRUaW1lKGxlZnRfc2VjcylcbiAgICBjb3VudGRvd24uc3RhcnQoKVxuICAgIFxuaW5pdF9jb3VudGRvd24oKVxuc2V0X2NvdW50ZG93bigyODgwLCBuZXcgRGF0ZSgpKVxuIl19
 */
  //# sourceURL=coffeescript

import * as THREE from 'https://unpkg.com/three@0.159.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.159.0/examples/jsm/controls/OrbitControls.js';

let countdown = null;
let deleteCluster = document.getElementById('endGameBtn');
if (deleteCluster) {
  deleteCluster.style.display = 'none';
}

// Track whether the Three.js confetti has been started to avoid re-init
let _threeConfettiStarted = false;

// Load and fire a lightweight confetti effect (canvas-confetti)
// Three.js confetti will be used (fancier). Canvas-confetti loader removed.

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
          // Notify listeners and launch Three.js confetti, then clear state
          try { document.dispatchEvent(new Event('countdownFinished')); } catch (e) { /* ignore */ }
          try {
            console.log('Calling launchThreeConfetti from interval');
            if (typeof launchThreeConfetti === 'function') launchThreeConfetti();
          } catch (e) { console.warn('Three confetti error', e); }
          clearClockState();
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

// Celebration popup: show usernames who completed (progress >= 100)
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

      // Build popup content
      const overlay = document.createElement('div');
      overlay.className = 'celebration-overlay';
      overlay.style.position = 'fixed';
      overlay.style.inset = '0';
      overlay.style.display = 'flex';
      overlay.style.alignItems = 'center';
      overlay.style.justifyContent = 'center';
      overlay.style.background = 'rgba(0,0,0,0.45)';
      overlay.style.zIndex = '1000000';

      const box = document.createElement('div');
      box.style.background = '#fff';
      box.style.borderRadius = '12px';
      box.style.padding = '24px';
      box.style.maxWidth = '520px';
      box.style.width = '90%';
      box.style.textAlign = 'center';
      box.style.boxShadow = '0 10px 30px rgba(0,0,0,0.25)';

      const title = document.createElement('h2');
      title.innerText = winners.length ? 'Congratulations!' : 'Celebration';
      title.style.margin = '0 0 12px 0';
      box.appendChild(title);

      const msg = document.createElement('p');
      msg.style.margin = '0 0 16px 0';
      if (winners.length) {
        msg.innerText = `Nice work to the following teammate${winners.length>1? 's':''}:`;
        box.appendChild(msg);

        const list = document.createElement('ul');
        list.style.listStyle = 'none';
        list.style.padding = '0';
        list.style.margin = '0 0 16px 0';
        winners.forEach(n => {
          const li = document.createElement('li');
          li.innerText = n;
          li.style.fontWeight = '600';
          li.style.margin = '6px 0';
          list.appendChild(li);
        });
        box.appendChild(list);
      } else {
        msg.innerText = 'No teammates reached 100% — well played everyone!';
        box.appendChild(msg);
      }

      const close = document.createElement('button');
      close.innerText = 'Close';
      close.style.padding = '8px 14px';
      close.style.border = 'none';
      close.style.borderRadius = '6px';
      close.style.background = '#29BCBA';
      close.style.color = '#fff';
      close.style.cursor = 'pointer';
      close.addEventListener('click', () => {
        document.body.removeChild(overlay);
      });
      box.appendChild(close);

      overlay.appendChild(box);
      document.body.appendChild(overlay);

      // Auto dismiss after 10s
      setTimeout(() => {
        if (document.body.contains(overlay)) document.body.removeChild(overlay);
      }, 10000);
    } catch (e) {
      console.warn('showCelebrationPopup error', e);
    }
  }

  // Listen to countdownFinished to show popup as well
  document.addEventListener('countdownFinished', function () {
    showCelebrationPopup();
  });


function restoreCountdown() {
  const isActive = localStorage.getItem('countdownActive');
  const startTime = localStorage.getItem('countdownStartTime');
  const duration = localStorage.getItem('countdownDuration');
  
  if (!isActive || !startTime || !duration) {
    console.log('No active countdown to restore');
    return false;
  }
  
  const elapsed = Math.floor((Date.now() - parseInt(startTime)) / 1000);
  const remaining = parseInt(duration) - elapsed;
  
  if (remaining > 0) {
    console.log('Restoring countdown:', remaining, 'seconds remaining');
    
    // Show clock UI
    const wholeClock = document.getElementById('wholeClock');
    const challengeCall = document.getElementById('challengeCall');
    const joinChallenge = document.getElementById('joinChallenge');
    
    if (wholeClock) wholeClock.style.display = 'unset';
    if (challengeCall) challengeCall.disabled = true;
    if (joinChallenge) joinChallenge.style.display = 'unset';
    
    // Start countdown with remaining time
    setCountdownSeconds(remaining);
    return true;
  } else {
    // Timer already finished
    console.log('Countdown already completed');
    clearClockState();
    
    // Show clock at 0
    const wholeClock = document.getElementById('wholeClock');
    if (wholeClock) wholeClock.style.display = 'unset';
    
    initClock();
    countdown.setTime(0);
    try { document.dispatchEvent(new Event('countdownFinished')); } catch (e) { /* ignore */ }
    try {
      console.log('Calling launchThreeConfetti from restoreCountdown');
      if (typeof launchThreeConfetti === 'function') launchThreeConfetti();
    } catch (e) { console.warn('Three confetti error', e); }
    return false;
  }
}

// Try to restore countdown immediately when script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    restoreCountdown();
    updateButtonVisibility();
  });
} else {
  // DOM already loaded
  restoreCountdown();
  updateButtonVisibility();
}

function updateButtonVisibility() {
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
  resetBtn.addEventListener('click', function () {
    console.log('Resetting countdown');
    
    // Stop the countdown if running
    if (countdown && countdown.running) {
      countdown.stop();
    }
    
    // Clear all saved state
    clearClockState();
    
    // Fire countdown finished event and show confetti, then reload
    try { document.dispatchEvent(new Event('countdownFinished')); } catch (e) { /* ignore */ }
    try { if (typeof launchThreeConfetti === 'function') launchThreeConfetti(); } catch (e) { console.warn('Three confetti error', e); }

    // Reload page to reset everything
    location.reload();
  });
}

// Reset Clock button - set clock to 0 and show confetti (no reload)
const resetClockBtn = document.querySelector('#resetClock');
if (resetClockBtn) {
  resetClockBtn.addEventListener('click', function () {
    console.log('Reset Clock clicked — setting clock to 0');
    initClock();
    if (countdown) {
      try {
        countdown.setTime(0);
        countdown.stop();
      } catch (e) { console.warn('Error setting clock to 0', e); }
    }
    // Clear saved state so UI reflects finished state
    clearClockState();
    try { document.dispatchEvent(new Event('countdownFinished')); } catch (e) { /* ignore */ }
    try { if (typeof launchThreeConfetti === 'function') launchThreeConfetti(); } catch (e) { console.warn('Three confetti error', e); }
  });
}

// Three.js confetti (fancier) - adapted from CodePen
function launchThreeConfetti() {
  if (_threeConfettiStarted) return;
  _threeConfettiStarted = true;

  const worldRadius = 5;
  const confettiSize = 0.07;
  // Reduced from 3000 to improve chance of rendering and performance during tests
  const confettiNum = 400;
  const rotateRange_x = Math.PI / 30;
  const rotateRange_y = Math.PI / 50;
  const speed_y = 0.01;
  const speed_x = 0.003;
  const speed_z = 0.005;

  let camera, scene, renderer, controls;
  let confettiMesh;
  const dummy = new THREE.Object3D();
  const matrix = new THREE.Matrix4();
  const color = new THREE.Color();

  console.log('launchThreeConfetti() starting');
  init();

  function init() {
    camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, worldRadius * 3);
    camera.position.z = worldRadius * Math.sqrt(2);

    scene = new THREE.Scene();

    function getRandomColor() {
      const saturation = 100;
      const lightness = 50;
      const colors = [
        `hsl(0, ${saturation}%, ${lightness}%)`,
        `hsl(30, ${saturation}%, ${lightness}%)`,
        `hsl(60, ${saturation}%, ${lightness}%)`,
        `hsl(90, ${saturation}%, ${lightness}%)`,
        `hsl(120, ${saturation}%, ${lightness}%)`,
        `hsl(150, ${saturation}%, ${lightness}%)`,
        `hsl(180, ${saturation}%, ${lightness}%)`,
        `hsl(210, ${saturation}%, ${lightness}%)`,
        `hsl(240, ${saturation}%, ${lightness}%)`,
        `hsl(270, ${saturation}%, ${lightness}%)`,
        `hsl(300, ${saturation}%, ${lightness}%)`,
        `hsl(330, ${saturation}%, ${lightness}%)`
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }

    const confettiGeometry = new THREE.PlaneGeometry(confettiSize / 2, confettiSize);
    const confettiMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    confettiMesh = new THREE.InstancedMesh(confettiGeometry, confettiMaterial, confettiNum);

    for (let i = 0; i < confettiNum; i++) {
      matrix.makeRotationFromEuler(new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI));
      matrix.setPosition(
        THREE.MathUtils.randFloat(-worldRadius, worldRadius),
        THREE.MathUtils.randFloat(-worldRadius, worldRadius),
        THREE.MathUtils.randFloat(-worldRadius, worldRadius)
      );
      confettiMesh.setMatrixAt(i, matrix);
      confettiMesh.setColorAt(i, color.set(getRandomColor()));
    }
    scene.add(confettiMesh);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = false;
    document.body.appendChild(renderer.domElement);
    // Ensure the canvas is visible above other content and doesn't block UI
    try {
      renderer.domElement.style.position = 'fixed';
      renderer.domElement.style.top = '0';
      renderer.domElement.style.left = '0';
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.style.zIndex = '999999';
      renderer.domElement.style.pointerEvents = 'none';
      console.log('Three renderer appended to DOM', renderer.domElement);
    } catch (e) {
      console.warn('Could not style renderer DOM element', e);
    }

    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.y = 0.5;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2;
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 1;
    controls.maxDistance = worldRadius * Math.sqrt(2);
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI / 2;
    controls.update();

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

    if (confettiMesh) {
      for (let i = 0; i < confettiNum; i++) {
        confettiMesh.getMatrixAt(i, matrix);
        matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
        dummy.position.y -= speed_y * ((i % 4) + 1);

        if (dummy.position.y < -worldRadius) {
          dummy.position.y = worldRadius;
          dummy.position.x = THREE.MathUtils.randFloat(-worldRadius, worldRadius);
          dummy.position.z = THREE.MathUtils.randFloat(-worldRadius, worldRadius);
        } else {
          if (i % 4 == 1) {
            dummy.position.x += speed_x;
            dummy.position.z += speed_z;
          } else if (i % 4 == 2) {
            dummy.position.x += speed_x;
            dummy.position.z -= speed_z;
          } else if (i % 4 == 3) {
            dummy.position.x -= speed_x;
            dummy.position.z += speed_z;
          } else {
            dummy.position.x -= speed_x;
            dummy.position.z -= speed_z;
          }
        }

        dummy.rotation.x += THREE.MathUtils.randFloat(0, rotateRange_x);
        dummy.rotation.z += THREE.MathUtils.randFloat(0, rotateRange_y);

        dummy.updateMatrix();
        confettiMesh.setMatrixAt(i, dummy.matrix);
      }
      confettiMesh.instanceMatrix.needsUpdate = true;
    }
    renderer.render(scene, camera);
  }
}