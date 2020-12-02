/******************************************************************************
**  Description: DASHBOARD PAGE - client side javascript file that prevents
**               page refresh when sending quiz
**
**  Contains:    2 functions where 1 handles the actions after an email link
**               is sent and the 2nd handles deleting a user's account
******************************************************************************/

// Get form
let el_send_email = document.getElementById("test_sendgrid");

// Get animation
let el_send_email_animation = document.getElementById("modal");


/* SUBMIT FORM - Function to display status -------------------------------- */
document.getElementById("submit_email").addEventListener('click', (e) => {
    e.preventDefault();
    for (var i=0; i < el_send_email.elements.length; i++) {
        if (el_send_email.elements[i].value === '' && el_send_email.elements[i].hasAttribute('mandatory')) {
            alert('There are some required fields!');
            return false;
        }
    }
    console.log("Email on its way");
    el_send_email.submit();

    el_send_email_animation.style.display = 'block';
    setTimeout(() => {
        el_send_email_animation.style.display = 'none';
    }, 3000);
});


/* REMOVE USER - Function to handle the remove account button -------------- */
document.getElementById("removeUserButton").addEventListener('click', (e) => {
    e.preventDefault();

    if (confirm('Are you sure you want to delete your account?')) {
        let req = new XMLHttpRequest();
        let path = '/quiz_soft/dashboard/removeAccount';
    
        // Ajax HTTP POST request
        req.open('POST', path, true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener('load', () => {
            if (req.status >= 200 && req.status < 400) {
                console.log('Removed User');
                window.location.href = '/quiz_soft/logout';
            } else {
                console.error('Database return error');
            }
        });
        req.send();
    }
    else {
        return false;
    }
});
