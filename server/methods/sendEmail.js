import moment from "moment";
import {EmailTemplate} from "email-templates";

Meteor.methods({
    sendConfirmationFromNewEvent(email, event){
        console.log(email);
        this.unblock();
        
        var eventFinal = Object.assign({}, event, {LGS : LGS.findOne({_id : event.LGS_id}).name.toTitleCase() + " (" + LGS.findOne({_id : event.LGS_id}).location.city + ")", date : moment(event.date).format("LL")})
        eventFinal.link = "www.crowdmtg.com/adminEvent/" + event.Event_id;
        var emailTemplate = new EmailTemplate("C:\\Magic\\private\\welcome-email");

        
        
        emailTemplate.render(eventFinal, Meteor.bindEnvironment((err, result)=>{
            if(err){
                console.log(err);
            }

            Email.send({
                to:email,
                from:"no-replay@crowdmtg.com",
                subject: "Information of Event: " +eventFinal.name + "of " + eventFinal,
                html:result.html
            })
        }));
    }
});

