/******************************************************************************
**  Description:  Define Handlebars helpers for the application
******************************************************************************/

module.exports = {
    'eq': function() {
        const args = Array.prototype.slice.call(arguments, 0, -1);
        return args.every(function (expression) {
            return args[0] === args[1]});
    },
    'eq_str_num': function(arg1, arg2) {
        if (arg1 == arg2) {
            return true;
        } 
        else {
            return false;
        }
    },
    'eq_str_num_all_cases': function(arg1, arg2) {
        if (arg1.toLowerCase() == arg2.toLowerCase()) {
            return true;
        } 
        else {
            return false;
        }
    },
    'eq_arr': function(a, b) {
        return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
    },
    'inc': function() {
        const args = Array.prototype.slice.call(arguments, 0, -1);
        let index = args[0];
            return index + 1;
    },
    'dec': function(length) {
        return length - 1;
    },
    'round': function(num) {
        return Math.round(parseFloat(num));
    },
    'capitalize': function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },      
    'quiz_name_expose': function() {
        const args = Array.prototype.slice.call(arguments, 0, -1);
        let obj = args[0];
        return obj.name;
    },
    'quiz_id_expose': function() {
        const args = Array.prototype.slice.call(arguments, 0, -1);
        let obj = args[0];
        return obj._id;
    },
    'quiz_question_expose': function() {
        const args = Array.prototype.slice.call(arguments, 0, -1);
        let obj = args[0];
        let index = args[1];
        return obj.quizQuestion[index];
    },
    'quiz_answer_expose': function() {
        const args = Array.prototype.slice.call(arguments, 0, -1);
        let obj = args[0].quizAnswers;
        return obj;
    },
    'quiz_type_expose': function() {
        const args = Array.prototype.slice.call(arguments, 0, -1);
        return args.every(function (expression) {
            return args[0].quizType === args[1]; });
    },
    'job_title_expose': function() {
        const args = Array.prototype.slice.call(arguments, 0, -1);
        let obj = args[0].title;
        return obj;
    },
    'job_message_expose': function() {
        const args = Array.prototype.slice.call(arguments, 0, -1);
        let obj = args[0].messageText;
        return obj;
    },
    'job_id_expose': function() {
        const args = Array.prototype.slice.call(arguments, 0, -1);
        let obj = args[0]._id;
        return obj;
    },
    'job_quiz_expose': function() {
        const args = Array.prototype.slice.call(arguments, 0, -1);
        let quiz_idx = 0;
        if (args[1] !== undefined){
            quiz_idx = args[1];
        }
        let obj = args[0].associatedQuiz[quiz_idx].quiz._id;
        return obj;
    },
    'each_jobposting': function(job_obj, options) {
        let ary = job_obj;
        let data = { };
        if (ary.length == 0)
            return options.inverse(this);
        var result = [];
        for (var i = 0; i < ary.length; ++i){
            if (data) {
                data.j_index = i;
            }
            result.push(options.fn(ary[i], { data: data }));
        }
        return result.join('');
    },
    'each_question': function(quiz_obj, max, options) {
        let ary = quiz_obj;
        let data = { };
        if ((ary.length < max) || ary.length == 0)
            return options.inverse(this);
        var result = [];
        for (var i = 0; i < max; ++i){
            if (data) {
                data.q_index = i;
            }
            result.push(options.fn(ary[i], { data: data }));
        }
        return result.join('');
    },
    'each_answer': function(quiz_obj, options) {
        var extend = function() {
            // Variables
            var extended = {};
            var deep = false;
            var i = 0;
            var length = arguments.length;
        
            // Check if a deep merge
            if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
                deep = arguments[0];
                i++;
            }
        
            // Merge the object into the extended object
            var merge = function (obj) {
                for ( var prop in obj ) {
                    if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
                        // If deep merge and property is an object, merge properties
                        if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
                            extended[prop] = extend( true, extended[prop], obj[prop] );
                        } else {
                            extended[prop] = obj[prop];
                        }
                    }
                }
            };
        
            // Loop through each object and conduct a merge
            for ( ; i < length; i++ ) {
                var obj = arguments[i];
                merge(obj);
            }
        
            return extended;
        };

        let ary = quiz_obj.quizAnswers;
        if(ary.length == 0)
            return options.inverse(this);
        var result = [];
        for(var i = 0; i < ary.length; ++i){
            result.push(options.fn(extend(ary[i], {a_index: i})));
        }
        return result.join('');
    }
}
