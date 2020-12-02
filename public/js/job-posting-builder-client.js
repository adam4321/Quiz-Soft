/******************************************************************************
**  Description:  JOB POSTING BUILDER PAGE - client side javascript file that 
**                handles the dynamic behavior for the page
**
**  Contains:     verifyResponses
******************************************************************************/

let el_job_posting = document.getElementById("job_building_form");

/* SUBMIT FORM VERIFY RESPONSE - Function to check if quiz is selected page ------------------ */
el_job_posting.addEventListener('submit', (e) => {
    e.preventDefault();

    // Capture form data
    let el_job_title = document.getElementById('job_title');
    let el_job_description = document.getElementById('job_description');
    let el_job_message_text = document.getElementById('job_message_text');
    let el_quiz = document.getElementById('hidden_id');

    // Remove navigation prompt on form submission
    window.onbeforeunload = null;

    let req = new XMLHttpRequest();
    let path = '/quiz_soft/job_postings_builder/save_job_posting';

    // String that holds the form data
    let reqBody = {
        job_title: el_job_title.value,
        job_description: el_job_description.value,
        job_message_text: el_job_message_text.value,
        quiz: el_quiz.value
    };

    reqBody = JSON.stringify(reqBody);

    // Ajax HTTP POST request
    req.open('POST', path, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', () => {
        if (req.status >= 200 && req.status < 400) {
            window.location.href = '/quiz_soft/job_postings';
        } 
        else {
            console.error('Database return error');
        }
    });

    if (el_quiz.value !== "") {
        req.send(reqBody);
    }
    else {
        alert("Please select a quiz before building a Job Posting!");
        return false;
    }
});
