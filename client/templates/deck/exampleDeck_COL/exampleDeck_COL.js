Template.exampleDeck_COL.onCreated(function(){
    this.selectedDecksData = new ReactiveVar();
    this.checks = new ReactiveDict();
    this.deckSelectedParamRegex = new ReactiveVar();
    this.checks.set("deckName", true);
    this.checks.set("test2", false);
    this.checks.set("waitForFirstPass", true);



    this.autorun(()=>{
        this.deckSelectedParamRegex.set(new RegExp("^" + replaceDashWithDotForRegex(FlowRouter.getParam("deckSelected")) + "$", "i"));
    })

    this.autorun(()=>{
        if(this.checks.get("waitForFirstPass")){
            this.checks.set("deckdata", false);
            this.subscribe("deckSelectedAndCardsData", this.selectedDecksData.get(), DecksNames.findOne({format : FlowRouter.getParam("format"), name : {$regex : this.deckSelectedParamRegex.get()}})._id, {
                onReady : ()=>{
                    Meteor.setTimeout(()=>{
                        this.checks.set("deckdata", true);
                    }, 200)
                }
            });
        }
    });
});


Template.exampleDeck_COL.helpers({
    decksNames(){
        return DecksNames.findOne({format : FlowRouter.getParam("format"), name : {$regex : Template.instance().deckSelectedParamRegex.get()}});
    },
    deck() {
        if(Template.instance().checks.get("deckdata")){
            return DecksData.findOne({main : {$exists: true}});
        }
        return false;

    },
    cardType(){
        var blocks = ["artifact", "creature", "enchantment", "instant", "planeswalker", "sorcery", "land"];
        var types = [];

        for(var i = 0; i< blocks.length; i++){
            var quantity = getQuantity3(blocks[i], false, DecksData.findOne({main : {$exists: true}})._id);
            if(quantity > 0){types.push({name : capitalizeFirstLetter(blocks[i]), quantity : quantity, block : blocks[i]});}
        }
        return types;
    },
    cards(block){
        var cardNames = CardsData.find(typeOptions[block]).map(function(p) { return p.name });
        var deck = DecksData.findOne({_id : DecksData.findOne({main : {$exists: true}})._id});

        var newArray = deck.main.filter(function(obj1){
            return cardNames.find(function(obj2){
                return obj1.name == obj2;
            });
        });
        newArray.sort(function(a,b){
            return b.quantity - a.quantity;

        })
        return newArray;
    },
    sideboard(){
        return DecksData.findOne({main : {$exists : true}}).sideboard.sort(function(a,b){
            return  b.quantity - a.quantity;
        });
    },
    mainQuantity(){
        return getQuantity3(null, false, DecksData.findOne({main : {$exists : true}})._id);
    },
    sideboardQuantity : function(){
        return getQuantity3(null, true, DecksData.findOne({main : {$exists : true}})._id);
    },
    test(){
        Template.instance().checks.set("test2", true);
    },
    test2(){
        return Template.instance().checks.get("test2");
    },
    test3(){
        $('.js-imagePopOver').popover({
            html: true,
            placement : "auto right",
            trigger: 'hover',
            content: function () {
                var cardName = encodeURI($(this).data('name'));
                cardName = cardName.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "%22;").replace(/'/g, "%27");
                var linkBase = "https://mtgcards.file.core.windows.net/cards/";
                var key = "?sv=2015-12-11&ss=f&srt=o&sp=r&se=2017-07-01T10:06:43Z&st=2017-01-03T02:06:43Z&spr=https&sig=dKcjc0YGRKdFH441ITFgI5nhWLyrZR6Os8qntzWgMAw%3D";

                var finalDirectory = linkBase+cardName+".full.jpg" + key;
                return '<img src="'+finalDirectory +'" style="height: 310px; width: 223px"/>';
            }
        });
        Template.instance().checks.set("test2", false);
    },
    smallSelector(){
        return {format: FlowRouter.getParam("format"), type : {$in : ["league", "daily"]}, DecksNames_id : DecksNames.findOne({format : FlowRouter.getParam("format"), name : {$regex : Template.instance().deckSelectedParamRegex.get()}})._id};
    },
    largeSelector(){
        return {format: FlowRouter.getParam("format"), type : {$in : ["GP"]}, DecksNames_id : DecksNames.findOne({format : FlowRouter.getParam("format"), name : {$regex : Template.instance().deckSelectedParamRegex.get()}})._id};
    }
});

Template.exampleDeck_COL.events({
    'click .js-deckSelected' : function(event, template){
        var row = $(event.target).closest('tr').get(0);
        var dataTable = $(event.target).closest('table').DataTable();
        var rowData = dataTable.row(row).data();
        template.checks.set("waitForFirstPass", false);
        template.selectedDecksData.set();
        Meteor.setTimeout(function(){
                template.checks.set("deckName", true);
                template.selectedDecksData.set(rowData._id);
                template.checks.set("waitForFirstPass", true);
        }, 100)
    }
});

Template.exampleDeck_COL.onRendered(function(){
    var values = this;
    $(".clickable-row").click(function() {
        window.document.location = $(this).data("href");
    });

});
