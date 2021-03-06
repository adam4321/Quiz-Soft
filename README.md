## OSU 467 Capstone Group Project

Software Quiz group project for Oregon State University. It is
intended to replace Survey Monkey as a tool to email quizzes to
job applicants. The team members are Adam Wright, Kevin Hill, 
and Adam Slusser. This repo holds my personal fork of the project
for the purposes of maintainence and bug fixes. The project's
prefork implementation can be found
[here](https://github.com/adam4321/CS-467_Software_Quiz).

It can be run by cloning the project and then setting up the
necessary Google and Facebook Oauth2 credentials in the GCP
and Facebook developer dashboards and a connection to a MongoDb
Atlas database and then adding those credentials in a file 
called credentials.js.

Then just call 'npm install' and call 'node app.js'!

### Signing In

The application can be reached at this
[link](https://adamjwright.com/quiz_soft/login).

Two sign in options exist:
1) Using your Google (Gmail) account
2) Using your Facebook account

Click on the option of your choice and accept the conditions from
your choice of login. Upon return to the site you will be at the 
site's homepage. You will be greeted with a greetings message 
with your name and the email linked to the login method that you
chose.

### Homepage

On the homepage the user can email a quiz link to anyone. First
the user needs to create or upload a quiz and then create a job
posting with it. Then, the user can choose a quiz and enter the
name of the candidate and their email address and press the send
button. The candidate will receive a one time link to take the
quiz that is added for the selected job posting. The employer
will receive an email when the quiz is submitted and the inbox
on the homepage will display the number of unseen quizzes that
have been submitted. The bottom of the homepage contains a button
to delete your account and all of your data, if you choose to.

### Quiz Creation

On the top right portion of the page you will see five buttons
one of which being "QuizBuilder" click on this button. This is 
the start of the quiz building process. You will see three 
categories 
Quiz Name: The name of the quiz

Category: Setting the cateogry the quiz will fall into.
E.g., C++, C#, Javascript, Networking, IT Help Desk etc.

Time Limit (minutes): A set amount of time the quiz recipient 
(job candidate) will have to take the quiz. 

All three fields must be filled out prior to proceeding to build
the quiz. Once all three fields are filled in hit the "START
BUILDING QUIZ" button.

If you created accidentally created a quiz you can click the 
CANCEL BUILD and you will be taken back to the quiz creation
page you just left. NOTE: None of your work will be saved if you
click CANCEL BUILD so be sure you do indeed want to cancel 
building the quiz. 

You will have four types of questions that can be placed on the 
quiz. True/false, multiple choice, fill in the blank and choose
all that apply. Regardless of which type of question you choose
you will be then prompted to enter a question. 

##### True / False

True and False choices will be displayed for you 
under the question you entered. Please choose which answer is
the CORRECT answer. 


##### Multiple Choice

Initially you will have only one answer input available. You 
can add another by clicking the plus symbol (+) or remove an 
answer option by clicking the subtraction symbol(-). You must 
have at least one answer in order to add this question to your 
quiz. Add the desired amount of answers and click the circle 
next to which answer is the correct answer. 

##### Fill in the blank

You will have two parts to your question here the section 
before the blank and the section of the question after the 
blank. An example is given below.

Question before the blank:
Complete the following Oregon 

Question after the blank:
University

What the question will look like
Complete the following Oregon ________ University.

When entering the answer to this question note that if the 
quiz taker's answer does not match the answer that you put in 
exactly it will be graded as incorrect.

##### All That Apply

Initially you will have only one answer input available. You 
can add another by clicking the plus symbol (+) or remove an 
answer option by clicking the subtraction symbol(-). You can 
have as many answers as you like but must have at least one.
Once you have entered all the possible answer choices click
the box(es) to the left of the answers that you wish to mark
as correct.

As you enter the questions they will appear above where you select
that type of question you would like to ask. If you entered a question
by mistake you can delete it by clicking the delete button next to
the question you wish to remove. 

Once you have entered all the questions that will make up the quiz
you can click the SUBMIT QUIZ button in order to save the quiz. 

### MyQuizzes

In this section you will be able to see the quizes that you 
have previously saved. The user can click on a row in the table to
view the quiz as a modal. There is a button available in each row to
delete a quiz or to download a quiz. There is also a button on the
page to upload a quiz which has previously been downloaded. The
quizzes are saved with .quiz as the file extension. This repo
includes a directory of example quizzes which can be used to
test the application. 

### JobPosting

In this section you will be able to create a new job posting
and add an existing quiz to it along with the body text that
will be included in the email sent to the quiz taker. When
there are job postings created it is possible to click on a
row and look at the rankings of all of the quiz responses.
The highest score will rank first and when scores are equal
then the one submitted first will be ranked first. When you
click on a row in a ranking, then it will display the user's
answers with either correct or incorrect and the correct answer
displayed. There is also a button in each ranking to disply
a pie chart of the elapsed times for the submitted quizzes
and a histogram of the scores of all of submission to that
quiz.

## Released under MIT License

Copyright (c) 2020 Kevin Hill, Adam Slusser, Adam Wright.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
