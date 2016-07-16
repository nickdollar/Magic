Template.newMetaTable.onCreated(function(){
    var instance = this;
    this.autorun(function(){
        instance.subscribe('metaValues' , Session.get('types'), Session.get('date'));
    });
});

Template.dataTableNewMetaTable.helpers({
    metaTest : function(){
        var values = _MetaValues.find({option : "archetype", type : Session.get("types"), date : Session.get('date')}, {sort : {position : 1}}).fetch();
        return values;
    },
    bars : function(){
        var blocks = [];
        for(var i = this.weekAddChange.length - 5; i < this.weekAddChange.length; i++ ){
            blocks.push({color : this.weekAddChange[i], change : prettifyPercentage(this.weekAddNegPosChange[i], 2),  value : prettifyPercentage(this.weekAddPercentage[i], 2), week : "AAA"});
        }
        return blocks;
    },
    positionChange : function(){
        var upDownEqual = this.positionUpDownEqual[this.positionUpDownEqual.length - 1];
        var positionWeekChange = this.positionWeekChange[this.positionWeekChange.length - 1];
        return {positionWeekChange : positionWeekChange, upDownEqual : upDownEqual};
    },
    colors : function(){
        var colors = _deckArchetypes.findOne({archetype : this.name}).colors;
        return colors;
    },
    minPrice : function(){
        var minPrice = _deckArchetypes.findOne({archetype : this.name}).min;
        return minPrice;
    },
    maxPrice : function(){
        var maxPrice = _deckArchetypes.findOne({archetype : this.name}).max;
        return maxPrice;
    },
    type : function(){
        return _deckArchetypes.findOne({archetype : this.name}).type;
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
    }
});


format = function(archetype) {
    var decksNameQuery = _deckArchetypes.findOne({archetype : archetype}).deckNames.map(function(obj){
        return obj.name;
    });
    var deckQuery = _DeckNames.find({name : {$in : decksNameQuery}}).fetch();
    var decksValuesQuery = _MetaValues.find({option : "deck", name : {$in : decksNameQuery}, date : Session.get('date'), type : Session.get("types")}, {sort : {percentage : -1}}).fetch();
    var html = "";
    decksValuesQuery.forEach(function(decksValuesOueryObj){
        var deck = deckQuery.find(function( deckQueryObj ) {
            return deckQueryObj.name == decksValuesOueryObj.name;
            });
        var deckInfo = _DeckNames.findOne({format : "modern", name : decksValuesOueryObj.name});
        var upDownEqual = decksValuesOueryObj.positionUpDownEqual[decksValuesOueryObj.positionUpDownEqual.length - 1];
        var positionWeekChange = decksValuesOueryObj.positionWeekChange[decksValuesOueryObj.positionWeekChange.length - 1];

        html += '<tr>'+
                '<td></td>'+
                '<td class="tablePosition">' + decksValuesOueryObj.position +'</td>'+
                '<td class="tableName"><span>' + decksValuesOueryObj.name +'</span>'+
                '<div class="positionChange"><span>' + absoluteValue(positionWeekChange) + '</span><span class=' + upDownEqual + '></span></div>' +
                '<td class="tableMana">';

        var manas = getManaCss(deck.colors, "deck");
        manas.forEach(function(mana){
            html += "<span class='mana " + mana.mana + "'></span>";
        });

        html += '</td>'+
                    '<td class="tablePercentage">' + prettifyPercentage(decksValuesOueryObj.percentage) +'%</td>'+
                    '<td class="tablePrice"  colspan="2">$' + deck.price +'</td>' +
                    '<td class="tablePrice">' + deck.type +'</td>';

        var blocks = [];
        for(var i = decksValuesOueryObj.weekAddChange.length - 5; i < decksValuesOueryObj.weekAddChange.length; i++ ){
            blocks.push({color : decksValuesOueryObj.weekAddChange[i], change : prettifyPercentage(decksValuesOueryObj.weekAddNegPosChange[i], 2),  value : prettifyPercentage(decksValuesOueryObj.weekAddPercentage[i], 2), week : "AAA"});
        }
        html += "<td class='blocks'>" +
                "<div class='graph'>";
        blocks.forEach(function(blockObj){
            html += "<div class='bar " + blockObj.color + "' data-change='" + blockObj.change + "' data-value='" + blockObj.value + "' data-week='" + blockObj.week + "' data-color='" + blockObj.color + "'></div>";
        });

        html += '</tr>';
    });
    return html;
}

Template.dataTableNewMetaTable.onRendered(function(){
    var table = $('#example2').DataTable({
        pageLength : 15,
        dom: "t",
        "columns": [
            {
                "orderable": false,
                className : "details-control"
            },
            null,
            null,
            { "orderable": false },
            null,
            null,
            null,
            null,
            { "orderable": false }
        ],
        order : [1, 'asc']
    });

    $('#example2 tbody').on('click', 'td.details-control', function () {
        var archetypeName = $(this).attr("data-name"),
            tr = $(this).closest('tr'),
            row = table.row( tr );
        if ( row.child.isShown() ) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        } else {
            // Open this row
            row.child($(format(archetypeName))).show();
            tr.addClass('shown');
        }
    });

    $(".metaTableOptions .deckPagination[value=prev]").click(function(){
        table.page('previous').draw(false);
    });

    $(".metaTableOptions .deckPagination[value=next]").click(function(){
        table.page('next').draw(false);
    });
    $('#example2').show()
});

Template.dataTableNewMetaTable.events({
    'click .updateMeta' : function(evt, tmp){

    },
    'change input[role="checkbox"]' : function(evt, tmp){

        var types = [];
        var checkboxes = tmp.findAll('input[role="checkbox"].metaCheckBox:checked');

        for(var i =0; i < checkboxes.length; i++){
            types.push(checkboxes[i].value);
        }

        Meteor.call('getDeckMeta', options, function (error, data) {
            if (error) {
                console.log(error);
                return;
            }
            Session.set("metaDecks", data);
        });
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