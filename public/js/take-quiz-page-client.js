/******************************************************************************
**  Description: TAKE QUIZ PAGE - client side javascript file that creates
**               a verifies quiz responses, handles POST and times the quiz
**
**  Contains:    1 function that verifies check-box is checked if not leave
**               default value. Also timing functionality for client.
******************************************************************************/

// Hide the timer until it loads
document.getElementById('timer-text').style.display = 'none';


/* Confirm back button page exit ------------------------------------------- */
window.onbeforeunload = (e) => {
    e.preventDefault();
    
    let refresh_check = localStorage.getItem('refresh_quiz_semaphore');
    
    if (refresh_check !== null) {
        refresh_check += 1;
        console.log(refresh_check);
        localStorage.setItem('refresh_quiz_semaphore', refresh_check);
    }
    else {
        localStorage.setItem('refresh_quiz_semaphore', 1);
    }

    return true;
};


/* Remove item on browser or tab close ------------------------------------------- */
window.onunload = () => {
    // Clear the local storage
    localStorage.removeItem('start_quiz_semaphore');
}

// Force a page reload when using the back button
if (window.history.state != null && window.history.state.hasOwnProperty('historic')) {
    if (window.history.state.historic == true) {
        document.body.style.display = 'none';
        window.history.replaceState({historic: false}, '');
        window.location.reload();
    } 
    else {
        window.history.replaceState({historic  : true}, '');
    }
} 
else {
    window.history.replaceState({historic  : true}, '');
}


/* QUIZ TIMING - Function to load and maintain the auto timer -------------- */
window.onload = (e) => {
    e.preventDefault();

    // Verify that the user has not attempted to return to quiz page after submission
    let back_button_check = localStorage.getItem('submit_quiz_semaphore');

    if (back_button_check === null) {
        // Set timerText to be actual time by finding the difference between start and return after refreshed time.
        var refresh_check = localStorage.getItem('refresh_quiz_semaphore');
        let timerText = document.getElementById('timer-text').textContent.split(':');
        let timerElement = document.getElementById('timer-text');
        let TIME_LIMIT = timerText[0] * 60000;

        if (refresh_check !== null) {
            let secondsTimeStampEpoch = moment.utc().valueOf(); 
            let old_val = localStorage.getItem('time_stamp');
            let timer_diff = Math.round((secondsTimeStampEpoch - old_val) / 1000);

            // Error, UTC capture error
            if (timer_diff < 0) {
                alert("UTC time stamping error");
                TIME_LIMIT = 0;
            }
            else {
                let TIME_seconds = timerText[0] * 60;
                let time_check = TIME_seconds - timer_diff;
                console.log(TIME_seconds, " ", time_check);

                // Error ran out of time
                if (time_check <= 0) {
                    TIME_LIMIT = 0;
                }
                else {
                    let resume_time_str = ((time_check / 60).toFixed(2).toString()).split('.');
                    let seconds = (parseInt(resume_time_str[1]) * 0.6).toFixed(0);
                     
                    if (seconds > 9) {
                        timerElement.textContent = Math.floor(time_check / 60) + ':' + seconds;
                    }
                    else {
                        timerElement.textContent = Math.floor(time_check / 60) + ':0' + seconds;
                    }

                    timerText = document.getElementById('timer-text').textContent.split(':');
                    TIME_LIMIT = (timerText[0] * 60000) + (timerText[1] * 600);
                }
            }
        }

        
        // Count down on the timer display
        let minutes = parseInt(timerText[0]);
        let seconds = parseInt(timerText[1]);

        // Display the timer
        document.getElementById('timer-text').style.display = '';
        
        // Update the time and render the new time to the screen
        function updateTimer() {
            if (seconds == 0) {
                seconds = 59
                minutes--;

                if (minutes < 10) {
                    document.getElementById('timer-text').textContent = `0${minutes}:${seconds}`;
                }
                else {
                    document.getElementById('timer-text').textContent = `${minutes}:${seconds}`;
                }
            }
            else if (seconds <= 10) {
                seconds--;

                if (minutes < 10) {
                    document.getElementById('timer-text').textContent = `0${minutes}:0${seconds}`;
                }
                else {
                    document.getElementById('timer-text').textContent = `${minutes}:0${seconds}`;
                }
            }
            else {
                seconds--;

                if (minutes < 10) {
                    document.getElementById('timer-text').textContent = `0${minutes}:${seconds}`;
                }
                else {
                    document.getElementById('timer-text').textContent = `${minutes}:${seconds}`;
                }
            }        
        }


        // Countdown the time
        var interval = 1000; // In ms
        var expected = Date.now() + interval;
        setTimeout(step, interval);

        function step() {
            // Calculate the drift (positive for overshooting)
            var dt = Date.now() - expected;

            // Render the new timer to the user
            updateTimer();

            // Auto-submit when time is up
            if (minutes === 0 && seconds === 0) {
                // Display no time
                document.getElementById('timer-text').textContent = `00:00`;

                // Click the submit button
                document.getElementById('submit-btn').click();
            }
            else {
                expected += interval;
                setTimeout(step, Math.max(0, interval - dt)); // Take the drift into account
            } 
        }
    }
    else {
        // Hide the timer and form
        var timerToHide = document.getElementById("timer-text");
        var formToHide = document.getElementById("take_quiz");
        timerToHide.style.visibility = "hidden"; 
        timerToHide.style.display = "none"; 
        formToHide.style.visibility = "hidden"; 
        formToHide.style.display = "none"; 
    }
};


/* SUBMIT form - Function to verify responses before posting --------------- */
document.getElementById("take_quiz").onsubmit = () => {
    let el_checks = document.querySelectorAll('input[class="check-all"]:not([id="default-check"])');
    let prev_name = "";
    let curr_name = "";
    let validate_any_chosen = 0;

    // Query all check-all classes with same name and if none selected. leave hidden default checkbox checked,
    // Else uncheck hidden default checkbox
    for (let i = 0; i < el_checks.length; i++) {
        curr_name = el_checks[i].attributes.name.value;

        if (i === 0) {
            prev_name = curr_name;
        }

        // For each question, if any checks, then set hidden default checkbox to unchecked
        if ((curr_name != prev_name) || (i === (el_checks.length - 1))) {

            // Set the default checkbox to unchecked
            if (validate_any_chosen > 0) {
                let el_default_check = document.querySelectorAll('input[id="default-check"][name="'+prev_name+'"]');
                let default_box = el_default_check.item(0);
                default_box.checked = false;
            }

            // Reset validate variable
            validate_any_chosen = 0;
            prev_name = curr_name;
        }

        // If an answer is checked increment
        if (el_checks.item(i).checked === true) {
            validate_any_chosen += 1;
        }
    }

    let el_time_display = document.getElementById('timer-text');
    let el_time_field = document.getElementById('timing_data');
    
    // Attach new value to hidden input based on timing
    el_time_field.setAttribute("value", el_time_display.innerText);

    // Remove navigation prompt on form submission
    window.onbeforeunload = null;
    
    // Set timer output to zero
    document.getElementById('timer-text').textContent = `00:00`;
    
    alert("The quiz was submitted");
};
