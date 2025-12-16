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

let countdown = null;
let deleteCluster = document.getElementById('endGameBtn')
deleteCluster.style.display = 'none'

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
          clearClockState();
          this.stop();
        }
      }
    }
  });
}

function setCountdownSeconds(totalSeconds) {
  initClock();
  if (!countdown) return;
  
  countdown.setTime(Math.max(0, Math.floor(totalSeconds)));
  countdown.start();
}

function clockStart(hours, minutes, seconds) {
  const totalSeconds = (Number(hours) * 3600) + (Number(minutes) * 60) + Number(seconds);
  setCountdownSeconds(totalSeconds);
  
  // Save the start time and total duration
  localStorage.setItem('countdownStartTime', Date.now().toString());
  localStorage.setItem('countdownDuration', totalSeconds.toString());
  localStorage.setItem('countdownActive', 'true');
}

function clearClockState() {
  localStorage.removeItem('countdownStartTime');
  localStorage.removeItem('countdownDuration');
  localStorage.removeItem('countdownActive');
  
  // Show leave button, hide start button
  const fetchBtn = document.getElementById('fetchButton');
  const teamProgressTitle = document.getElementById('teamProgressTitle');

  if (fetchBtn) fetchBtn.style.display = 'none';
  if (deleteCluster) {
   setTimeout(() => {
     deleteCluster.style.display = 'block';
   }, 1000); // slight delay to ensure countdown UI updates first
  }
  if (teamProgressTitle) {  
    teamProgressTitle.innerText = "Cluster Completed!";
  }
}

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
  const isActive = localStorage.getItem('countdownActive');
  
  if (isActive === 'true') {
    // Timer is running - hide both buttons
    if (fetchBtn) fetchBtn.style.display = 'none';
    if (leaveBtn) leaveBtn.style.display = 'none';
  } else {
    // Timer not active - check if it ever ran
    const hasRun = localStorage.getItem('countdownStartTime');
    if (hasRun) {
      // Timer finished - show leave button only
      if (fetchBtn) fetchBtn.style.display = 'none';
      if (leaveBtn) leaveBtn.style.display = 'block';
    } else {
      // Never started - show start button only
      if (fetchBtn) fetchBtn.style.display = 'block';
      if (leaveBtn) leaveBtn.style.display = 'none';
    }
  }
}

// Fetch button - starts the timer
const fetchBtn = document.querySelector('#fetchButton');
if (fetchBtn) {
  fetchBtn.addEventListener('click', async () => {
    // Prevent starting if already active
    if (localStorage.getItem('countdownActive') === 'true') {
      console.log('Countdown already running');
      return;
    }
    
    try {
      const res = await fetch('/api/data');
      const data = await res.json();

      console.log('Data fetched from server:', data);

      // Hide the fetch button
      fetchBtn.style.display = 'none';

      // Show clock UI
      const wholeClock = document.getElementById('wholeClock');
      const challengeCall = document.getElementById('challengeCall');
      const joinChallenge = document.getElementById('joinChallenge');
      
      if (wholeClock) wholeClock.style.display = 'unset';
      if (challengeCall) challengeCall.disabled = true;
      if (joinChallenge) joinChallenge.style.display = 'unset';

      // Start the countdown with fetched data
      clockStart(data.duration.hours, data.duration.minutes, data.duration.seconds);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  });
}

// Reset button - force resets timer
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
    
    // Reload page to reset everything
    location.reload();
  });
}