/******************************************************************************
**  Description: QUIZ BUILDER PAGE - client side javascript file that creates
**               a quiz dynamically and submits the form to the node server
**               POST route /quiz_create/submit_quiz
**
**  Contains:    4 functions which each handle the creation of a quiz question.
**               4 functions which each handle the display of a created
**               question and its associated delete button which are called by
**               the factory function displayQuizHandler. 
******************************************************************************/

// Declare an empty quiz object
let quiz = {};

// Parse the url for the quiz setup
const urlParams = new URLSearchParams(window.location.search);

// Enter the quiz setup values into the quiz object
quiz.title      = urlParams.get('quiz_title');
quiz.category   = urlParams.get('category');
quiz.limit      = urlParams.get('time_limit');
quiz.questions  = [];

// Global iterator for question count (Must be 1+ to submit quiz)
let QUESTION_COUNT        = 0;
let questionCount         = document.getElementById('question-count');
questionCount.textContent = QUESTION_COUNT;

// Target button ids
let trueFalseBtn = document.getElementById('true_false_btn');
let multBtn      = document.getElementById('multiple_c_btn');
let fillInBtn    = document.getElementById('fill_in_btn');
let checkAllBtn  = document.getElementById('choose_all_btn');

// Target quiz form
let quiz_form = document.getElementById('quiz_form');

// Target bottom empty div to scroll the page
let scrollDiv = document.getElementById('scroll-target');

// Create submit button
let submitBtn         = document.createElement('button');
let line              = document.createElement('hr');
submitBtn.id          = 'submit-btn';
submitBtn.className   = 'mdl-button mdl-js-button mdl-button--raised  mdl-button--colored';
submitBtn.textContent = 'Submit Quiz';

// Target Cancel Build button
let cancelBuildBtn = document.getElementById('exit_btn');

// Target quiz display div
let quiz_container = document.getElementById('quiz_display_container');
quiz_container.style.display = 'none';

// Target quiz display tbody and track order of questions added (to use in deletion)
let quiz_display  = document.getElementById('quiz_display');
let INITIAL_ORDER = 0;

// Global iterator for multiple choice answerBox count
let MC_ANSWER_COUNT = 0;
const MC_ANSWER_LIMIT = 8;


/* Multiple choice adds another answerBox ---------------------------------- */
function addAnswerOnClick(event) { 
    event.preventDefault();

    let anchorNode = document.getElementById("appendBefore");
    
    if (MC_ANSWER_COUNT < MC_ANSWER_LIMIT){
        MC_ANSWER_COUNT++;

        // Create the answer in the blank input
        let breakDiv = document.createElement('br');
        let answerBox = document.createElement('input');
        let answerLabel = document.createElement('label');
        let answerInput = document.createElement('textarea');
        answerBox.type        = 'radio';
        answerBox.name        = 'mcGroup';
        answerBox.id          = 'answerBox' + MC_ANSWER_COUNT;
        answerBox.className   = 'answer_input'; 
        answerLabel.for       = 'answerBox' + MC_ANSWER_COUNT;
        answerInput.id          = 'answerInput' + MC_ANSWER_COUNT;
        answerInput.className   = 'answer_input';
        answerInput.placeholder = 'Answer in blank';
        breakDiv.id             = 'answerBreak' + MC_ANSWER_COUNT;
        answerInput.setAttribute('data-lpignore','true');
        createBox.insertBefore(answerBox, anchorNode);
        createBox.insertBefore(answerLabel, anchorNode);
        answerLabel.appendChild(answerInput);
        createBox.insertBefore(breakDiv, anchorNode);

        // Scroll the window to the bottom
        scrollDiv.scrollIntoView({behavior: "smooth", block: "center"});
    }
};


/* Multiple choice removes the last answerBox ------------------------------ */
function removeAnswerOnClick(event) { 
    event.preventDefault();

    if (MC_ANSWER_COUNT > 1) {
        document.getElementById("answerBox"+MC_ANSWER_COUNT).outerHTML = "";
        document.getElementById("answerInput"+MC_ANSWER_COUNT).outerHTML = "";
        document.getElementById("answerBreak"+MC_ANSWER_COUNT).outerHTML = "";
        MC_ANSWER_COUNT--;
    }
};

/* Confirm back button page exit ------------------------------------------- */
window.onbeforeunload = function() {
    return true;
};


/* CANCEL BUILD BUTTON - Function to confirm quiz exit --------------------- */
cancelBuildBtn.addEventListener('click', (e) => {
    e.preventDefault();

    if (confirm('Are you sure that you want to exit?')) {
        // Remove navigation prompt on form submission
        window.onbeforeunload = null;
        window.location.href='/quiz_soft/quiz_builder';
    }
    else {
        return false;
    }
});


/* Handles what function to add to the display from the quiz object -------- */
function displayQuizHandler(question_num, question_arr) {
    // Retreive last added question
    let q_obj           = question_arr[question_arr.length-1];
    let quiz_type       = q_obj.quizType;
    let question_text   = q_obj.quizQuestion;
    let question_key    = q_obj.quizKey;
    let question_answers = q_obj.quizAnswers;
    
    switch (quiz_type) {
        // If True False Question
        case "true-false":
            renderQuestionTF(question_num, question_text, question_key);
            break;
        // If Multiple Choices Question
        case "mult-choice":
            renderQuestionMultChoice(question_num, question_text, question_key, question_answers);
            break;
        // If Fill in the Blank Question
        case "fill-blank":
            renderQuestionFillBlank(question_num, question_text, question_key);
            break;
        // If Check All Question
        case "check-all":
            renderQuestionCheckAll(question_num, question_text, question_key, question_answers);
            break;
    }
};


