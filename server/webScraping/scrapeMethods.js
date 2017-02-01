Meteor.methods({
    fixLeagueDailyEvent(){
        console.log("START: fixLeagueDailyEvent");

        Events.find({type : {$in : ["daily", "league"]}, state : {$nin : ["decks", "notFoundOld"]}}).forEach((event)=>{

            if(Events.findOne({_id : event._id}).state == "notFound"){
                console.log("notFound");
                notFoundEvent(event._id);
            }

            if(Events.findOne({_id : event._id}).state == "exists" || Events.findOne({_id : event._id}).state == "HTMLFail"){
                console.log("exists");
                eventLeagueDailyDownloadHTML(event._id);
            }

            if(Events.findOne({_id : event._id}).state == "HTML"){
                console.log("HTML");
                eventLeagueDailyExtractDecks(event._id);
            }
        });
        console.log("END: fixLeagueDailyEvent");
    },

    fixMTGOPTQEvent(){
        console.log("START: fixMTGOPTQEvent");

        Events.find({type : "MTGOPTQ", state : {$nin : ["decks", "notFoundOld"]}}).forEach((event)=>{

            if(Events.findOne({_id : event._id}).state == "notFound"){
                notFoundEventMTGOPTQ(event._id);
            }

            if(Events.findOne({_id : event._id}).state == "exists" || Events.findOne({_id : event._id}).state == "HTMLFail"){
                console.log("exists");
                eventExistsMTGOPTQ(event._id);
            }

            if(Events.findOne({_id : event._id}).state == "HTML"){
                console.log("HTML");
                eventHTMLMTGOPTQ(event._id);
            }
        });
        console.log("END: fixMTGOPTQEvent");
    },
    fixGPEvent(){
        console.log("START: fixGPEvent");

        Events.find({type : "GP", state : {$nin : ["decks", "notFoundOld"]}}).forEach((event)=>{

            if(Events.findOne({_id : event._id}).state == "notFound"){
                GPEventNotFound(event._id);
            }

            if(Events.findOne({_id : event._id}).state == "exists" || Events.findOne({_id : event._id}).state == "HTMLMainFail"){
                GPEventsExists(event._id);
            }

            if(Events.findOne({_id : event._id}).state == "HTMLMain" || Events.findOne({_id : event._id}).state == "HTMLFail" || Events.findOne({_id : event._id}).state == "HTMLPartial"){
                GPEventHTMLMain(event._id);
            }

            if(Events.findOne({_id : event._id}).state == "HTML"){
                GPEventHTML(event._id);
            }
        });
        console.log("END: fixGPEvent");
    },
    fixGPEvent(){
        console.log("START: fixGPEvent");

        Events.find({type : "GP", state : {$nin : ["decks", "notFoundOld"]}}).forEach((event)=>{

            if(Events.findOne({_id : event._id}).state == "notFound"){
                GPEventNotFound(event._id);
            }

            if(Events.findOne({_id : event._id}).state == "exists" || Events.findOne({_id : event._id}).state == "HTMLMainFail"){
                GPEventsExists(event._id);
            }

            if(Events.findOne({_id : event._id}).state == "HTMLMain" || Events.findOne({_id : event._id}).state == "HTMLFail" || Events.findOne({_id : event._id}).state == "HTMLPartial"){
                GPEventHTMLMain(event._id);
            }

            if(Events.findOne({_id : event._id}).state == "HTML" || Events.findOne({_id : event._id}).state == "partialDecks" ){
                GPEventHTML(event._id);
            }
        });
        console.log("END: fixGPEvent");
    },
    fixSCGEvent(){
        console.log("START: fixGPEvent");

        Events.find({type : {$regex : /^SCG/}, state : {$nin : ["decks", "notFoundOld"]}}).forEach((event)=>{

            if(Events.findOne({_id : event._id}).state == "notFound"){
                SCGnotFound(event._id);
            }

            if(Events.findOne({_id : event._id}).state == "exists" || Events.findOne({_id : event._id}).state == "HTMLMainFail"){
                SCGEventExists(event._id);
            }

            if(Events.findOne({_id : event._id}).state == "HTML" || Events.findOne({_id : event._id}).state == "partialDecks" ){
                SCGEventHTML(event._id);
            }
        });
        console.log("END: fixGPEvent");
    }
})