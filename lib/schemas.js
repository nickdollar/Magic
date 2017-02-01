if (typeof Schemas === 'undefined' || Schemas === null) {
    Schemas = {};
}

Schemas.DecksArchetypes = new SimpleSchema({
    name : {
        type: String
    },
    format : {
        type : String,
        allowedValues : ["standard", "modern", "legacy", "vintage"],
        autoform : {
            type : "select",
            options : function (){
                return [
                    {label: "Standard", value: "standard"},
                    {label: "Modern", value: "modern"},
                    {label: "Legacy", value: "legacy"},
                    {label: "Vintage", value: "vintage"}
                ]
            }
        }

    },
    type : {
        type : String,
        allowedValues : ["aggro", "combo", "control"],
        autoform : {
            type : "select",
            options : function (){
                return [
                    {label: "Combo", value: "combo"},
                    {label: "Control", value: "control"},
                    {label: "Aggro", value: "aggro"}
                ]
            }
        }
    }
});

DecksArchetypes.attachSchema(Schemas.DecksArchetypes);

Schemas.DecksNames = new SimpleSchema({
    name : {
        type: String
    },
    format : {
        type : String,
        allowedValues : ["standard", "modern", "legacy", "vintage"],
        autoform : {
            type : "select",
            options : function (){
                return [
                    {label: "Standard", value: "standard"},
                    {label: "Modern", value: "modern"},
                    {label: "Legacy", value: "legacy"},
                    {label: "Vintage", value: "vintage"}
                ]
            }
        }
    },
    decks : {
        type : Number,
        optional : true
    },
    colors :{
        type : Object,
        optional : true
    },
    "colors.B" : {
        type: Number
    },
    "colors.C" : {
        type: Number
    },
    "colors.G" : {
        type: Number
    },
    "colors.R" : {
        type: Number
    },
    "colors.U" : {
        type: Number
    },
    "colors.W" : {
        type: Number
    },
    main : {
        type : Array,
        optional : true
    },
    "main.$" : {
        type : Object
    },
    "main.$.name" : {
        type : String
    },
    "main.$.decksQuantity" : {
        type : Number
    },
    "main.$.total" : {
        type : Number
    },
    DecksData : {
        optional : true,
        type : Array
    },
    "DecksData.$" : {
        optional : true,
        type : Object
    },
    "DecksData.$._id" : {
        type : String
    },
    DecksArchetypes_id : {
        type: String,
        label : "DecksArchetypes_id",
        autoform: {
            type: "select",
            options: function () {
                var decksNames = DecksArchetypes.find({format : AutoForm.getFieldValue('format')}).map(function(DecksNamesObj){
                    return {label : DecksNamesObj.name, value : DecksNamesObj._id}
                });
                decksNames.sort(function(a, b){
                    if(a.label < b.label) return -1;
                    if(a.label > b.label) return 1;
                    return 0;
                });
                return decksNames;
            }
        }
    }
});

