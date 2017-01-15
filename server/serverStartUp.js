Meteor.startup(function(){
    process.env.MAIL_URL="smtp://postmaster%40sandboxfb42c6e155274aa689ff8a3853c878b1.mailgun.org:c306f0fd6dc64f1364db018a1cf4fc66@smtp.mailgun.org:587";
    Accounts.config({
        sendVerificationEmail : true
    })
});