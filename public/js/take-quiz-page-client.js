/******************************************************************************
**  Description: TAKE QUIZ PAGE - client side javascript file that creates
**               a verifies quiz responses, handles POST and times the quiz
**
**  Contains:    1 function that verifies check-box is checked if not leave
**               default value. Also timing functionality for client.
******************************************************************************/

/* Confirm back button page exit ------------------------------------------- */
window.onbeforeunload = function() {
    return true;
};


/* Force a page reload when using the back button -------------------------- */
window.onunload = () => {}

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


/* QUIZ TIMING - Function to load and maintain the automatic timer --------- */
window.onload = (e) => {
    // Pull the current server rendered time from the display
    let timerText = document.getElementById('timer-text').textContent.split(':');
    
    // Grab the minutes and seconds values
    let minutes = parseInt(timerText[0]);
    let seconds = parseInt(timerText[1]);

    // Check for the time being over and submit if so
    if (minutes === 0 && seconds === 0) {
        document.getElementById('submit-btn').click();
    }
    else {
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
                document.getElementById('submit-btn').click();
            }
            else {
                expected += interval;
                setTimeout(step, Math.max(0, interval - dt)); // Take the drift into account
            } 
        }


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
    }
}


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