/* =================== QUESTION RENDERING FUNCTIONS ======================== */

/* Append True/False Question ---------------------------------------------- */
function renderQuestionTF(question_num, question_text, tfValue) {
    // If adding question show container
    if (quiz_container.style.display === 'none') {
        quiz_container.style.display = 'block';
    }

    // Increment the question added index for possible deletion later
    INITIAL_ORDER++;

    // Add a new row to display the question
    let tableRowDisplay = document.createElement('tr');
    tableRowDisplay.id  = "tableRow_" + INITIAL_ORDER;
    quiz_display.appendChild(tableRowDisplay);

    let tableDisplay = document.createElement('td');
    tableDisplay.id  = "tableDisplay_" + INITIAL_ORDER;
    tableRowDisplay.appendChild(tableDisplay);

    // Use the correct question_num value to track the question count
    let headerDisplay        = document.createElement('h5');
    headerDisplay.innerText  = "Q" + question_num;
    tableDisplay.appendChild(headerDisplay);

    let questionDisplay        = document.createElement('i');
    questionDisplay.className  = 'question-list';
    questionDisplay.innerText  = question_text;
    tableDisplay.appendChild(questionDisplay);

    let ansTrueDisplay       = document.createElement('li');
    ansTrueDisplay.id        = 'ansTrueDisplay' + INITIAL_ORDER;
    ansTrueDisplay.innerHTML = "True " + (tfValue ? "&#x2611" : "");
    tableDisplay.appendChild(ansTrueDisplay);

    let ansFalseDisplay         = document.createElement('li');
    ansFalseDisplay .id         = 'ansFalseDisplay' + INITIAL_ORDER;
    ansFalseDisplay .innerHTML  = "False " + (tfValue ? "" :  "&#x2611");
    tableDisplay.appendChild(ansFalseDisplay);

    // Display delete button
    let tableDeleteDisplay       = document.createElement('td');
    tableDeleteDisplay.id        = "tableDeleteDisplay_" + INITIAL_ORDER;
    tableDeleteDisplay.innerHTML = "<button>Delete</button>";
    tableRowDisplay.appendChild(tableDeleteDisplay);
    tableDeleteDisplay.childNodes[0].classList = 'deleteBtn mdl-button mdl-js-button mdl-button--raised';

    // Delete button handler to remove the question for the quiz object and the DOM
    tableDeleteDisplay.childNodes[0].addEventListener('click', (e) => {
        e.preventDefault();

        // Find array index of the question to remove
        let qIndex = headerDisplay.innerText.substring(1, headerDisplay.innerText.length);
        qIndex--;

        // Remove the question from the quiz object
        quiz.questions.splice(qIndex, 1);

        // Remove the displayed question
        tableRowDisplay.remove();

        // Update the question count
        questionCount.textContent = --QUESTION_COUNT;

        // Remove the submit button if there are no questions
        if (QUESTION_COUNT === 0) {
            quiz_container.style.display = 'none';
            line.style.display           = 'none';
            submitBtn.style.display      = 'none';
        }
        else {
            // Update the Q numbers of remaining questions
            for (var i = 0, row; row = quiz_display.rows[i]; i++) {
                row.children[0].childNodes[0].innerText = `Q${i + 1}`;
            }
        }
    })
};


/* Append Multiple Choice Question ----------------------------------------- */
function renderQuestionMultChoice(question_num, question_text, question_key, question_answers) {
    // If adding question show container
    if (quiz_container.style.display === 'none') {
        quiz_container.style.display = 'block';
    }

    // Increment the question added index for possible deletion later
    INITIAL_ORDER++;

    // Add a new row to display the question
    let tableRowDisplay = document.createElement('tr');
    tableRowDisplay.id  = "tableRow_" + INITIAL_ORDER;
    quiz_display.appendChild(tableRowDisplay);

    let tableDisplay = document.createElement('td');
    tableDisplay.id  = "tableDisplay_" + INITIAL_ORDER;
    tableRowDisplay.appendChild(tableDisplay);

    // Use the correct question_num value to track the question count
    let headerDisplay        = document.createElement('h5');
    headerDisplay.innerText  = "Q" + question_num;
    tableDisplay.appendChild(headerDisplay);

    let questionDisplay       = document.createElement('i');
    questionDisplay.innerText = question_text;
    tableDisplay.appendChild(questionDisplay);

    // Loop to display the associated number of answer strings
    for (let i = 0; i < question_answers.length; i++) {
        let ansDisplay = document.createElement('li');
        ansDisplay.id  = 'ansDisplay' + INITIAL_ORDER;
        
        // Add the checkbox to correct answer
        if (question_key == i) {
            ansDisplay.innerHTML  = question_answers[i] + " &#x2611";
        }
        else {
            ansDisplay.innerHTML  = question_answers[i];
        }

        // Render the formed answer
        tableDisplay.appendChild(ansDisplay);
    }

    // Display the delete button
    let tableDeleteDisplay       = document.createElement('td');
    tableDeleteDisplay.id        = "tableDeleteDisplay_" + INITIAL_ORDER;
    tableDeleteDisplay.innerHTML = "<button>Delete</button>";
    tableRowDisplay.appendChild(tableDeleteDisplay);
    tableDeleteDisplay.childNodes[0].classList = 'deleteBtn mdl-button mdl-js-button mdl-button--raised';

    // Delete button handler to remove the question for the quiz object and the DOM
    tableDeleteDisplay.childNodes[0].addEventListener('click', (e) => {
        e.preventDefault();

        // Find array index of the question to remove
        let qIndex = headerDisplay.innerText.substring(1, headerDisplay.innerText.length);
        qIndex--;

        // Remove the question from the quiz object
        quiz.questions.splice(qIndex, 1);

        // Remove the displayed question
        tableRowDisplay.remove();

        // Update the question count
        questionCount.textContent = --QUESTION_COUNT;

        // Remove the submit button if there are no questions
        if (QUESTION_COUNT === 0) {
            quiz_container.style.display = 'none';
            line.style.display           = 'none';
            submitBtn.style.display      = 'none';
        }
        else {
            // Update the Q numbers of remaining questions
            for (var i = 0, row; row = quiz_display.rows[i]; i++) {
                row.children[0].childNodes[0].innerText = `Q${i + 1}`;
            }
        }
    })
};


