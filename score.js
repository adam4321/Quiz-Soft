/******************************************************************************
**  Description:  Function to calculate a quiz score
******************************************************************************/

function calculate_score(quiz_obj, response_arr) {
    return new Promise(function(resolve,reject) {
        // Build key array
        var key_length = Object.keys(quiz_obj.questions).length;
        var key_arr = []; 

        for (let i = 0; i < key_length; i++) {
            key_arr[i] = quiz_obj.questions[i].quizKey;
        }
        var score = 100.0;
        var simple_dec = (100.0 / key_length);

        // Match the values of each respective question and determine the score
        for (let j = 0; j < key_length; j++) {
            let type = quiz_obj.questions[j].quizType;

            if (response_arr[j] != undefined) {
                if (type === 'true-false') {
                    if (key_arr[j][0] != response_arr[j]) {
                        score = score - simple_dec;
                    }
                }
                else if (type === 'mult-choice') {
                    if (key_arr[j][0] != response_arr[j]) {
                        score = score - simple_dec;
                    }
                }
                else if (type === 'fill-blank') {
                    if (key_arr[j][0].toLowerCase() != response_arr[j].toLowerCase()) {
                        score = score - simple_dec;
                    }
                }
                else if (type === 'check-all') {
                    let check_answers = 0;

                    for (let y = 0; y < key_arr[j].length; y++) {
                        for (let z = 0; z < response_arr[j].length; z++) {
                            if (key_arr[j][y] == response_arr[j][z]) {
                                check_answers += 1;
                            }
                        }
                    }
                    if ((check_answers != key_arr[j].length) || (response_arr[j].length != key_arr[j].length)) {
                        score = score - simple_dec;
                    }
                }
            }
            else {
                score = score - simple_dec;
            }
        }

        resolve(score);
    });
}

module.exports = { calculate_score };
