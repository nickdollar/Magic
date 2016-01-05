Session.set("siteName", null);

function MenuOpenCloseErgoTimer(dDelay, fActionFunction, node){
    if (typeof this.delayTimer == "number") {
        clearTimeout (this.delayTimer);
        this.delayTimer = '';
    }
    if (node)
        this.delayTimer     = setTimeout (function() { fActionFunction (node); }, dDelay);
    else
        this.delayTimer     = setTimeout (function() { fActionFunction (); }, dDelay);
}


Template.topMenu.helpers({
    linkColor : function(){
        //console.log("linkColor: " + this.id);
    }
});

Template.topMenu.events({

});





var makeSuperMenu = function(){
//++++++++++++++++++++++++++
//Menu First Level         +
//++++++++++++++++++++++++++

    var $menuOne = $(".one");

    $menuOne.menuAim({
        activate: activateSubmenuOne,
        deactivate: deactivateSubmenuOne,
        exitMenu : exitMenuOne,
        enter : enterOne,
        exit : exitOne
    });

    function activateSubmenuOne(row) {
        var $row = $(row);
        if($(row).hasClass("parent") && $(row).hasClass("level0") )
        {
            var $next_menu = $row.find("ul:first-child");
            $(".is-active").stop().removeClass("is-active");
            $row.addClass("is-active");
            $(".superMenu").stop().animate(
                {width: 400}, 200);
        }
        $row.addClass("is-hovered");
    }

    function deactivateSubmenuOne(row) {
        var $row = $(row);
        setTimeout(function() {
                $row.stop().removeClass("is-active");
            },
            200
        );
        $(".superMenu").stop().animate(
            {width: 200}, 200);
        $row.removeClass("is-active");
    }

    function exitMenuOne(menu){
        setTimeout(function() {
                $row.stop().removeClass("is-active");
            },
            200
        );
    }

    function enterOne(row){
        var $row = $(row);
        $row.addClass("is-hovered");
    }



    function exitOne(row){
        var $row = $(row);
        $row.removeClass("is-hovered");
    }

//++++++++++++++++++++++++++
//Menu Second Level        +
//++++++++++++++++++++++++++

    var $menuTwo = $(".two");

    $menuTwo.menuAim({
        activate: activateSubmenuTwo,
        deactivate: deactivateSubmenuTwo,
        exitMenu : exitMenuTwo,
        enter : enterTwo,
        exit : exitTwo
    });

    function activateSubmenuTwo(row) {
        var $row = $(row);
        if($(row).hasClass("parent"))
        {
            $(".superMenu").stop().animate(
                {width: 600}, 200);
        }
        $row.addClass("is-active");
    }

    function deactivateSubmenuTwo(row) {
        var $row = $(row);
        setTimeout(function() {
                $row.stop().removeClass("is-active");
            },
            200
        );
        $(".superMenu").stop().animate(
            {width: 400}, 200);
    }

    function exitMenuTwo(menu){
        return true;
    }

    function enterTwo(row){
        var $row = $(row);
        $row.addClass("is-hovered");
    }

    function exitTwo(row){
        var $row = $(row);
        $row.removeClass("is-hovered");
    }


//++++++++++++++++++++++++++
//Menu third Level         +
//++++++++++++++++++++++++++
    var $menuThree = $(".three");

    $menuThree.menuAim({
        activate: activateSubmenuThree,
        deactivate: deactivateSubmenuThree,
        exitMenu : exitMenuThree,
        enter : enterThree,
        exit : exitThree
    });

    function activateSubmenuThree(row) {
        $row.addClass("is-active");
    }

    function deactivateSubmenuThree(row) {
        $row.remove("is-active");
    }

    function exitMenuThree(menu){
        return true;
    }

    function enterThree(row){
        var $row = $(row);
        $row.addClass("is-hovered");
    }

    function exitThree(row){
        var $row = $(row);
        $row.removeClass("is-hovered");
    }
}