/* Append Fill in the Blank Question --------------------------------------- */
function renderQuestionFillBlank(question_num, question_text, question_key) {
    // If adding question show container
    if (quiz_container.style.display === 'none') {
        quiz_container.style.display = 'block';
    }

    // Increment the question added index for possible deletion later
    INITIAL_ORDER++;

    // Add a new row to display the question
    let tableRowDisplay = document.createElement('tr');
    tableRowDisplay.id  = "tableRow_" + INITIAL_ORDER;
    quiz_display.appendChild(tableRowDisplay);

    let tableDisplay = document.createElement('td');
    tableDisplay.id  = "tableDisplay_" + INITIAL_ORDER;
    tableRowDisplay.appendChild(tableDisplay);

    // Use the correct question_num value to track the question count
    let headerDisplay        = document.createElement('h5');
    headerDisplay.innerText  = "Q" + question_num;
    tableDisplay.appendChild(headerDisplay);

    let questionDisplay1        = document.createElement('i');
    questionDisplay1.innerText  = `${question_text[0]} `;
    tableDisplay.appendChild(questionDisplay1);

    let ansDisplay                  = document.createElement('i');
    ansDisplay.innerText            = `${question_key}`;
    ansDisplay.style.textDecoration = 'underline';
    tableDisplay.appendChild(ansDisplay);

    let questionDisplay2        = document.createElement('i');
    questionDisplay2.innerText  = ` ${question_text[1]}`;
    tableDisplay.appendChild(questionDisplay2);

    // Display the delete button
    let tableDeleteDisplay       = document.createElement('td');
    tableDeleteDisplay.id        = "tableDeleteDisplay_" + INITIAL_ORDER;
    tableDeleteDisplay.innerHTML = "<button>Delete</button>";
    tableRowDisplay.appendChild(tableDeleteDisplay);
    tableDeleteDisplay.childNodes[0].classList = 'deleteBtn mdl-button mdl-js-button mdl-button--raised';

    // Delete button handler to remove the question for the quiz object and the DOM
    tableDeleteDisplay.childNodes[0].addEventListener('click', (e) => {
        e.preventDefault();

        // Find array index of the question to remove
        let qIndex = headerDisplay.innerText.substring(1, headerDisplay.innerText.length);
        qIndex--;

        // Remove the question from the quiz object
        quiz.questions.splice(qIndex, 1);

        // Remove the displayed question
        tableRowDisplay.remove();

        // Update the question count
        questionCount.textContent = --QUESTION_COUNT;

        // Remove the submit button if there are no questions
        if (QUESTION_COUNT === 0) {
            quiz_container.style.display = 'none';
            line.style.display           = 'none';
            submitBtn.style.display      = 'none';
        }
        else {
            // Update the Q numbers of remaining questions
            for (var i = 0, row; row = quiz_display.rows[i]; i++) {
                row.children[0].childNodes[0].innerText = `Q${i + 1}`;
            }
        }
    })
};


