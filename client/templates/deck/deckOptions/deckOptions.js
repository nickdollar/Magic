Template.deckOptions.helpers({
    decksOptions : function(){
        return _deckArchetypes.findOne({ archetype : Router.current().params.archetype.replace(/-/g," ")});
    },
    decksNames : function(){
        var names = this.deckNames.map(function(a){return a.name});
        return _DeckNames.find({format : "modern", name : {$in : names}});
    },
    format : function(){
        return Router.current().params.format;
    },
    archetype : function(){
        return Router.current().params.archetype;
    }
});

Template.deckOptions.events({
    //"click .deckOptions" : function(evt, tmp){
    //    //Router.go('deckSelected', {format : Router.current().params.format.replace(/ /g,"-"), archetype: Router.current().params.archetype.replace(/ /g,"-"), deckSelected : $(evt.target).html().replace(/ /g,"-")});
    //}
});

Template.deckOptions.onRendered(function (){
    var owlDeckOptions = $("#owl-deckOption");
    owlDeckOptions.owlCarousel({
        items : 4,
        itemsCustom : false,
        itemsDesktop : false,
        itemsDesktopSmall : false
    })
});

