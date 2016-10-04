Template.archetypeDeckName.onCreated(function(){
});


Template.archetypeDeckName.helpers({
    thisarchetype : function(){
        return DecksArchetypes.findOne({});
    },
    name : function(){
        return DecksArchetypes.findOne({}).name;
    },
    colors : function(){
        return getCssColorsFromArchetypes(DecksArchetypes.findOne({})._id);
    },
    format : function(){
        return Router.current().params.format;
    },
    archetype : function(){
        return Router.current().params.archetype;
    }
});

Template.archetypeDeckName.onRendered(function (){
    $('#owl-deckOption').owlCarousel({
        items : 4,
        itemsCustom : false,
        itemsDesktop : false,
        itemsDesktopSmall : false
    });
    owlData = $('#owl-deckOption').data('owlCarousel');
    owlData.itembyid = function(id)
    {
        var p = null;
        for(n=0; n<owlData.itemsAmount && p==null; n++)
        {
            if($(owlData.$owlItems[n].innerHTML).attr('id') == id) p = n;
        }
        return p;
    };

    var that = this;
    DecksNames.find({DecksArchetypes_id : DecksArchetypes.findOne({name : {$regex : Router.current().params.archetype}})._id}).observe({
        added : function(item, olditem) {
                if (owlData) {
                    if (owlData.itembyid(item._id) == null) {
                        var customName = item.name.replace(/[^a-zA-Z0-9-_]/g, "-");
                        var customName = item.name.replace(/[^a-zA-Z0-9-_]/g, "-");
                        var content = "<div class='deckBox'>" +
                            "<a href='/decks/" + Router.current().params.format + "/" + Router.current().params.archetype + "/" + customName + "'>" +
                            "<div class='firstLine'>" +
                            "<div class='deckName'>" +
                            item.name +
                            "</div>" +
                            "<div class='deckMana'>" +
                            getHTMLColors(item.colors) +
                            "</div>" +
                            "<div class='values'>" +
                            5555
                        "</div>" +
                        "</div>" +
                        "</a>" +
                        "</div>";
                        owlData.addItem(content);
                    }
                }
                else {
                    console.log('owlCarousel null');
                }
        },
        removed: function(item) {
                var n = owlData.itembyid(item._id);
                if(n != null)
                {
                    console.log("removed");
                    owlData.removeItem(n);
                }
            }
    });

});