/* Append Check all Question ----------------------------------------------- */
function renderQuestionCheckAll(question_num, question_text, question_key, question_answers) {
    // If adding question show container
    if (quiz_container.style.display === 'none') {
        quiz_container.style.display = 'block';
    }

    // Increment the question added index for possible deletion later
    INITIAL_ORDER++;

    // Add a new row to display the question
    let tableRowDisplay = document.createElement('tr');
    tableRowDisplay.id  = "tableRow_" + INITIAL_ORDER;
    quiz_display.appendChild(tableRowDisplay);

    let tableDisplay = document.createElement('td');
    tableDisplay.id  = "tableDisplay_" + INITIAL_ORDER;
    tableRowDisplay.appendChild(tableDisplay);

    // Use the correct question_num value to track the question count
    let headerDisplay        = document.createElement('h5');
    headerDisplay.innerText  = "Q" + question_num;
    tableDisplay.appendChild(headerDisplay);

    let questionDisplay       = document.createElement('i');
    questionDisplay.innerText = question_text;
    tableDisplay.appendChild(questionDisplay);

    // Loop to display the associated number of answer strings
    for (let i = 0; i < question_answers.length; i++) {
        let ansDisplay = document.createElement('li');
        ansDisplay.id  = 'ansDisplay' + INITIAL_ORDER;
        
        // No boxes checked
        ansDisplay.innerHTML = question_answers[i]; 

        // Add the checkbox to correct answers
        for (let j = 0; j < question_key.length; j++) {
            if (question_key[j] == i) {
                ansDisplay.innerHTML = question_answers[i] + " &#x2611";
                break;
            }
            else {
                ansDisplay.innerHTML = question_answers[i];
            }
        }

        // Render the formed answer
        tableDisplay.appendChild(ansDisplay);
    }

    // Display the delete button
    let tableDeleteDisplay       = document.createElement('td');
    tableDeleteDisplay.id        = "tableDeleteDisplay_" + INITIAL_ORDER;
    tableDeleteDisplay.innerHTML = "<button>Delete</button>";
    tableRowDisplay.appendChild(tableDeleteDisplay);
    tableDeleteDisplay.childNodes[0].classList = 'deleteBtn mdl-button mdl-js-button mdl-button--raised';

    // Delete button handler to remove the question for the quiz object and the DOM
    tableDeleteDisplay.childNodes[0].addEventListener('click', (e) => {
        e.preventDefault();

        // Find array index of the question to remove
        let qIndex = headerDisplay.innerText.substring(1, headerDisplay.innerText.length);
        qIndex--;

        // Remove the question from the quiz object
        quiz.questions.splice(qIndex, 1);

        // Remove the displayed question
        tableRowDisplay.remove();

        // Update the question count
        questionCount.textContent = --QUESTION_COUNT;

        // Remove the submit button if there are no questions
        if (QUESTION_COUNT === 0) {
            quiz_container.style.display = 'none';
            line.style.display           = 'none';
            submitBtn.style.display      = 'none';
        }
        else {
            // Update the Q numbers of remaining questions
            for (var i = 0, row; row = quiz_display.rows[i]; i++) {
                row.children[0].childNodes[0].innerText = `Q${i + 1}`;
            }
        }
    })
};


/* ===================== QUESTION CREATION FUNCTIONS ======================= */

/* TRUE/FALSE BUTTON - Function to create true false question -------------- */
trueFalseBtn.addEventListener('click', (e) => {
    e.preventDefault();

    // Create a div to append to
    let createBox = document.createElement('div');
    createBox.id  = 'createBox';
    quiz_form.appendChild(createBox);

    // Hide the question selection buttons, submit, and prompt
    for (let el of document.querySelectorAll('.question-btn')) el.style.display = 'none';
    let questionPrompt           = document.getElementById('question-prompt');
    questionPrompt.style.display = 'none';
    submitBtn.style.display      = 'none';
    line.style.display           = 'none';

    // Increment and display question number
    let questionNum         = document.createElement('p');
    questionNum.className   = 'questionNum';
    questionNum.textContent = `Question #${QUESTION_COUNT + 1} - True | False`;
    createBox.appendChild(questionNum);

    // Create the question input
    let questionBox         = document.createElement('textarea');
    questionBox.placeholder = 'Enter Question';
    questionBox.id          = 'questionBox';
    questionBox.className   = 'question_input';
    createBox.appendChild(questionBox);

    // Create true radio button
    let trueRadio     = document.createElement('input');
    trueRadio.type    = 'radio';
    trueRadio.id      = 'true-radio';
    trueRadio.value   = 'True';
    trueRadio.name    = 'true-false';
    trueRadio.checked = false;

    // Create false radio button
    let falseRadio     = document.createElement('input');
    falseRadio.type    = 'radio';
    falseRadio.id      = 'false-radio';
    falseRadio.value   = 'False';
    falseRadio.name    = 'true-false';
    falseRadio.checked = false;
    
    // Label the buttons
    let labelTrue      = document.createElement('label');
    let labelFalse     = document.createElement('label');
    labelTrue.htmlFor  = 'true-radio';
    labelFalse.htmlFor = 'false-radio';
    
    // Create text descriptions
    let descriptionTrue  = document.createTextNode('True');
    let descriptionFalse = document.createTextNode('False');
    labelTrue.appendChild(descriptionTrue);
    labelFalse.appendChild(descriptionFalse);
    
    // Add the buttons to the DOM
    let newline = document.createElement('br');
    createBox.appendChild(trueRadio);
    createBox.appendChild(labelTrue);
    createBox.appendChild(newline);
    createBox.appendChild(falseRadio);
    createBox.appendChild(labelFalse);
    createBox.appendChild(newline);

    // Show the question complete button
    let completeBtn = document.createElement('button');
    completeBtn.className   = 'mdl-button mdl-js-button mdl-button--raised  mdl-button--colored complete-button';
    completeBtn.textContent = 'Complete Question';
    createBox.appendChild(completeBtn);

    // Show the question cancel button
    let cancelBtn = document.createElement('button');
    cancelBtn.className   = 'mdl-button mdl-js-button mdl-button--raised  mdl-button--colored cancel-button';
    cancelBtn.textContent = 'Cancel Question';
    createBox.appendChild(cancelBtn);

    // Event handler to register the new question
    completeBtn.addEventListener('click', (e) => {
        // Input validation to require values for question and answer
        questionBox.required = true;
        trueRadio.required   = 'true';

        // Check if the required fields are filled
        if (questionBox.value !== '' && 
            document.getElementById("true-radio").checked || document.getElementById("false-radio").checked) {
            // Check whether true or false
            let tfValue;
            if (document.getElementById("true-radio").checked) {
                tfValue = true;
            } else {
                tfValue = false;
            }

            // Create question object (No answers because they are always 'True' and 'False')
            let obj = {
                quizQuestion: questionBox.value,
                quizKey: tfValue,
                quizType: 'true-false'
            }
        
            // Insert the question object into the quiz object
            quiz.questions.push(obj);

            // Remove the question setup from DOM and display the question type buttons
            createBox.remove();
            questionPrompt.style.display = 'block';
            for (let el of document.querySelectorAll('.question-btn')) el.style.display = 'inline-block';

            // Increment question count
            questionCount.textContent = ++QUESTION_COUNT;

            // Display saved question
            displayQuizHandler(QUESTION_COUNT, quiz.questions);

            // Display submit button
            line.style.display      = 'block';
            submitBtn.style.display = 'block';
            quiz_form.appendChild(line);
            quiz_form.appendChild(submitBtn);

            // Scroll the window to the bottom
            scrollDiv.scrollIntoView({behavior: "smooth", block: "center"});
        }
    });

    // Event handler for the cancel button
    cancelBtn.addEventListener('click', (e) => {
        // Hide the complete button
        createBox.remove();
        questionPrompt.style.display = 'block';
        for (let el of document.querySelectorAll('.question-btn')) el.style.display = 'inline-block';

        if (QUESTION_COUNT >= 1) {
            // Display submit button
            line.style.display      = 'block';
            submitBtn.style.display = 'block';
            quiz_form.appendChild(line);
            quiz_form.appendChild(submitBtn);
        }
    });
});


