Template.organizeDecksNames.onCreated(function(){
    var that = this;
    that.deckName = new ReactiveVar;
});

Template.organizeDecksNames.helpers({
    deckName : function(){
        return Template.instance().deckName.get();
    }
});

Template.organizeDecksNames.events({
    "click .js-deckName_id" : function(){
        var row = $(event.target).closest('tr').get(0);
        var dataTable = $(event.target).closest('table').DataTable();
        var rowData = dataTable.row(row).data();
        if (!rowData) return; // Won't be data if a placeholder row is clicked
        Template.instance().deckName.set();
        var that = Template.instance();
        Meteor.setTimeout(function(){
            that.deckName.set(rowData);
        }, 5);
    }
});

Template.decksPercentage.onCreated(function(){
    var that = this;
    this.deckPercentage = new ReactiveVar;
    this.autorun(function(){
        this.deckPercentage = new ReactiveVar;
        var deckName = Template.currentData().deckName;
        Meteor.call("methodGetDeckNamePercentage", deckName, function(error, data){
            if (error) {
                console.log(error);
                return;
            }
            that.deckPercentage.set(data);
        });
    });
});

Template.decksPercentage.helpers({
    decksPercentage : function(){
        return Template.instance().deckPercentage.get();
    },
    isDecksPercentage : function(){
        return !!Template.instance().deckPercentage.get();
    }

});

//decksPercentageTable

Template.decksPercentageTable.onCreated(function(){
    this.selectedDeck_id = new ReactiveVar;
});

Template.decksPercentageTable.helpers({
    selectedDeck_id : function(){
        return Template.instance().selectedDeck_id.get();
    }
});

Template.decksPercentageTable.events({
    "click .js-selectDeck_id" : function(event, template){
        var row = $(event.target).closest('tr').get(0);
        var dataTable = $(event.target).closest('table').DataTable();
        var rowData = dataTable.row(row).data();
        Template.instance().selectedDeck_id.set();
        var thatTemplate = Template.instance();
        Meteor.setTimeout(function(){
            thatTemplate.selectedDeck_id.set(rowData[0]);
        }, 5);
    }
});

Template.decksPercentageTable.onRendered(function(){
console.log(Template.currentData().decksPercentage);

    if (! $.fn.dataTable.isDataTable( '#example' ) ) {
        var data = Template.currentData().decksPercentage;
        $('#example').DataTable({
            data: data,
            columns : [
                {title : "_id", render : function(data, type, row, meta){
                    return "<div class='js-selectDeck_id'>" + data + "</div>";
                }},
                {title : "result", render : function(data, type, row, meta){
                    return prettifyPercentage(data);
                }}
            ]
        });
    }
});

Template.decksPercentageTableCardsPercentage.onCreated(function(){
    var that = this;
    this.deckPercentage = new ReactiveVar;
    that.percentage = new ReactiveVar;
    Meteor.subscribe("deckSelectedID", that.data.selectedDeck_id);
    Meteor.subscribe("DecksNamesReturnFromID", that.data.deckName3._id);

    this.autorun(function(){
        Meteor.call('methodFindDeckComparison', that.data.selectedDeck_id, function(error, result){
            if(error){
                alert(error);
            }else{
                that.percentage.set(result);
            }
        });
    });

});

Template.decksPercentageTableCardsPercentage.helpers({
    cardType : function(){
        var blocks = ["artifact", "creature", "enchantment", "instant", "planeswalker", "sorcery", "land"];
        var types = [];

        for(var i = 0; i< blocks.length; i++){
            var quantity = getQuantity3(blocks[i], false, Template.instance().data.selectedDeck_id);
            if(quantity > 0){types.push({name : capitalizeFirstLetter(blocks[i]), quantity : quantity, block : blocks[i]});}
        }
        return types;
    },
    cards : function(block){
        var cardNames = _CardDatabase.find(typeOptions[block]).map(function(p) { return p.name });
        var deck = DecksData.findOne({_id : Template.instance().data.selectedDeck_id});

        var newArray = deck.main.filter(function(obj1){
            return cardNames.find(function(obj2){
                return obj1.name == obj2;
            });
        });

        return newArray;
    },
    decksPercentageTableCardsPercentageSchema : function(){
        return Schema.decksPercentageTableCardsPercentageAddNameToDeck;
    },
    options : function () {
        var decks = DecksNames.find({}).map(function(obj){
            return {label : obj.deckName, value : obj.deckName};
        });

        return decks;
    },
    cardPercentage : function(){
        var that = this;
        var card = DecksNames.findOne({_id : Template.instance().data.deckName3._id}).main.find(function(obj){
            return that.name == obj.name;
        });

        var quantity = DecksNames.findOne({_id : Template.instance().data.deckName3._id}).decks;


        return card.decksQuantity/quantity;
    },
    percentage : function(){
        return Template.instance().percentage.get();
    }
});

Template.decksPercentageTableCardsPercentage.events({
    "mousemove .js-nameMouseOver" : function(evt, template){
        var mouseX = evt.pageX;
        var mouseY = evt.pageY;

        // console.log(mouseX + " " + mouseY);
        $('#DivToShow').css({'top':mouseY,'left':mouseX}).fadeIn('slow');

    }
});

Blaze.TemplateInstance.prototype.parentTemplate = function (levels) {
    var view = this.view;
    if (typeof levels === "undefined") {
        levels = 1;
    }
    while (view) {
        if (view.name.substring(0, 9) === "Template." && !(levels--)) {
            return view.templateInstance();
        }
        view = view.parentView;
    }
};

Template.decksPercentageTableCardsPercentage.events({
    "click .js-confirmDeck" : function(evt, template){
        Meteor.call('methodAddNameToDeck', {deckName : this.deckName, deck_id : Template.instance().data.selectedDeck_id}, function(err, data){
            var temp = template.parentTemplate(3).deckName.get();
            template.parentTemplate(3).deckName.set();
            Meteor.setTimeout(function(){
                template.parentTemplate(3).deckName.set(temp);
            }, 100);
        });
    }
})


