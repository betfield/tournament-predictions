import sendEmail from '../helpers/sendMail';

Meteor.methods({
    sendEmail: function (target, bcc, subject, text) {
        check([target, subject, text], [String]);
        sendEmail(target, bcc, subject, text);
    }
});