/* MULTIPLE CHOICE BUTTON - Function to create mult choice question -------- */
multBtn.addEventListener('click', (e) => {
    e.preventDefault();

    // Initialize answer count to zero
    MC_ANSWER_COUNT = 0;

    // Create a div to append to
    let createBox = document.createElement('div');
    createBox.id  = 'createBox';
    quiz_form.appendChild(createBox);

    // Hide the question selection buttons, submit, and prompt
    for (let el of document.querySelectorAll('.question-btn')) el.style.display = 'none';
    let questionPrompt = document.getElementById('question-prompt');
    questionPrompt.style.display = 'none';
    submitBtn.style.display      = 'none';
    line.style.display           = 'none';

    // Increment and display question number
    let questionNum = document.createElement('p');
    questionNum.className   = 'questionNum';
    questionNum.textContent = `Question #${QUESTION_COUNT + 1} - Multiple Choice`;
    createBox.appendChild(questionNum);

    // Create the question input
    let questionBox = document.createElement('textarea');
    questionBox.placeholder = 'Enter Question';
    questionBox.id          = 'questionBox';
    questionBox.className   = 'question_input';
    createBox.appendChild(questionBox);

    // Create the answer in the blank input
    let btnContainer = document.createElement('div');
    let addBtn       = document.createElement('button');
    let plusSign     = document.createElement('i');
    let minusBtn     = document.createElement('button');
    let minusSign    = document.createElement('i');

    // Style the Plus and Minus buttons and controls to add and remove answers
    addBtn.classList        = 'mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab';
    plusSign.classList      = 'material-icons plusSign';
    plusSign.innerText      = 'add';
    addBtn.onclick          = addAnswerOnClick;
    minusBtn.classList      = 'mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab';
    minusSign.classList     = 'material-icons minusSign';
    minusSign.innerText     = '-';
    minusBtn.style.display  = 'inline-block';
    minusBtn.onclick        = removeAnswerOnClick;
    let breakDiv            = document.createElement('br');
    let breakParagraph      = document.createElement('p');
    let answerBox           = document.createElement('input');
    let answerLabel         = document.createElement('label');
    let answerInput         = document.createElement('textarea');
    let lineBreakLast       = document.createElement('br');
    lineBreakLast.id        = "appendBefore";
    answerBox.type          = 'radio';
    answerBox.name          = 'mcGroup';
    answerBox.id            = 'answerBox' + 1;
    answerBox.className     = 'answer_input'; 
    answerLabel.for         = 'answerBox' + 1;
    answerInput.id          = 'answerInput' + 1;
    answerInput.className   = 'answer_input';
    answerInput.placeholder = 'Answer in blank';
    answerInput.setAttribute('data-lpignore','true');

    // Give the user instructions
    let instructions         = document.createElement('p');
    instructions.className   = 'question_instructions';
    instructions.textContent = 'Press + for more answers and - to remove them';
    createBox.appendChild(instructions);

    // Add the + and - controls to createBox
    createBox.appendChild(btnContainer);
    addBtn.appendChild(plusSign);
    minusBtn.appendChild(minusSign);
    btnContainer.appendChild(addBtn);
    btnContainer.appendChild(minusBtn);
    createBox.appendChild(breakParagraph);
    createBox.appendChild(answerBox);
    createBox.appendChild(answerLabel);
    answerLabel.appendChild(answerInput);
    createBox.appendChild(breakDiv);
    createBox.appendChild(lineBreakLast);

    // Initialize first answer as checked
    document.getElementById("answerBox1").checked = true;
    MC_ANSWER_COUNT++;

    // Show the question complete button
    let completeBtn         = document.createElement('button');
    completeBtn.className   = 'mdl-button mdl-js-button mdl-button--raised  mdl-button--colored complete-button';
    completeBtn.textContent = 'Complete Question';
    createBox.appendChild(completeBtn);

    // Show the question cancel button
    let cancelBtn         = document.createElement('button');
    cancelBtn.className   = 'mdl-button mdl-js-button mdl-button--raised  mdl-button--colored cancel-button';
    cancelBtn.textContent = 'Cancel Question';
    createBox.appendChild(cancelBtn);

    // Scroll the window to the bottom
    scrollDiv.scrollIntoView({behavior: "smooth", block: "center"});

    // Event handler to register the new question
    completeBtn.addEventListener('click', (e) => {
        // Input validation to require values for question
        questionBox.required = true;

        // Array of answers
        let ansArray = [];

        // Check if the required fields are filled
        let allAnswered = 1;
        let indexValue = 0;
        let mcValue = 0;

        for (let i = 0; i < MC_ANSWER_COUNT; i++){
            indexValue = i + 1;
            
            if (document.getElementById("answerBox"+indexValue).checked) {
                mcValue = i;
            }

            // Not all answered do not continue
            document.getElementById("answerInput" + indexValue).required = 'true';
            if (document.getElementById("answerInput"+indexValue).value == '') {
                allAnswered = 0;
            }

            // Add the answer to an array to pass into object
            ansArray.push(document.getElementById("answerInput"+indexValue).value);
        }
        
        if (questionBox.value !== '' && allAnswered === 1) {
            // Create question object
            let obj = {
                quizQuestion: questionBox.value,
                quizKey: mcValue,
                quizAnswers: ansArray,
                quizType: 'mult-choice'
            }
        
            // Insert the question object into the quiz object
            quiz.questions.push(obj);

            // Remove the question setup from DOM and display the question type buttons
            createBox.remove();
            questionPrompt.style.display = 'block';
            for (let el of document.querySelectorAll('.question-btn')) el.style.display = 'inline-block';

            // Increment question count
            questionCount.textContent = ++QUESTION_COUNT;

            // Display saved question
            displayQuizHandler(QUESTION_COUNT, quiz.questions);

            // Display submit button
            line.style.display      = 'block';
            submitBtn.style.display = 'block';
            quiz_form.appendChild(line);
            quiz_form.appendChild(submitBtn);

            // Scroll the window to the bottom
            scrollDiv.scrollIntoView({behavior: "smooth", block: "center"});
        }
        else {
            return;
        }
    });

    // Event handler for the cancel button
    cancelBtn.addEventListener('click', (e) => {
        // Hide the complete button
        createBox.remove();
        questionPrompt.style.display = 'block';
        for (let el of document.querySelectorAll('.question-btn')) el.style.display = 'inline-block';

        if (QUESTION_COUNT >= 1) {
            // Display submit button
            line.style.display      = 'block';
            submitBtn.style.display = 'block';
            quiz_form.appendChild(line);
            quiz_form.appendChild(submitBtn);
        }
    });
});


