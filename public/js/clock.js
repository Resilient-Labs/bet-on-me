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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiPGFub255bW91cz4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLFNBQUEsRUFBQSxjQUFBLEVBQUE7O0VBQUEsU0FBQSxHQUFZLGNBQUEsR0FBaUIsUUFBQSxDQUFBLENBQUE7SUFDekIsU0FBQSxHQUFZLElBQUksU0FBSixDQUFjLENBQUEsQ0FBRSxZQUFGLENBQWQsRUFDWjtNQUFBLFNBQUEsRUFBVyxXQUFYO01BQ0EsUUFBQSxFQUFVLElBRFY7TUFFQSxTQUFBLEVBQVcsS0FGWDtNQUdBLFNBQUEsRUFBVyxJQUhYO01BSUEsV0FBQSxFQUFhLElBSmI7TUFLQSxTQUFBLEVBQ0U7UUFBQSxLQUFBLEVBQU8sUUFBQSxDQUFBLENBQUE7aUJBQ0wsT0FBTyxDQUFDLEdBQVIsQ0FBWSx3QkFBWjtRQURLLENBQVA7UUFFQSxJQUFBLEVBQU0sUUFBQSxDQUFBLENBQUE7aUJBQ0osT0FBTyxDQUFDLEdBQVIsQ0FBWSx3QkFBWjtRQURJLENBRk47UUFJQSxRQUFBLEVBQVUsUUFBQSxDQUFBLENBQUE7QUFDaEIsY0FBQTtVQUFRLElBQUEsR0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQWIsQ0FBQSxDQUFzQixDQUFDO1VBQzlCLElBQUcsSUFBSDttQkFDRSxPQUFPLENBQUMsR0FBUixDQUFZLGdCQUFaLEVBQThCLElBQTlCLEVBREY7O1FBRlE7TUFKVjtJQU5GLENBRFk7QUFnQlosV0FBTztFQWpCa0I7O0VBb0I3QixhQUFBLEdBQWdCLFFBQUEsQ0FBQyxPQUFELEVBQVUsS0FBVixDQUFBO0FBRWhCLFFBQUEsT0FBQSxFQUFBLEdBQUEsRUFBQSxTQUFBLEVBQUEsR0FBQSxFQUFBO0lBQUksSUFBRyxTQUFTLENBQUMsT0FBYjtBQUNFLGFBREY7O0lBR0EsT0FBQSxHQUFVLE9BQUEsR0FBVTtJQUVwQixHQUFBLEdBQU0sSUFBSSxJQUFKLENBQUE7SUFDTixLQUFBLEdBQVEsSUFBSSxJQUFKLENBQVMsS0FBVDtJQUNSLEdBQUEsR0FBTSxLQUFLLENBQUMsT0FBTixDQUFBLENBQUEsR0FBa0IsT0FBQSxHQUFVO0lBRWxDLFNBQUEsR0FBWSxJQUFJLENBQUMsS0FBTCxDQUFXLENBQUMsR0FBQSxHQUFNLEdBQUcsQ0FBQyxPQUFKLENBQUEsQ0FBUCxDQUFBLEdBQXdCLElBQW5DO0lBRVosT0FBQSxHQUFVO0lBQ1YsSUFBRyxTQUFBLEdBQVksQ0FBZjtNQUNFLFNBQUEsSUFBYSxDQUFDO01BQ2QsT0FBQSxHQUFVLEtBRlo7O0lBSUEsU0FBUyxDQUFDLE9BQVYsQ0FBa0IsU0FBbEI7V0FDQSxTQUFTLENBQUMsS0FBVixDQUFBO0VBbkJZOztFQXFCaEIsY0FBQSxDQUFBOztFQUNBLGFBQUEsQ0FBYyxJQUFkLEVBQW9CLElBQUksSUFBSixDQUFBLENBQXBCO0FBMUNBIiwic291cmNlc0NvbnRlbnQiOlsiY291bnRkb3duID0gaW5pdF9jb3VudGRvd24gPSAoKSAtPlxuICAgIGNvdW50ZG93biA9IG5ldyBGbGlwQ2xvY2sgJCgnLmNvdW50ZG93bicpLFxuICAgIGNsb2NrRmFjZTogJ2NvdW50ZG93bicsXG4gICAgbGFuZ3VhZ2U6ICdlbicsXG4gICAgYXV0b1N0YXJ0OiBmYWxzZSxcbiAgICBjb3VudGRvd246IHRydWUsXG4gICAgc2hvd1NlY29uZHM6IHRydWVcbiAgICBjYWxsYmFja3M6XG4gICAgICBzdGFydDogKCkgLT5cbiAgICAgICAgY29uc29sZS5sb2cgJ1RoZSBjbG9jayBoYXMgc3RhcnRlZCEnXG4gICAgICBzdG9wOiAoKSAtPlxuICAgICAgICBjb25zb2xlLmxvZyAnVGhlIGNsb2NrIGhhcyBzdG9wcGVkISdcbiAgICAgIGludGVydmFsOiAoKSAtPlxuICAgICAgICB0aW1lID0gdGhpcy5mYWN0b3J5LmdldFRpbWUoKS50aW1lXG4gICAgICAgIGlmIHRpbWUgXG4gICAgICAgICAgY29uc29sZS5sb2cgJ0Nsb2NrIGludGVydmFsJywgdGltZVxuXG4gICAgcmV0dXJuIGNvdW50ZG93blxuICBcblxuc2V0X2NvdW50ZG93biA9IChtaW51dGVzLCBzdGFydCkgLT5cblxuICAgIGlmIGNvdW50ZG93bi5ydW5uaW5nXG4gICAgICByZXR1cm5cblxuICAgIHNlY29uZHMgPSBtaW51dGVzICogNjBcblxuICAgIG5vdyA9IG5ldyBEYXRlXG4gICAgc3RhcnQgPSBuZXcgRGF0ZSBzdGFydFxuICAgIGVuZCA9IHN0YXJ0LmdldFRpbWUoKSArIHNlY29uZHMgKiAxMDAwXG5cbiAgICBsZWZ0X3NlY3MgPSBNYXRoLnJvdW5kIChlbmQgLSBub3cuZ2V0VGltZSgpKSAvIDEwMDBcblxuICAgIGVsYXBzZWQgPSBmYWxzZVxuICAgIGlmIGxlZnRfc2VjcyA8IDBcbiAgICAgIGxlZnRfc2VjcyAqPSAtMVxuICAgICAgZWxhcHNlZCA9IHRydWVcblxuICAgIGNvdW50ZG93bi5zZXRUaW1lKGxlZnRfc2VjcylcbiAgICBjb3VudGRvd24uc3RhcnQoKVxuICAgIFxuaW5pdF9jb3VudGRvd24oKVxuc2V0X2NvdW50ZG93bigyODgwLCBuZXcgRGF0ZSgpKVxuIl19
  //# sourceURL=coffeescript


  (function() {
    var countdown, init_countdown, set_countdown, saveClockState, loadClockState;
  
    countdown = init_countdown = function() {
      countdown = new FlipClock($('.countdown'), {
        clockFace: 'DailyCounter',
        language: 'en',
        autoStart: false,
        countdown: true,
        callbacks: {
          start: function() {
            console.log('The clock has started!');
          },
          stop: function() {
            console.log('The clock has stopped!');
            
            // Check if we need to switch to the final countdown
            var initialComplete = $.cookie('initialCountdownComplete');
            var userTargetDate = $.cookie('userTargetDate');
            
            if (!initialComplete && userTargetDate) {
              // Mark initial countdown as complete
              $.cookie('initialCountdownComplete', 'true', { expires: 365 });
              
              setTimeout(function() {
                var currentDate = new Date();
                var targetDate = new Date(parseInt(userTargetDate));
                var diff = (targetDate.getTime() - currentDate.getTime()) / 1000;
                
                if (diff > 0) {
                  set_countdown(diff / 60, new Date());
                  console.log('Switching to target date countdown');
                } else {
                  console.log('Target date has passed');
                  countdown.setTime(0);
                }
              }, 1000);
            }
          },
          interval: function() {
            var time = this.factory.getTime().time;
            
            // Save current state every interval
            saveClockState();
            
            if (time <= 0) {
              console.log('Countdown reached 0!');
            }
          }
        }
      });
      return countdown;
    };
  
    // Save the current clock state to cookies
    saveClockState = function() {
      if (countdown && countdown.running) {
        var currentTime = countdown.getTime().time;
        var now = new Date().getTime();
        
        $.cookie('clockTime', currentTime.toString(), { expires: 365 });
        $.cookie('clockLastUpdate', now.toString(), { expires: 365 });
      }
    };
  
    // Load and resume clock state from cookies
    loadClockState = function() {
      var savedTime = $.cookie('clockTime');
      var lastUpdate = $.cookie('clockLastUpdate');
      var userTargetDate = $.cookie('userTargetDate');
      var initialComplete = $.cookie('initialCountdownComplete');
      
      if (savedTime && lastUpdate) {
        var now = new Date().getTime();
        var elapsed = Math.floor((now - parseInt(lastUpdate)) / 1000);
        var remainingTime = parseInt(savedTime) - elapsed;
        
        if (remainingTime > 0) {
          console.log('Resuming clock with ' + remainingTime + ' seconds remaining');
          document.getElementById('wholeClock').style.display = 'unset';
          document.getElementById('challengeCall').disabled = true;
          document.getElementById('joinChallenge').style.display = 'unset';
          
          countdown.setTime(remainingTime);
          countdown.start();
          return true;
        } else if (initialComplete && userTargetDate) {
          // Initial countdown finished, check if we should show final countdown
          var currentDate = new Date();
          var targetDate = new Date(parseInt(userTargetDate));
          var diff = (targetDate.getTime() - currentDate.getTime()) / 1000;
          
          if (diff > 0) {
            console.log('Resuming final countdown');
            document.getElementById('wholeClock').style.display = 'unset';
            document.getElementById('challengeCall').disabled = true;
            document.getElementById('joinChallenge').style.display = 'unset';
            
            set_countdown(diff / 60, new Date());
            return true;
          }
        }
      }
      return false;
    };
  
    set_countdown = function(minutes, start) {
      var elapsed, end, left_secs, now, seconds;
      
      seconds = minutes * 60;
      now = new Date();
      start = new Date(start);
      end = start.getTime() + seconds * 1000;
      left_secs = Math.round((end - now.getTime()) / 1000);
      elapsed = false;
      
      if (left_secs < 0) {
        left_secs *= -1;
        elapsed = true;
      }
      
      countdown.setTime(left_secs);
      countdown.start();
      saveClockState();
    };
  
    // Initialize countdown
    init_countdown();
    
    // Try to load existing clock state on page load
    loadClockState();
  
    // Form submission handler
    $('form').on('submit', function(e) {
      e.preventDefault();
      
      document.getElementById('wholeClock').style.display = 'unset';
      document.getElementById('challengeCall').disabled = true;
      document.getElementById('joinChallenge').style.display = 'unset';
      
      // Get user input date and time
      var userDateInput = $('#date-input').val();
      var userTimeInput = $('#time-input').val() || "10:00";
      
      // Create target date (assuming EST/EDT timezone)
      var targetDateStr = userDateInput + " " + userTimeInput;
      var targetDate = new Date(targetDateStr);
      
      // Store the target date timestamp
      $.cookie('userTargetDate', targetDate.getTime().toString(), { expires: 365 });
      console.log("Target date set to: " + targetDate.toString());
      
      // Check if initial countdown has been completed
      var initialComplete = $.cookie('initialCountdownComplete');
      
      if (!initialComplete) {
        // Start initial 48-hour countdown (2880.016 minutes)
        set_countdown(2880.016, new Date());
        console.log("Starting initial countdown: 2880.016 minutes (48 hours)");
      } else {
        // Initial countdown already done, go straight to target date
        var currentDate = new Date();
        var diff = (targetDate.getTime() - currentDate.getTime()) / 1000;
        
        if (diff > 0) {
          set_countdown(diff / 60, new Date());
          console.log("Starting target date countdown");
        } else {
          console.log("Target date has already passed!");
          countdown.setTime(0);
        }
      }
    });
  
    // Optional: Clear all cookies button (for testing)
    $('#resetChallenge').on('click', function() {
      $.removeCookie('clockTime');
      $.removeCookie('clockLastUpdate');
      $.removeCookie('userTargetDate');
      $.removeCookie('initialCountdownComplete');
      location.reload();
    });
  
  }).call(this);



  // (function() {
  //   var countdown, init_countdown, set_countdown, userTargetDate, initialCountdownComplete;
  
  //   initialCountdownComplete = false;
  
  //   countdown = init_countdown = function() {
  //     countdown = new FlipClock($('.countdown'), {
  //       clockFace: 'DailyCounter',
  //       language: 'en',
  //       autoStart: false,
  //       countdown: true,
  //       callbacks: {
  //         start: function() {
  //           return console.log('The clock has started!');

  //         },
  //         stop: function() {
  //           console.log('The clock has stopped!');
            
  //           // Mark initial countdown as complete
  //           initialCountdownComplete = true;
            
  //           // Reset with countdown to user's target date when it reaches 0
  //           if (!$.cookie('userTargetDate')) {
  //             setTimeout(function() {
  //               let currentDate = new Date();
  //               let diff = userTargetDate / 1000 - currentDate.getTime() / 1000; 
  //               // Might have to store line above in cookies //

                
  //               if (diff > 0) {
  //                 set_countdown(diff / 60, new Date());
  //                 console.log('Resetting to target date countdown');
  //               } else {
  //                 console.log('Target date has passed, cannot restart');
  //               }
  //             }, 1000);
  //           }
  //         },
  //         interval: function() {
  //           var time;
  //           time = this.factory.getTime().time;
  //           if (time <= 0) {
  //             console.log('Countdown reached 0!');
  //           }
  //         }
  //       }
  //     });
  //     return countdown;
  //   };
  
  //   set_countdown = function(minutes, start) {
  //     var elapsed, end, left_secs, now, seconds;
      
  //     seconds = minutes * 60;
  //     now = new Date();
  //     start = new Date(start);
  //     end = start.getTime() + seconds * 1000;
  //     left_secs = Math.round((end - now.getTime()) / 1000);
  //     elapsed = false;
      
  //     if (left_secs < 0) {
  //       left_secs *= -1;
  //       elapsed = true;
  //     }
      
  //     countdown.setTime(left_secs);
  //     countdown.start();
  //   };
  
  //   init_countdown();
  
  //   $('form').on('submit', function(e) {
  //     document.getElementById('wholeClock').style.display = 'unset'
  //     document.getElementById('challengeCall').disabled = true
  //     document.getElementById('joinChallenge').style.display = 'unset'
  //     e.preventDefault();
      
  //     // Get user input date and time
  //     let userDateInput = $('#date-input').val(); // Format: "2026-01-01"
  //     let userTimeInput = $('#time-input').val() || "10:00"; // Format: "10:00"
      
  //     // Set timezone
  //     moment.tz.add('America/New_York|EST EDT|50 40|0101|1Lz50 1zb0 Op0');
      
  //     // Store the user's target date for later reset
  //     userTargetDate = $.cookie(moment.tz(userDateInput + " " + userTimeInput, "America/New_York"));
      
  //     console.log("Target date set to: " + userTargetDate.format());
      
  //     // Always start with 2880.016 minutes on first run
  //     if (!initialCountdownComplete) {
  //      let joinChallengeCountdown = $.cookie(set_countdown(2880.016, new Date()));
  //       console.log("Starting initial countdown: 2880.016 minutes");
  //     } else {
  //       // If already completed once, go straight to target date countdown
  //       let currentDate = new Date();
  //       $.removeCookie('joinChallengeCountdown')
  //       let diff = $.cookie('userTargetDate ')/ 1000 - currentDate.getTime() / 1000;
        
  //       if (diff > 0) {
  //         set_countdown(diff / 60, new Date());
  //         console.log("Starting target date countdown");
  //       } else {
  //         console.log("Target date has already passed!");
  //         $.removeCookie('userTargetDate');
  //         countdown.setTime(0);
  //       }
  //     }
  //   });
  
  // }).call(this);