Schemas.DecksData = new SimpleSchema({
    _id : {
        type: String,
        optional : true
    },
    Events_id : {
        type: String,
        optional : true
    },
    player : {
        type : String,
        optional : true
    },
    date : {
        type : Date,
        optional : true
    },
    type : {
        type : String,
        allowedValues : ["league", "daily", "sealed", "draft"],
        optional : true,
        autoform : {
            type : "select",
            options : function (){
                return [
                    {label: "league", value: "league"},
                    {label: "daily", value: "daily"},
                    {label: "sealed", value: "sealed"},
                    {label: "draft", value: "draft"}
                ]
            }
        }
    },
    format : {
        type : String,
        optional : true,
        allowedValues : ["standard", "modern", "legacy", "vintage"],
        autoform : {
            type : "select",
            options : function (){
                return [
                    {label: "Standard", value: "standard"},
                    {label: "Modern", value: "modern"},
                    {label: "Legacy", value: "legacy"},
                    {label: "Vintage", value: "vintage"}
                ]
            }
        }
    },
    victory : {
        type : Number,
        optional : true
    },
    loss : {
        type : Number,
        optional : true
    },
    draw : {
        type : Number,
        optional : true
    },
    totalMain : {
        type : Number,
        optional : true
    },
    main : {
        type : Array,
        optional : true
    },
    "main.$" : {
        type : Object,
        optional : true
    },
    "main.$.name" : {
        type : String,
        optional : true
    },
    "main.$.quantity" : {
        type : Number,
        optional : true
    },
    totalSideboard : {
        type : Number,
        optional : true
    },
    sideboard : {
        type : Array,
        optional : true
    },
    "sideboard.$" : {
        type : Object,
        optional : true
    },
    "sideboard.$.name" : {
        type : String,
        optional : true
    },
    "sideboard.$.quantity" : {
        type : Number,
        optional : true
    },
    colors :{
        type : Object,
        optional : true
    },
    "colors.B" : {
        type: Number
    },
    "colors.C" : {
        type: Number
    },
    "colors.G" : {
        type: Number
    },
    "colors.R" : {
        type: Number
    },
    "colors.U" : {
        type: Number
    },
    "colors.W" : {
        type: Number
    },
    "colors.B/G" : {
        type: Number
    },
    "colors.B/R" : {
        type: Number
    },
    "colors.R/W" : {
        type: Number
    },
    "colors.G/U" : {
        type: Number
    },
    "colors.G/W" : {
        type: Number
    },
    "colors.R/G" : {
        type: Number
    },
    "colors.U/B" : {
        type: Number
    },
    "colors.U/R" : {
        type: Number
    },
    "colors.W/B" : {
        type: Number
    },
    "colors.W/U" : {
        type: Number
    },
    "colors.B/P" : {
        type: Number
    },
    "colors.G/P" : {
        type: Number
    },

    "colors.R/P" : {
        type: Number
    },
    "colors.U/P" : {
        type: Number
    },
    "colors.W/P" : {
        type: Number
    },
    "DecksNames_id" : {
        type: String,
        optional : true,
        label : "DecksNames_id",
        autoform: {
            type: "select",
            options: function () {
                console.log(AutoForm.getFieldValue('format'));
                console.log(AutoForm.getFormId());
                var decks = DecksNames.find({format : AutoForm.getFieldValue('format', AutoForm.getFormId())}).map(function(obj){
                    return {label : obj.name, value : obj._id};
                });
                decks.sort(function(a, b){
                    if(a.label < b.label) return -1;
                    if(a.label > b.label) return 1;
                    return 0;
                });
                return decks;
            }
        }
    }
});

Schemas.Events = new SimpleSchema({
    type : {
        type: String,
        allowedValues : ["league", "daily", "sealed", "draft"],
    },
    date : {
        type : Date
    },
    format : {
        type : String,
        allowedValues : ["standard", "modern", "legacy", "vintage"],
        autoform : {
            type : "select",
            options : function (){
                return [
                    {label: "Standard", value: "standard"},
                    {label: "Modern", value: "modern"},
                    {label: "Legacy", value: "legacy"},
                    {label: "Vintage", value: "vintage"}
                ]
            }
        }
    },
    name : {
        type : String
    },
    type : {
        type : String,
        allowedValues : ["league", "daily", "sealed", "draft"], 
        optional : true
    },
    url : {
        type : String
    },
    validation : {
        type : Object,
        optional : true
    },
    "validation.exists" : {
        type : Boolean
    },
    "validation.htmlDownloaded" : {
        type : Boolean
    },
    "validation.extractDecks" : {
        type : Boolean
    },
    "validation.allDecksHasNames" : {
        type : Boolean
    },
    decks : {
        type : Number,
        optional : true
    }
});

Schemas.DecksNamesPlaylist = new SimpleSchema({

    DecksNames_id : {
        type : String
    },
    cfsImages_id : {
        type : String
    },
    format : {
        type : String
    },
    date : {
        type : Date
    },
    title : {
        type : String
    },
    channel : {
        type : String
    },
    link : {
        type : String
    },
    playlistId : {
        type : String
    },
    videosQuantity : {
        type : Number
    },
    badCount : {
        optional : true,
        type: Number
    },
    bad : {
        optional : true,
        type : Array
    },
    "bad.$" : {
        type : Object
    },
    "bad.$._id" : {
        type : String
    },
    wrongCount : {
        optional : true,
        type: Number
    },
    wrong : {
        optional : true,
        type : Array
    },
    "wrong.$" : {
        type : Object
    },
    "wrong.$._id" : {
        type : String
    }
});


