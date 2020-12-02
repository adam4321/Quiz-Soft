/******************************************************************************
**  Description: START QUIZ PAGE - client side javascript file that takes the 
**               candidate to the take_quiz/:token/quiz route
**
**  Contains:    1 function that starts the quiz by getting the next route
******************************************************************************/


/* =================== QUIZ DISPLAY FUNCTIONS ======================== */

document.getElementById("start-btn").addEventListener('click', (e) => {
    e.preventDefault(); 

    let restart_check = localStorage.getItem('start_quiz_sempahore');

    if (restart_check !== null) {
        console.log("Attempting to restart timer...");
    }
    else {
        let secondsTimeStampEpoch = moment.utc().valueOf(); 
        localStorage.setItem('time_stamp', secondsTimeStampEpoch);
        localStorage.setItem('start_quiz_semaphore', 1);
        localStorage.removeItem('submit_quiz_semaphore');

        // Route the candidate to the quiz page
        let path = window.location.pathname;
        window.location.href = `${path}/quiz`;
    }
});
