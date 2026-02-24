export default function sendEmail(target, bcc, subject, text) { 
    try {
        serverLog("Sending mail.. " + "Target: " + target + "Bcc: " + bcc + " Subject: " + subject + " Text: " + text);

        Email.send({
            to: target,
            bcc: bcc,
            from: 'FC Twister Admin <fctwister@nr8.ee>',
            subject: subject,
            text: text
        });
        
        serverLog("Sending mail successful!");
    } catch (err) {
        serverError("Sending mail failed", err);
        throw new Meteor.Error("sending-failed",  "Target: " + target + "Bcc: " + bcc + "Sending mail failed!" + "[Email] Subject: " + subject + "; [Email] Text: " + text);
    }
}