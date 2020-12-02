/******************************************************************************
**  Description:  JOB POSTING PAGE - client side javascript file that handles
**                the dynamic behavior for the page
**
**  Contains:     navigateToBuilder
**                followLink
**                deletePosting
******************************************************************************/

/* NAVIGATE TO JOBPOSTING BUILDER - Function to move to jobposting builder page ------------------ */
function navigateToBuilder() {
    window.location.href=`/quiz_soft/job_postings_builder`
}

/* NAVIGATE TO RANKING - Function to move to ranking page ------------------ */
function folowLink(id) {
    window.location.href = `/quiz_soft/ranking?id=${id}`;
}


/* DELETE POSTING - Function to delete a posting and update the table ------ */
function deletePosting(tbl, curRow, quizId, event) {
    event.stopPropagation();
    
    if (!confirm("Are you sure?")) {
        return;
    }
    else {
        let table = document.getElementById(tbl);
        let rowCount = table.rows.length;
        let req = new XMLHttpRequest();
        let path = "/quiz_soft/job_postings/delete";
        let reqBody = JSON.stringify({id: quizId});

        req.open("POST", path, true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener("load", () => {
            if (req.status >= 200 && req.status < 400) {
                // Check if the table will have more than the header row after the deletion                
                if (rowCount > 2) {
                    // Iterate over the table and find the row to delete
                    for (let i = 0; i < rowCount; i++) {
                        let row = table.rows[i];

                        // Find the correct row for the quiz
                        if (row == curRow.parentNode.parentNode) {
                            // Delete the row of the deleted quiz
                            table.deleteRow(i);
                        }
                    }                    
                }
                else {
                    // Remove the card and replace it with the no quizzes card
                    let card    = document.getElementById('dashboard-container');
                    let photo_1 = document.getElementById('profile-image');
                    let photo_2 = document.getElementById('profile-image-new');
                    let email   = document.getElementById('profile-email');
                    
                    // Check for the non-null email address and photo
                    let photo = (photo_1 !== null) ? photo_1 : photo_2;
                    card.remove();

                    // Add container to the page
                    let quizzesEmpty       = document.createElement('div');
                    quizzesEmpty.classList = 'mdl-card mdl-shadow--2dp';
                    quizzesEmpty.id        = 'dashboard-container';
                    document.getElementById('top-row-container').appendChild(quizzesEmpty);

                    // Create the card header
                    let topBar            = document.createElement('div');
                    let cardTitle         = document.createElement('h2');
                    topBar.classList      = 'mdl-card__title mdl-color-text--white dashboard-top-bar';
                    cardTitle.classList   = 'mdl-card__title-text';
                    cardTitle.textContent = 'Job Postings';
                    quizzesEmpty.appendChild(topBar);
                    topBar.appendChild(cardTitle);

                    // Create the empty quiz container
                    let emptyContainer       = document.createElement('div');
                    emptyContainer.classList = 'mdl-card__supporting-text mdl-color-text--grey-600 no-posting-content';
                    quizzesEmpty.appendChild(emptyContainer);

                    // Fill the empty quiz container with the user's information
                    let profileDiv = document.createElement('div');
                    let newPhoto   = document.createElement('img');
                    let newEmail   = document.createElement('p');
                    newPhoto       = photo;
                    newEmail       = email;
                    profileDiv.id  = 'profile-div';
                    newPhoto.id    = 'profile-image-new';
                    newEmail.id    = 'profile-email';
                    emptyContainer.appendChild(profileDiv);
                    profileDiv.appendChild(newPhoto);
                    profileDiv.appendChild(newEmail);

                    // Create the upload button
                    let linkDiv = document.createElement('div');
                    let linkMsg = document.createElement('p');
                    let linkBtn = document.createElement('button');

                    linkDiv.id          = 'link-div';
                    linkMsg.id          = 'link-txt';
                    linkMsg.textContent = 'Create a Job';
                    linkBtn.id          = 'link-btn-new';
                    linkBtn.className   = 'btn-style';
                    linkBtn.textContent = 'Create';
                    linkBtn.className   = 'btn-style';
                    linkBtn.addEventListener("click", navigateToBuilder);

                    emptyContainer.appendChild(linkDiv);
                    linkDiv.appendChild(linkMsg);
                    linkDiv.appendChild(linkBtn);

                    // Fill the empty quiz container with the no quizzes message
                    let newBreak = document.createElement('hr');
                    let msgDiv   = document.createElement('div');
                    let newLogo  = document.createElement('img');
                    let newMsg   = document.createElement('p');

                    newBreak.id        = 'no-posting-break';
                    msgDiv.id          = 'no-posting-div';
                    newLogo.id         = 'question-logo';
                    newLogo.src        = 'images/logo.png';
                    newMsg.id          = 'no-posting-txt';
                    newMsg.textContent = 'No Postings Yet';

                    emptyContainer.appendChild(newBreak);
                    emptyContainer.appendChild(msgDiv);
                    msgDiv.appendChild(newLogo);
                    msgDiv.appendChild(newMsg);
                }
            } 
            else {
                console.error("Delete request error");
            }
        });

        req.send(reqBody);
    }
}
