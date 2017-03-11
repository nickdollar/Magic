import moment from "moment";
import {EmailTemplate} from "email-templates";

Meteor.methods({
    sendConfirmationFromNewEvent(email, event){
        this.unblock();
        
        var eventFinal = Object.assign({}, event, {LGS : LGS.find({_id : event.LGS_id}, {limit : 1}).fetch()[0].name.toTitleCase() + " (" + LGS.find({_id : event.LGS_id}, {limit : 1}).fetch()[0].location.city + ")", date : moment(event.date).format("LL")})
        eventFinal.link = "www.crowdmtg.com/adminEvent/" + event.Event_id;
        var emailTemplate = new EmailTemplate("assets/app/welcome-email");

        emailTemplate.render(eventFinal, Meteor.bindEnvironment((err, result)=>{
            if(err){
                console.log(err);
            }

            Email.send({
                to:email,
                from:"no-reply@crowdmtg.com",
                subject: "Information of Event: " +eventFinal.name + "of " + eventFinal,
                html:result.html
            })
        }));
    }
});