Schemas.CardsData = new SimpleSchema({
    name : {
        type : String
    },
    type : {
        type : String
    },
    artifact : {
        type : Boolean
    },
    creature : {
        type : Boolean
    },
    enchantment : {
        type : Boolean
    },
    instant : {
        type : Boolean
    },
    land : {
        type : Boolean
    },
    planeswalker : {
        type : Boolean
    },
    sorcery : {
        type : Boolean
    },
    tribal : {
        type : Boolean
    },
    cmc : {
        type : Number
    },
    manacost : {
        type : String
    },
    toughness : {
        type : Number
    },
    power : {
        type : Number
    }
});

Schemas.EventsCalendar = new SimpleSchema({
    title : {
        type: String,
    },
    eventSourceUrl : {
        type: String,
        regEx : SimpleSchema.RegEx.Url,
        label : "Event Source Url:"
    },
    twitchChannelName: {
        type: String,
        optional : true,
        custom : function(){
            var streamedFieldSelected = this.field('streamed').value;
            if(streamedFieldSelected){
                if(!this.isSet){
                    return "required";
                }
            }
        },
        regEx : /(^http(s)?:\/\/)?((www|en-es|en-gb|secure|beta|ro|www-origin|en-ca|fr-ca|lt|zh-tw|he|id|ca|mk|lv|ma|tl|hi|ar|bg|vi|th)\.)?twitch.tv\/(?!directory|p|user\/legal|admin|login|signup|jobs)(\w+)/,
        label : "Twitch Channel URL:",
    },
    formats : {
        type : [String],
        allowedValues: ["standard", "modern", "legacy", "vintage"],
        autoform : {
            type : "select-checkbox-inline",
            options : function (){
                return [
                    {label: "Standard", value: "standard"},
                    {label: "Modern", value: "modern"},
                    {label: "Legacy", value: "legacy"},
                    {label: "Vintage", value: "vintage"},
                ]
            }
        }
    },
    start : {
        type : Date,
        autoform: {
            type: "bootstrap-datetimepicker"
        }
    },
    end : {
        optional : true,
        type : Date,

        autoform: {
            type: "bootstrap-datetimepicker"
        }
    },
    location : {
        type : Object,
    },
    "location.streetNumber" : {
        type : String,
        optional : true
    },
    "location.street" : {
        type : String,
        optional : true
    },
    "location.city" : {
        type : String
    },
    "location.state" : {
        type : String
    },
    "location.country" : {
        type : String
    },
    "location.postalCode" : {
        type : String,
        optional : true
    },
    "location.coords" : {
        type : Object
    },
    "location.coords.lat" : {
        type : Number,
        decimal: true
    },
    "location.coords.lng" : {
        type : Number,
        decimal: true
    },
    dow : {
        optional : true,
        type : [Number],
        label : "Days",
        allowedValues: [0,1,2,3,4,5,6],
        autoform : {
            type : "select-checkbox-inline",
            options : function (){
                return [
                    {label: "Sun",  value: 0},
                    {label: "Mon",  value: 1},
                    {label: "Tues", value: 2},
                    {label: "Wed",  value: 3},
                    {label: "Thur", value: 4},
                    {label: "Fri",  value: 5},
                    {label: "Sat",  value: 6},

                ]
            }
        }
    },
    description: {
        type : String,
        label : "Description (Optional)",
        optional : true,
        autoform: {
            afFieldInput:{
                type : "summernote",
                settings : {
                    height: 180
                }
            }
        }
    }
});


Schemas.CardsData = new SimpleSchema({
    options : {
        type : Array
    },
    "options.$": {
        type : String
    },
    timeSpan : {
        type : String
    },
    format : {
        type : String
    },
    totalDecks : {
        type : Number
    },
    main : {
        type : Array
    },
    "main.$" : {
        type : Object
    },
    "main.$._id" : {
        type : String
    },
    "main.$.total" : {
        type : Number
    },
    "main.$.count" : {
        type : Number
    },
    sideboard : {
        type : Array
    },
    "sideboard.$" : {
        type : Object
    },
    "sideboard.$._id" : {
        type : String
    },
    "sideboard.$.total" : {
        type : Number
    },
    "sideboard.$.count" : {
        type : Number
    },
    mainSideboard : {
        type : Array
    },
    "mainSideboard.$" : {
        type : Object
    },
    "mainSideboard.$._id" : {
        type : String
    },
    "mainSideboard.$.total" : {
        type : Number
    },
    "mainSideboard.$.count" : {
        type : Number
    }
});

