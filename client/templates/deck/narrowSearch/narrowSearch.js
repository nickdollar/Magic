Template.narrowSearch.onRendered(function(){
    $( "#slider-range" ).slider({
        range: true,
        min: 0,
        max: 2000,
        values: [ 0, 2000 ],
        slide: function( event, ui ) {
            $("#minAmount").text(ui.values[ 0 ]);
            $("#maxAmount").text(ui.values[ 1 ]);
            tablePriceSearch();
        }
    });

    $("#minAmount").text($( "#slider-range" ).slider( "values", 0 ));
    $("#maxAmount").text($( "#slider-range" ).slider( "values", 1 ));
});

Template.narrowSearch.events({
    'change #colorsOption input': function (evt, tmp) {
        tableColorsSearch();
    },
    'change #typeOptions input': function (evt, tmp) {
        tableTypeSearch();
    },
    'change #deckOrArchetype input': function (evt, tmp) {
        if($(evt.target).val() == "decks"){
            Session.set("deckOrArchetype", true);
        }else{
            Session.set("deckOrArchetype", false);
        }
    }
});

tableColorsSearch = function(){
    if(!Session.get("deckOrArchetype")){
        console.log("archetypeListTable");
        var table = $('#archetypeListTable').DataTable();
    }else{
        console.log("deckListTable");
        var table = $('#deckListTable').DataTable();
    }
//COLORS
    var colorsOptions = {G : false, B : false, R : false, W : false, U : false};
    var colorsRegex = "";
    var quantity = 0;

    if($("input:checked:radio[name=optionsRadio]").val() == "contain") {
        var colorsRegex = "(";
        var colorsArray = [];
        for(var key in colorsOptions){
            if($("input:checked[role=checkbox][value="+key+"]").exists()){
                quantity++;
                colorsArray.push(key);
            }
        }
        colorsRegex += colorsArray.join("|");
        colorsRegex += ")";
    }else{
        for(var key in colorsOptions){
            if($("input:checked[role=checkbox][value="+key+"]").exists()){
                quantity++;
                colorsRegex += "(?=.*" + key + ")";
            }
        }
        colorsRegex += "(?=\\b\\w{"+ quantity +"}\\b)" + colorsRegex;
    }

    if(quantity==0){
        colorsRegex = "^$";
    }

    console.log(colorsRegex);

    table
        .column(2)
        .search(colorsRegex, true)
        .draw();
};

tableTypeSearch = function(){

    if(!Session.get("deckOrArchetype")){
        var table = $('#archetypeListTable').DataTable();
    }else{

        var table = $('#deckListTable').DataTable();
    }

    var typesOptions = ["aggro", "combo", "control"];
    var typeSelectedOptions = [];
    for(var i = 0; i < typesOptions.length; i++){
        if($("input:checked[role=checkbox][value=" + typesOptions[i] + "]").exists()) {
            typeSelectedOptions.push(typesOptions[i]);
        }
    }

    var typeOptionsRegex = typeSelectedOptions.join("|");
    if(typeOptionsRegex==""){
        typeOptionsRegex = "^$";
    }

    console.log(typeOptionsRegex);

    table.columns(3)
        .search(typeOptionsRegex, true)
        .draw();
}

tablePriceSearch = function(){

    if(!Session.get("deckOrArchetype")){
        var table = $('#archetypeListTable').DataTable();
    }else{

        var table = $('#deckListTable').DataTable();
    }

    var min = parseInt($("#minAmount").text());
    var max = parseInt($("#maxAmount").text());

    if(!Session.get("deckOrArchetype")){
        var minValues = table
            .column(4)
            .data()
            .filter(function(value, index){
                return parseInt(value) > min;
            }).join("|");

        var maxValues = table
            .column(5)
            .data()
            .filter(function(value, index){
                return parseInt(value) < max;
            }).join("|");
    }else{
        var price = "("
        price += table
            .column(4)
            .data()
            .filter(function(value, index){
                return parseInt(value) > min && parseInt(value) < max;
            }).join("|");
        price += ")"
    }

    console.log(price);
    console.log(minValues);

    var regex = true;
    if(minValues=="" || maxValues=="" || price == "()"){
        regex = false;
    }
    if(!Session.get("deckOrArchetype")){
        table.columns(4)
            .search(minValues, regex)
            .draw();

        table.columns(5)
            .search(maxValues, regex)
            .draw();
    }else{
        table.columns(4)
            .search(price, regex)
            .draw();
    }
};