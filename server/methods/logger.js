Meteor.methods({
    clientLog: function (message, userId) {
        Log.info(message, 'info-client', userId);
    },
    clientError: function (message, userId, err) {
        Log.error(message, 'error-client', userId, err);
    },
    // Adding a separate method for unhandled exceptions from clients since
    // for some reason the err object is not passed on to clientError call
    clientErrorUnhandled: function (message, userId, err) {
        console.error('[client-unhandled-exception]: [' + userId + '] ' + message);
        console.error(err)
    }
});

serverLog = (message) => {
    Log.info(message, 'info');
}

serverError = (message, err) => {
    Log.error(message, 'error', null, err);
}