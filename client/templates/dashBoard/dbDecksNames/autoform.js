Schema.decksPercentageTableCardsPercentageAddNameToDeck = new SimpleSchema({
    deckName: {
        type: String,
        autoform: {
            type: "selectize",
            label : "Deck Name",
            selectizeOptions: {
                create: true
            }
        }
    },
    DecksData_id : {
        type : String
    },
    format : {
        type : String
    }
});


var decksPercentageTableCardsPercentageAddNameToDeckHooks = {
    before : {
        method : function(doc){
            return doc;
        }
    },
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
        console.log("onSubmit");
    },
    onSuccess: function(formType, result) {
        var thatTemplate = this.template.parentTemplate(4);
        var temp = thatTemplate.deckName.get();
        thatTemplate.deckName.set();
        Meteor.setTimeout(function(){
            thatTemplate.deckName.set(temp);
        }, 100);

        // Template.instance().parentTemplate(3).deckName.get();

        console.log("onSucess");
    },
    onError: function(formType, error) {
        console.log(error);
        console.log("onError");

    },
    beginSubmit: function() {
    }
}

AutoForm.hooks({
    decksPercentageTableCardsPercentageAddNameToDeck : decksPercentageTableCardsPercentageAddNameToDeckHooks
});