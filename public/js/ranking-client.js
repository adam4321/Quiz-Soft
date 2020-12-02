/******************************************************************************
**  Description:  RANKING PAGE - client side javascript file that handles
**                the dynamic behavior for the page
**
**  Contains:     goBack
**                createModals
******************************************************************************/

/* GO BACK - Function to go back to last page ------------------------------ */
function goBack() {
    window.history.back();
}

/* NAVIGATE TO GRAPHIC VISUALIZATION - Function to move to graphic page ------------------ */
function graphicLink(id) {
    window.location.href = `/quiz_soft/graphic?id=${id}`;
}


/* DISPLAY QUIZ MODAL - Function to display each quiz ---------------------- */

function createModals() {
    let table = document.getElementById('table-body');

    // Test whether the user has quizzes
    if (table) {
        let quizCount = table.rows.length;

        // Declare 3 arrays to hold the elements
        let modals = [];
        let btns = [];
        let spans = [];

        // Iterate over the quizzes and create their modals
        for (let i = 0; i < quizCount; i++) {
            // Get the modals
            modals.push(document.getElementById(`modal${i}`));

            // Get the button that opens the modal
            btns.push(document.getElementById(`rowModal${i}`));

            // Get the <span> element that closes the modal
            spans.push(document.getElementsByClassName("close")[i]);

            // When the user clicks on the button, open the modal
            btns[i].onclick = function() {
                modals[i].style.display = "block";
            }

            // When the user clicks on <span> (x), close the modal
            spans[i].onclick = function() {
                modals[i].style.display = "none";
            }
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            for (let i = 0; i < quizCount; i++) {
                if (event.target == modals[i]) {
                    modals[i].style.display = "none";
                }
            } 
        }
    }
}

// Call the function
createModals();
