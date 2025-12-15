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
let switchTimer = false;

function initClock() {
  if (countdown) return; // already initialized

  countdown = new FlipClock($('.countdown'), {
    clockFace: 'DailyCounter',
    language: 'en',
    autoStart: false,
    countdown: true,
    callbacks: {
      start() { console.log('The clock has started!'); },
      stop() { 
        console.log('The clock has stopped!');
        // MINIMAL CHANGE: Auto-start next phase when countdown reaches 0
        handleCountdownComplete();
      },
      interval() {
        const time = this.factory.getTime().time;
        if (time <= 0) {
          handleCountdownComplete();
        }
      }
    }
  });
}

// NEW FUNCTION: Handle automatic transition
function handleCountdownComplete() {
  const initialComplete = $.cookie('initialCountdownComplete');
  
  if (!initialComplete) {
    // First countdown done - mark it and start target date countdown
    console.log('Initial countdown complete, starting target date countdown');
    $.cookie('initialCountdownComplete', 'true', { expires: 365 });
    switchTimer = true;
    
    // Start the real countdown to target date
    const targetDateStr = $.cookie('userTargetDate');
    if (targetDateStr) {
      const targetDate = new Date(parseInt(targetDateStr));
      const diffSeconds = Math.floor((targetDate - Date.now()) / 1000);
      if (diffSeconds > 0) {
        setCountdownSeconds(diffSeconds);
      }
    }
  } else {
    console.log('Challenge complete!');
  }
}

function setCountdownSeconds(totalSeconds) {
  initClock();
  countdown.setTime(Math.max(0, Math.floor(totalSeconds)));
  countdown.start();
}

function clockStart(hours, minutes, seconds) {
  const totalSeconds = (Number(hours) * 3600) + (Number(minutes) * 60) + Number(seconds);
  setCountdownSeconds(totalSeconds);
}

// Fetch button
const fetchBtn = document.querySelector('#fetchButton');
fetchBtn.addEventListener('click', async () => {
  try {
    const res = await fetch('/api/data');
    const data = await res.json();
    console.log('Data fetched from server:', data);
    clockStart(data.duration.hours, data.duration.minutes, data.duration.seconds);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

// Form submission
$('form').on('submit', function (e) {
  e.preventDefault();

  document.getElementById('wholeClock').style.display = 'unset';
  document.getElementById('challengeCall').disabled = true;
  document.getElementById('joinChallenge').style.display = 'unset';

  // const userDateInput = $('#date-input').val();
  // const userTimeInput = $('#time-input').val() || "10:00";

  // if (!userDateInput) return console.warn("No date selected");

  // const targetDate = new Date(`${userDateInput}T${userTimeInput}`);
  // if (isNaN(targetDate.getTime())) return console.error("Invalid target date");

  // $.cookie('userTargetDate', targetDate.getTime().toString(), { expires: 365 });

  const initialComplete = $.cookie('initialCountdownComplete');

  if (!initialComplete) {
    console.log("Starting initial 48-hour countdown");
    setCountdownSeconds(48 * 60 * 60); // Change back to: 48 * 60 * 60
  } else {
    const diffSeconds = Math.floor((targetDate - new Date()) / 1000);
    if (diffSeconds > 0) {
      console.log("Starting target date countdown");
      setCountdownSeconds(diffSeconds);
    } else {
      console.warn("Target date already passed");
      initClock();
      countdown.setTime(0);
    }
  }
});

// Reset button
$('#resetChallenge').on('click', function () {
  $.removeCookie('clockTime');
  $.removeCookie('clockLastUpdate');
  $.removeCookie('userTargetDate');
  $.removeCookie('initialCountdownComplete');
  location.reload();
});