Template.narrowSearch.onRendered(function(){
    $( "#slider-range" ).slider({
        range: true,
        min: 0,
        max: 2000,
        values: [ 0, 2000 ],
        slide: function( event, ui ) {
            $("#minAmount").text(ui.values[ 0 ]);
            $("#maxAmount").text(ui.values[ 1 ]);
            updateListFunction();
        }
    });

    $("#minAmount").text($( "#slider-range" ).slider( "values", 0 ));
    $("#maxAmount").text($( "#slider-range" ).slider( "values", 1 ));
});

Template.narrowSearch.events({
    'change input, .ui-slider-range': function (evt, tmp) {
        updateListFunction();
    }
});

updateListFunction = function()
{
    var types = [];
    var typesName = ["aggro", "combo", "control"];
    var colors = {G : false, B : false, R : false, W : false, U : false};
    var boxType = "";


    if($("input:checked:radio[name=decksArchetypes]").val() == "archetypes"){
        boxType = ".archetypeBox";
    }else{
        boxType = ".deckBox";
    }

    for(var i = 0; i < typesName.length; i++){
        if($("input:checked[role=checkbox][value=" + typesName[i] + "]").exists()){
            types.push("[data-type="+ typesName[i] + "]");
        }
    }


    for(var key in colors){
        if($("input:checked[role=checkbox][value="+key+"]").exists()){
            colors[key] = true;
        }
    }

    $(".deckBox, .archetypeBox").hide();

    if($("input:checked:radio[name=optionsRadio]").val() == "contain"){

        var colorsText = [];
        var search = "";

        for(var key in colors){
            if(colors[key] == true){
                colorsText.push("[data-colors*="+ key +"]");
            }
        }

        for(var i = 0; i < colorsText.length; i++){
            for(var j = 0; j < types.length; j++){
                search += boxType + colorsText[i]+types[j] + ", ";
            }
        }

        search = search.replace(/, $/, "");

        if(search == ""){
            search += boxType + "[data-colors='']";
        }


        search += ", " +boxType + "[data-colors='']";
        $(search).show();
    }

    if($("input:checked[type=radio]").val() == "only"){

        var colorsOnly = ""

        for(var key in colors){
            if(colors[key] == true){
                colorsOnly += key;
            }
        }

        colorsOnly = boxType + "[data-colors='" +colorsOnly+"']"

        var search = "";
        for(var i = 0; i < types.length ; i++){
            search += colorsOnly+types[i] + ", ";
        }
        search = search.replace(/, $/, "");
        $(search).show();
    }


    var boxes = $(boxType + "[style*='display: block']");
    var min = parseInt($("#minAmount").text());
    var max = parseInt($("#maxAmount").text());
    var result = "";


    if($("input:checked:radio[name=decksArchetypes]").val() == "archetypes"){
        for(var i = 0; i < boxes.length; i++){
            var minValue = parseInt(boxes[i].dataset.min);
            var maxValue = parseInt(boxes[i].dataset.max);
            if(!(min > minValue && min > maxValue) && (max < maxValue && max < minValue)){
                result += boxType + "[data-min=" + minValue + "][data-max=" + maxValue + "], ";
            }
        }
    }else{
        for(var i = 0; i < boxes.length; i++){
            var value = parseInt(boxes[i].dataset.price);
            if(min > value || max < value){
                result += boxType + "[data-price=" +value+"], ";
            }
        }
    }

    result = result.replace(/, $/, "");
    $(result).hide();
};