/* FILL IN THE BLANK - Function to create fill in blank question ----------- */
fillInBtn.addEventListener('click', (e) => {
    e.preventDefault();

    // Create a div to append to
    let createBox = document.createElement('div');
    createBox.id  = 'createBox';
    quiz_form.appendChild(createBox);

    // Hide the question selection buttons, submit, and prompt
    for (let el of document.querySelectorAll('.question-btn')) el.style.display = 'none';
    let questionPrompt           = document.getElementById('question-prompt');
    questionPrompt.style.display = 'none';
    submitBtn.style.display      = 'none';
    line.style.display           = 'none';

    // Increment and display question number
    let questionNum         = document.createElement('p');
    questionNum.className   = 'questionNum';
    questionNum.textContent = `Question #${QUESTION_COUNT + 1} - Fill in the Blank`;
    createBox.appendChild(questionNum);

    // Create the first question fragment input
    let questionBox1         = document.createElement('textarea');
    questionBox1.placeholder = 'Question before blank';
    questionBox1.id          = 'questionBox1';
    questionBox1.className   = 'question_input';
    createBox.appendChild(questionBox1);

    // Create the second question fragment input
    let questionBox2         = document.createElement('textarea');
    questionBox2.placeholder = 'Question after blank';
    questionBox2.id          = 'questionBox2';
    questionBox2.className   = 'question_input';
    createBox.appendChild(questionBox2);

    // Give the user instructions
    let instructions         = document.createElement('p');
    // let lineBreak            = document.createElement('hr');
    instructions.textContent = 'Enter the answer which fills the blank'
    // createBox.appendChild(lineBreak);
    createBox.appendChild(instructions);

    // Create the answer in the blank input
    let answerBox         = document.createElement('textarea');
    answerBox.placeholder = 'Answer in blank';
    answerBox.id          = 'answerBox';
    answerBox.className   = 'answer_input';
    answerBox.setAttribute('data-lpignore','true');
    createBox.appendChild(answerBox);

    // Show the question complete button
    let completeBtn         = document.createElement('button');
    completeBtn.className   = 'mdl-button mdl-js-button mdl-button--raised  mdl-button--colored complete-button';
    completeBtn.textContent = 'Complete Question';
    createBox.appendChild(completeBtn);

    // Show the question cancel button
    let cancelBtn         = document.createElement('button');
    cancelBtn.className   = 'mdl-button mdl-js-button mdl-button--raised  mdl-button--colored cancel-button';
    cancelBtn.textContent = 'Cancel Question';
    createBox.appendChild(cancelBtn);

    // Scroll the window to the bottom
    scrollDiv.scrollIntoView({behavior: "smooth", block: "center"});

    // Event handler to register the new question
    completeBtn.addEventListener('click', (e) => {
        // Input validation to require values for question and answer
        questionBox1.required = true;
        questionBox2.required = true;
        answerBox.required    = true;

        // Check if the required fields are filled
        if (questionBox1.value !== '' && questionBox2.value !== '' && answerBox.value !== '') {
            // Create question object (No answers because it is always an empty string)
            let obj = {
                quizQuestion: [questionBox1.value, questionBox2.value],
                quizKey: answerBox.value,
                quizType: 'fill-blank'
            }
        
            // Insert the question object into the quiz object
            quiz.questions.push(obj);

            // Remove the question setup from DOM and display the question type buttons
            createBox.remove();
            questionPrompt.style.display = 'block';
            for (let el of document.querySelectorAll('.question-btn')) el.style.display = 'inline-block';

            // Increment question count
            questionCount.textContent = ++QUESTION_COUNT;

            // Display saved question
            displayQuizHandler(QUESTION_COUNT, quiz.questions);

            // Display submit button
            line.style.display      = 'block';
            submitBtn.style.display = 'block';
            quiz_form.appendChild(line);
            quiz_form.appendChild(submitBtn);

            // Scroll the window to the bottom
            scrollDiv.scrollIntoView({behavior: "smooth", block: "center"});
        }
    });

    // Event handler for the cancel button
    cancelBtn.addEventListener('click', (e) => {
        // Hide the complete button
        createBox.remove();
        questionPrompt.style.display = 'block';
        for (let el of document.querySelectorAll('.question-btn')) el.style.display = 'inline-block';

        if (QUESTION_COUNT >= 1) {
            // Display submit button
            line.style.display      = 'block';
            submitBtn.style.display = 'block';
            quiz_form.appendChild(line);
            quiz_form.appendChild(submitBtn);
        }
    });
});


