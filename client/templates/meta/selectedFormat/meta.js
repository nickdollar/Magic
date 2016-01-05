SV_metaDaily3_1 = "metaDaily3_1"; Session.set(SV_metaDaily3_1, true);
SV_metaDaily4_0 = "metaDaily4_0"; Session.set(SV_metaDaily4_0, true);
SV_metaPtqTop8 = "metaPtqTop8"; Session.set(SV_metaPtqTop8, true);
SV_metaPtqTop9_16 = "metaPtqTop9_16"; Session.set(SV_metaPtqTop9_16, true);
SV_metaPtqTop17_32 = "SV_metaPtqTop17_32"; Session.set(SV_metaPtqTop17_32, true);
SV_metaCardMetaSideboard = "cardMetaSideboard"; Session.set(SV_metaCardMetaSideboard, false);
SV_metaCardMetaMain = "cardMetaMain"; Session.set(SV_metaCardMetaMain, true);
SV_metaDeckListPagination = "deckList4Pagination"; Session.set(SV_metaDeckListPagination, 0);
SV_metaCardListPagination = "deckCardListPagination"; Session.set(SV_metaCardListPagination, 0);
SV_metaCardLength = "metaCardLength"; SV_metaDecksLength = "metaDeckLength";
SV_metaEventsFormat = "eventsFormat"; Session.set(SV_metaEventsFormat, "modern");
SV_metaEventType = "eventEventType"; Session.set(SV_metaEventType, "daily");
SV_metaCards = "metaCards"; Session.set(SV_metaCards, null);

Template.newMetaTable_COL.helpers({

    metaTest : function(){
        if(Session.get("metaDecks")!=null){
            return  Session.get("metaDecks").list.splice(Session.get(SV_metaDeckListPagination), 20);
        }

    },
    colors : function(name){
        var colors = _DeckNames.findOne({name : name}).colors;
        return colors;
    },
    type : function(name){
        return _DeckNames.findOne({name : name}).type;
    },
    format : function(){
        return Session.get(SV_metaEventsFormat);
    },
    checked : function(){
        return "checked";
    },
    position1 : function(upDown) {
        if(upDown == "neutral") {
            return true;
        }else{
            return false;
        }
    },
    position2 : function(upDown) {
        if (upDown == "up") {
            return true;
        }else{
            return false;
        }
    },
    pagination : function()
    {

    },
    previousDisabled : function(){
        if(Session.get(SV_metaDeckListPagination) == 0){
            return "disabled";
        }else{
            return "";
        }
    },
    nextDisabled : function(){
        if(Session.get(SV_metaDeckListPagination) + 40 > Counts.get('decknamesCounter')){
            return "disabled";
        }else{
            return "";
        }
    }
});

Template.newMetaTable_COL.onCreated(function(){

});

Template.newMetaTable_COL.events({
   'click .updateMeta' : function(evt, tmp){
        Meteor.call('updateMetaMethod');
   },
    'change input[role="checkbox"]' : function(evt, tmp){

        var types = [];
        var checkboxes = tmp.findAll('input[role="checkbox"].metaCheckBox:checked');

        for(var i =0; i < checkboxes.length; i++){
            types.push(checkboxes[i].value);
        }

        var options = {types : types, pagination : Session.get(SV_metaDeckListPagination)};

        Meteor.call('getDeckMeta', options, function (error, data) {
            if (error) {
                console.log(error);
                return;
            }
            Session.set("metaDecks", data);
        });
    },
    'click .deckPagination' : function(evt, tmp){

        console.log($(evt.target).attr("value"));
        if($(evt.target).attr("value") == "prev"){
            if(Session.get(SV_metaDeckListPagination) != 0) {
                Session.set(SV_metaDeckListPagination, Session.get(SV_metaDeckListPagination) - 20);
            }
        }else if($(evt.target).attr("value") == "next"){
            if(Session.get(SV_metaDeckListPagination) + 20 < Session.get("metaDecks").deckQuantity)
            {
                Session.set(SV_metaDeckListPagination, Session.get(SV_metaDeckListPagination) + 20);
            }
        }

        console.log(Session.get(SV_metaDeckListPagination));
    },
    'change .checkBoxParent' : function(evt, tmp){

        if(evt.target.checked){
            Session.set(SV_metaDaily3_1, true);
            Session.set(SV_metaDaily4_0, true);
        }else{
            Session.set(SV_metaDaily3_1, false);
            Session.set(SV_metaDaily4_0, false);

        }

        $(evt.target).closest(".row").find(".checkBoxChild .checkbox1").prop('checked', false);
        Session.set(SV_metaPtqTop8, true);
        Session.set(SV_metaPtqTop9_16, evt.target.checked);
        Session.set(SV_metaPtqTop17_32, evt.target.checked);

    },
    'change :checkbox, input[role="checkbox"]' : function(evt, tmp){

    },
    'click .options' : function(evt,tmp){
        $header = $(evt.target);
        //getting the next element
        $content = $(tmp.find(".content"));
        //open up the content needed - toggle the slide- if visible, slide up, if not slidedown.
        $content.slideToggle(0, function () {
            //execute this after slideToggle is done
            //change text of header based on visibility of content div
            $header.text(function () {
                //change text based on condition
                //return $content.is(":visible") ? "Collapse" : "Expand";
            });
        });
    },
    'mouseenter .bar' : function(evt, tmp){

        var html =  '<div class="changePercentageBlock">' +
            '    <span class="value">' + $(evt.target).attr('data-value') + '%</span>' +
            '    <div>' +
            '    <span class="change '+$(evt.target).attr("data-color") +'">' + $(evt.target).attr("data-change") + '%</span>' +
            '    </div>' +
            '</div>';

        $(html).appendTo('body');
        $(".changePercentageBlock").show();
    },
    'mouseleave .bar' : function(evt,tmp){
        $(".changePercentageBlock").remove();
    },
    'mousemove .bar' : function(evt,tmp){

        $(".changePercentageBlock").css({
            top: evt.pageY + 10 + 'px',
            left: evt.pageX + 10 + 'px'
        });
    }

});




