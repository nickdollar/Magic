Template.playlistBarModal.helpers({
    contactFormSchema: function() {
        return Schema.contact;
    },
    format : function(){
        return Router.current().params.format;
    },
    deckSelected : function(){
        return Router.current().params.deckSelected.replace(/-/g," ");
    }
});


Schema = {};
Schema.contact = new SimpleSchema({
    playlistUrl: {
        type: String,
        regEx: /youtube.com\/(?:watch|playlist)\?(?:v|list)=[a-zA-Z0-9-_]+(?:$|\s|&list=[a-zA-Z0-9-_]+)(?:&index=\d)?/i,
        label: "Playlist Url"
        //errorType : "AAAAAAAAAAAAA"
    },
    format : {
        type: String,
        label: "Playlist Url"
    },
    deckName : {
        type: String,
        label: "Playlist Url"
    }
});



SimpleSchema.messages(
    {
        "regEx": [
            {msg: "Default Message"},
            {exp: /youtube.com\/(?:watch|playlist)\?(?:v|list)=[a-zA-Z0-9-_]+(?:$|\s|&list=[a-zA-Z0-9-_]+)(?:&index=\d)?/i, msg: "wrong url, example: <br>https://www.<strong>youtube.com/watch?v=BdI46-CLS20&list=PL04lbfeNAaS_QMjppTIqTz43M5N3Aw-fD&index=1</strong><br>https://www.<strong>youtube.com/playlist?list=PL04lbfeNAaS_QMjppTIqTz43M5N3Aw-fD</strong>"}
        ],
        "regEx schemaKey": [
            {exp: /youtube.com\/(?:watch|playlist)\?(?:v|list)=[a-zA-Z0-9-_]+(?:$|\s|&list=[a-zA-Z0-9-_]+)(?:&index=\d)?/i, msg: "It's very important that you enter a valid URL here"}
        ]
    }
);

AutoForm.hooks({
    contactForm : function(){
        alert();
    }
});