/* CHECK ALL THAT APPLY - Function to create check all question ------------ */
checkAllBtn.addEventListener('click', (e) => {
    e.preventDefault();

    // Create a div to append to
    let createBox = document.createElement('div');
    createBox.id  = 'createBox';
    quiz_form.appendChild(createBox);

    // Hide the question selection buttons, submit, and prompt
    for (let el of document.querySelectorAll('.question-btn')) el.style.display = 'none';
    let questionPrompt           = document.getElementById('question-prompt');
    questionPrompt.style.display = 'none';
    submitBtn.style.display      = 'none';
    line.style.display           = 'none';

    // Increment and display question number
    let questionNum         = document.createElement('p');
    questionNum.className   = 'questionNum';
    questionNum.textContent = `Question #${QUESTION_COUNT + 1} - Check all that Apply`;
    createBox.appendChild(questionNum);

    // Create the question input
    let questionBox         = document.createElement('textarea');
    questionBox.placeholder = 'Enter Question';
    questionBox.id          = 'questionBox';
    questionBox.className   = 'question_input';
    createBox.appendChild(questionBox);

    // Give the user instructions
    let instructions         = document.createElement('p');
    instructions.className   = 'question_instructions';
    instructions.textContent = 'Press + for more answers and - to remove them'
    createBox.appendChild(instructions);

    // Create the Plus and Minus controls to add and remove answers
    let btnContainer = document.createElement('div');
    let addBtn       = document.createElement('button');
    let plusSign     = document.createElement('i');
    let minusBtn     = document.createElement('button');
    let minusSign    = document.createElement('i');

    // Style the Plus and Minus buttons
    addBtn.classList       = 'mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab';
    plusSign.classList     = 'material-icons plusSign';
    plusSign.innerText     = 'add';
    minusBtn.classList     = 'mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab';
    minusSign.classList    = 'material-icons minusSign';
    minusSign.innerText    = '-';
    minusBtn.style.display = 'inline-block';

    // Add the + and - controls to createBox
    createBox.appendChild(btnContainer);
    addBtn.appendChild(plusSign);
    minusBtn.appendChild(minusSign);
    btnContainer.appendChild(addBtn);
    btnContainer.appendChild(minusBtn);

    // Create the initial answer box
    let ANSWER_COUNT = 1;
    let ansContainer = document.createElement('div');
    let ansLine      = document.createElement('div');
    let checkBox     = document.createElement('input');
    let answerBox    = document.createElement('textarea');
    
    // Style the one initial answer box
    ansContainer.id         = 'ansContainer';
    ansLine.id              = 'ansLine_' + ANSWER_COUNT;
    checkBox.type           = 'checkbox';
    checkBox.style.display  = 'inline-block';
    answerBox.placeholder   = `Enter Answer ${ANSWER_COUNT}`;
    answerBox.id            = 'ansBoxCheckAllFirst';
    answerBox.className     = 'ansBoxCheckAll';
    answerBox.type          = 'text';
    answerBox.style.display = 'inline-block';
    
    // Add the box to the DOM
    answerBox.setAttribute('data-lpignore','true');
    createBox.appendChild(ansContainer);
    ansContainer.appendChild(ansLine);
    ansLine.appendChild(checkBox);
    ansLine.appendChild(answerBox);

    // Event handler to add additional answers
    addBtn.addEventListener('click', (e) => {
        e.preventDefault();

        // Only allow a maximum of 8 answers
        if (ANSWER_COUNT < 8) {
            // Increment the answer count
            ANSWER_COUNT++;

            // Create dynamic answer box
            let ansLine      = document.createElement('div');
            let checkBox     = document.createElement('input');
            let answerBox    = document.createElement('textarea');
        
            // Style the dynamically added answer boxes
            ansContainer.id         = 'ansContainer';
            ansLine.id              = 'ansLine_' + ANSWER_COUNT;
            checkBox.type           = 'checkbox';
            checkBox.style.display  = 'inline-block';
            answerBox.placeholder   = `Enter Answer ${ANSWER_COUNT}`;
            answerBox.id            = 'ansBoxCheckAll';
            answerBox.className     = 'ansBoxCheckAll';
            answerBox.type          = 'text';
            answerBox.style.display = 'inline-block';
        
            // Add the dynamic boxes to the DOM
            answerBox.setAttribute('data-lpignore','true');
            ansContainer.appendChild(ansLine);
            ansLine.appendChild(checkBox);
            ansLine.appendChild(answerBox);

            // Scroll the window to the bottom
            scrollDiv.scrollIntoView({behavior: "smooth", block: "center"});
        }
    });

    // Event handler to remove an answer
    minusBtn.addEventListener('click', (e) => {
        e.preventDefault()

        // Only reduce the number of answers to 1
        if (ANSWER_COUNT > 1) {
            let removeLine = document.getElementById('ansLine_' + ANSWER_COUNT);
            removeLine.remove();

            // Decrement the answer count
            ANSWER_COUNT--;
        }
    });

    // Show the question complete button
    let completeBtn         = document.createElement('button');
    completeBtn.className   = 'mdl-button mdl-js-button mdl-button--raised  mdl-button--colored complete-button';
    completeBtn.textContent = 'Complete Question';
    createBox.appendChild(completeBtn);

    // Show the question cancel button
    let cancelBtn         = document.createElement('button');
    cancelBtn.className   = 'mdl-button mdl-js-button mdl-button--raised  mdl-button--colored cancel-button';
    cancelBtn.textContent = 'Cancel Question';
    createBox.appendChild(cancelBtn);

    // Scroll the window to the bottom
    scrollDiv.scrollIntoView({behavior: "smooth", block: "center"});

    // Event handler to register the new question
    completeBtn.addEventListener('click', (e) => {
        // Input validation to require values for question and answer
        questionBox.required = true;

        // Array to hold answer strings and indices of the correct answers
        let answerArray = [];
        let keyArray = [];

        // Variable to hold whether all answer fields are filled
        let answerFieldsEmpty = true;

        // Iterate over the inputs and set them as required and pull the answers strings
        for (let i = 1; i <= ANSWER_COUNT; i++) {
            let requireBox = document.getElementById('ansLine_' + i);
            requireBox.children[1].required = 'true';

            // Check if the answer fields are filled
            if (requireBox.children[1].value !== '') {
                answerFieldsEmpty = false;
            }
            else {
                answerFieldsEmpty = true
            }

            // Pull the answer strings
            answerArray.push(requireBox.children[1].value);

            // Pull the answers that have checkmarks and add the indices to the key array
            if (requireBox.children[0].checked) {
                keyArray.push(i - 1);
            }
        }

        // Check if the required fields are filled
        if (questionBox.value !== '' && answerFieldsEmpty === false) {
            // Create question object
            let obj = {
                quizQuestion: questionBox.value,
                quizAnswers: answerArray,
                quizKey: keyArray,
                quizType: 'check-all'
            }
        
            // Insert the question object into the quiz object
            quiz.questions.push(obj);

            // Remove the question setup from DOM and display the question type buttons
            createBox.remove();
            questionPrompt.style.display = 'block';
            for (let el of document.querySelectorAll('.question-btn')) el.style.display = 'inline-block';

            // Increment question count
            questionCount.textContent = ++QUESTION_COUNT;

            // Display saved question
            displayQuizHandler(QUESTION_COUNT, quiz.questions);

            // Display submit button
            line.style.display      = 'block';
            submitBtn.style.display = 'block';
            quiz_form.appendChild(line);
            quiz_form.appendChild(submitBtn);

            // Scroll the window to the bottom
            scrollDiv.scrollIntoView({behavior: "smooth", block: "center"});
        }
    });

    // Event handler for the cancel button
    cancelBtn.addEventListener('click', (e) => {
        // Hide the complete button
        createBox.remove();
        questionPrompt.style.display = 'block';
        for (let el of document.querySelectorAll('.question-btn')) el.style.display = 'inline-block';

        if (QUESTION_COUNT >= 1) {
            // Display submit button
            line.style.display      = 'block';
            submitBtn.style.display = 'block';
            quiz_form.appendChild(line);
            quiz_form.appendChild(submitBtn);
        }
    });
});


/* QUIZ FORM SUBMISSION - Function to submit the quiz on completion -------- */
quiz_form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Remove navigation prompt on form submission
    window.onbeforeunload = null;

    let req = new XMLHttpRequest();
    let path = '/quiz_soft/quiz_create/save_quiz';

    // String that holds the form data
    let reqBody = {
        name: quiz.title,
        category: quiz.category,
        timeLimit: quiz.limit,
        questions: quiz.questions
    };

    reqBody = JSON.stringify(reqBody);

    // Ajax HTTP POST request
    req.open('POST', path, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', () => {
        if (req.status >= 200 && req.status < 400) {
            window.location.href = '/quiz_soft/quiz_builder';
        } 
        else {
            console.error('Database return error');
        }
    });

    req.send(reqBody);
});
