module.exports = {

    updateMessage: function (input, response) {
        var responseText = null;
        var id = null;
        if (!response.output) {
            response.output = {};
        } else {
            /* if (logs) {
                 // If the logs db is set, then we want to record all input and responses
                 id = uuid.v4();
                 logs.insert({
                     '_id': id,
                     'request': input,
                     'response': response,
                     'time': new Date()
                 });
             }*/
            return response;
        }
        if (response.intents && response.intents[0]) {
            var intent = response.intents[0];
            // Depending on the confidence of the response the app can return different messages.
            // The confidence will vary depending on how well the system is trained. The service will always try to assign
            // a class/intent to the input. If the confidence is low, then it suggests the service is unsure of the
            // user's intent . In these cases it is usually best to return a disambiguation message
            // ('I did not understand your intent, please rephrase your question', etc..)
            if (intent.confidence >= 0.75) {
                responseText = 'I understood your intent was ' + intent.intent;
            } else if (intent.confidence >= 0.5) {
                responseText = 'I think your intent was ' + intent.intent;
            } else {
                responseText = 'I did not understand your intent';
            }
        }
        response.output.text = responseText;
        /* if (logs) {
             // If the logs db is set, then we want to record all input and responses
             id = uuid.v4();
             logs.insert({
                 '_id': id,
                 'request': input,
                 'response': response,
                 'time': new Date()
             });
         }*/
        return response;
    }
}