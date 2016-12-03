Template.archetypeDeckName.onCreated(function(){
    this.archetypeParamRegex = new ReactiveVar(new RegExp("^" + replaceDashWithDotForRegex(FlowRouter.getParam("archetype")) + "$", "i"));
});

Template.archetypeDeckName.helpers({
    thisarchetype : function(){
        return DecksArchetypes.findOne({format : FlowRouter.getParam("format"), name : {$regex : Template.instance().archetypeParamRegex.get()}});
    },
    name : function(){
        return DecksArchetypes.findOne({format : FlowRouter.getParam("format"), name : {$regex : Template.instance().archetypeParamRegex.get()}}).name;
    },
    colors : function(){
        return getCssColorsFromArchetypes(DecksArchetypes.findOne({format : FlowRouter.getParam("format"), name : {$regex : Template.instance().archetypeParamRegex.get()}})._id);
    },
    format : function(){
        return FlowRouter.getParam("format");
    }
});

Template.archetypeDeckName.onRendered(function (){
    $('#owl-deckOption').owlCarousel({
        items : 3,
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



    DecksNames.find({DecksArchetypes_id : DecksArchetypes.findOne({format : FlowRouter.getParam("format"), name : {$regex : this.archetypeParamRegex.get()}})._id}).observe({
        added : (item, olditem)=> {
                if (owlData) {
                    if (owlData.itembyid(item._id) == null) {
                        var customName = item.name.replace(/[^a-zA-Z0-9-_]/g, "-");
                        var customName = item.name.replace(/[^a-zA-Z0-9-_]/g, "-");
                        var content = '<div class="deckBox">' +
                                        '<a href="/decks/' + FlowRouter.getParam("format") + '/' + replaceTokenWithDash(DecksArchetypes.findOne({_id : item.DecksArchetypes_id}).name) + '/' + customName + '">' +
                                            '<div class="firstLine">' +
                                                '<div class="deckName">' +
                                                    item.name +
                                                '</div>' +
                                            '</div>' +
                                            '<div class="secondLine">' +
                                                '<div class="deckMana">' +
                                                    getHTMLColors(item.colors) +
                                                '</div>'
                                            '</div>' +
                                        '</a>' +
                                    '</div>';
                        owlData.addItem(content);
                    }
                }
                else {
                    
                }
        },
        removed: (item)=> {
                var n = owlData.itembyid(item._id);
                if(n != null)
                {
                    owlData.removeItem(n);
                }
            }
    });
});