Template.eventsTable_COL.helpers({
    event : function(){
        return _Event.find({format : Session.get(SV_metaEventsFormat), eventType : Session.get(SV_metaEventType)}, {sort : {date : -1}, limit : 5});
    }
});

Template.eventsTable_COL.events({
    "click .eventType" : function(evt, tmp){
        Session.set(SV_metaEventType, "");

        Session.set(SV_metaEventType, evt.target.value);
    }
})

Template.cardTable_COL.events({
    'change input[role="checkbox"]' : function(evt, tmp){


        var types = [];
        var checkboxes = tmp.findAll('input[role="checkbox"].eventTypes:checked');
        for(var i =0; i < checkboxes.length; i++){
            types.push(checkboxes[i].value);
        }

        var mainSideboard = [];
        var checkboxesMainSideboard = tmp.findAll('input[role="checkbox"].mainSideboard:checked');
        for(var i =0; i < checkboxesMainSideboard.length; i++){
            mainSideboard.push(checkboxes[i].value);
        }

        var options = { types : types,
                        mainSideboard : mainSideboard
            //,
            //            pagination : Session.get(SV_metaCardListPagination)
                    };
        Meteor.call('getCardMeta', options, function (error, data) {
            if (error) {
                console.log(error);
                return;
            }

            Session.set("metaCards", data);
        });
    },
    'click .cardPagination' : function(evt, tmp) {
        if($(evt.target).attr("value") == "prev"){
            if(Session.get(SV_metaCardListPagination) != 0){
                Session.set(SV_metaCardListPagination, Session.get(SV_metaCardListPagination) - 10);
            }
        }else if($(evt.target).attr("value") == "next"){
            if(Session.get(SV_metaCardListPagination) + 10 < Session.get(SV_metaCards).pagination) {
                Session.set(SV_metaCardListPagination, Session.get(SV_metaCardListPagination) + 10);
            }
        }
    },
    'click .previous' : function(evt, tmp){

    },
    'click .next' : function(evt, tmp){

    },
    'change .checkbox-inline input' : function(evt, tmp){
        if(evt.target.value == "Main"){
            Session.set(SV_metaCardMetaMain, event.target.checked);
        }

        if(evt.target.value == "Sideboard"){
            Session.set(SV_metaCardMetaSideboard, event.target.checked);
        }
    },
    'click .options' : function(evt,tmp){
        $header = $(evt.target);
        //getting the next element
        $content = $(tmp.find(".content"));
        //open up the content needed - toggle the slide- if visible, slide up, if not slidedown.
        $content.slideToggle(0, function () {
            //execute this after slideToggle is done
            //change text of header based on visibility of content div
            $header.text(function () {
                //change text based on condition
                //return $content.is(":visible") ? "Collapse" : "Expand";
            });
        });
    },
    'click eventType' : function(evt, tmp){

    }
});

Template.cardTable_COL.helpers({
    metaPerWeek : function() {
        if(Session.get(SV_metaCards) != null){
            return Session.get(SV_metaCards).list.splice(Session.get(SV_metaCardListPagination),10);
        }

    },
    previousDisabled : function(){
        if(Session.get(SV_metaCardListPagination) == 0){
            return "disabled";
        }else{
            return "";
        }
    },
    nextDisabled : function(){
        if(Session.get(SV_metaCardListPagination) + 10 > Session.get(SV_metaCardLength)){
            return "disabled";
        }else{
            return "";
        }
    }
});

