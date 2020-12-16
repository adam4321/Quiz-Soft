/******************************************************************************
**  Description: START QUIZ PAGE - client side javascript file that takes the 
**               candidate to the take_quiz/:token/quiz route
**
**  Contains:    1 function that starts the quiz by getting the next route
******************************************************************************/

/* Force a page reload when using the back button -------------------------- */
window.onunload = () => {};

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


/* START BUTTON - Fuction to redirect after pressing the start button ------ */
document.getElementById("start-btn").addEventListener('click', (e) => {
    e.preventDefault(); 

    // Route the candidate to the quiz page
    let path = window.location.pathname;
    window.location.href = `${path}/quiz`;    
});