Schemas.DecksDataUniqueWithoutQuantity = new SimpleSchema({

    _id : {
        type : String
    },
    format : {
        type : String,
        allowedValues : ["standard", "modern", "legacy", "vintage", "vintage44"],
        autoform : {
            type : "select",
            options : function (){
                return [
                    {label: "Standard", value: "standard"},
                    {label: "Modern", value: "modern"},
                    {label: "Legacy", value: "legacy"},
                    {label: "Vintage", value: "vintage"},
                    {label: "Vintage44", value: "vintage44"}

                ]
            }
        }
    },
    "DecksNames_id" : {
        type: String,
        optional : true,
        label : "DecksNames_id",
        autoform: {
            type: "select",
            options: function () {
                var decks = DecksNames.find({format : AutoForm.getFieldValue('format')}).map(function(obj){
                    return {label : obj.name, value : obj._id};
                });
                decks.sort(function(a, b){
                    if(a.label < b.label) return -1;
                    if(a.label > b.label) return 1;
                    return 0;
                });
                return decks;
            }
        }
    },
    nonLandMain : {
        type : Array
    },
    "nonLandMain.$" : {
        type : String
    },


});

Schemas.CardsData = new SimpleSchema({
    options : {
        type : Array
    },
    "options.$": {
        type : String
    },
    timeSpan : {
        type : String
    },
    format : {
        type : String
    },
    totalDecks : {
        type : Number
    },
    totalDecksBlocks : {
        type : Array
    },
    "totalDecksBlocks.$" : {
        type : Object
    },
    "totalDecksBlocks.$._id" : {
        type : String
    },
    "totalDecksBlocks.$.total" : {
        type : Number
    },
    "totalDecksBlocks.$.count" : {
        type : Number
    },




    DecksNamesMeta : {
        type : Array
    },
    "DecksNamesMeta.$" : {
        type : Object
    },
    "DecksNamesMeta.$._id" : {
        type : String
    },
    "DecksNamesMeta.$.quantity" : {
        type : Number
    },
    "DecksNamesMeta.$.blocks" : {
        type : Array
    },
    "DecksNamesMeta.$.blocks.$" : {
        type : Number
    },
    "DecksNamesMeta.$.position" : {
        type : Object
    },
    "DecksNamesMeta.$.position.week" : {
        type : Object
    },
    "DecksNamesMeta.$.position.TwoWeeks" : {
        type : Object
    },
    "DecksNamesMeta.$.position.month" : {
        type : Object
    },

    DecksArchetypesMeta : {
        type : Array
    },
    "DecksArchetypesMeta.$" : {
        type : Object
    },
    "DecksArchetypesMeta.$._id" : {
        type : String
    },
    "DecksArchetypesMeta.$.quantity" : {
        type : Number
    },
    "DecksArchetypesMeta.$.blocks" : {
        type : Array
    },
    "DecksArchetypesMeta.$.blocks.$" : {
        type : Number
    },
    "DecksArchetypesMeta.$.position" : {
        type : Object
    },
    "DecksArchetypesMeta.$.position.week" : {
        type : Object
    },
    "DecksArchetypesMeta.$.position.TwoWeeks" : {
        type : Object
    },
    "DecksArchetypesMeta.$.position.month" : {
        type : Object
    },
});

EventsCalendar.attachSchema(Schemas.EventsCalendar);
DecksNamesPlaylists.attachSchema(Schemas.DecksNamesPlaylist);
// MetaCards.attachSchema(Schemas.DecksNamesPlaylist);
// AdminDashboard.addSidebarItem('Analytics', {
//     icon: 'line-chart',
//     urls: [
//         { title: 'Statistics', url: AdminDashboard.path('/analytics/statistics') },
//         { title: 'Settings', url: AdminDashboard.path('/analytics/settings') }
//     ]
// });
//

