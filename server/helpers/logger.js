import { Meteor } from 'meteor/meteor';

/*
Usage:

        Logger.log("first log from meteor", ["custom_tag"]);
        Logger.info("it will store this message with info tag");
        Logger.trace({data: myJSONData});
        Logger.error({message: "my fancy object", fancy: true});

*/

const logger = {
    info: (message, tag, userId) => {
        try {
            
            // Add user id to log message if exists
            if (userId) {
                message = "[" + userId + "] " + message;
            }

            console.log("[" + tag + "]: " + message);
            Logger.log(message, tag);
        } catch (err) {
            console.error("Error sending info to Loggly: " + err.message);
            console.error(err.stack);
        }
    },
    error: (message, tag, userId, err) => {
        try {

            // Add user id to log message if exists
            if (userId) {
                message = "[" + userId + "] " + message;
            }

            console.error("[" + tag + "]: " + message);
            console.error(err);

            Logger.error({
                "message": message, 
                "error": err.stack
            });
        } catch (err) {
            console.error("Error sending info to Loggly: " + err.message);
            console.error(err.stack);
        }
    },
}

export { logger }