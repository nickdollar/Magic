Session.set("siteName", null);

//+++++++++++++++++++
//colorBarOriginal        +
//+++++++++++++++++++


Template.colorBarOriginal.helpers({
    siteColor : function(){
        return Session.get('siteColor');
 },
    siteColorBorder : function(){
        return shadeColor(Session.get('siteColor'), -20);
    }
});

Template.colorBarOriginal.events({

});


Template.colorBarOriginal.rendered = function(){
    var moveLeft = 0;
    var moveDown = 0;

    $("#danger").hover ( function () { MenuOpenCloseErgoTimer (
            100,
            function (node) {
                var target = '#pop1';
                $(target).show();
                var buttonMenu = $("#danger");
                var windowPosition = (buttonMenu.offset().top - $(window).scrollTop());
                var position = $(node).position();
                $(target).css('top', windowPosition + 50).css('left', buttonMenu.offset().left);
            },
            this
        ); },
        function () { MenuOpenCloseErgoTimer (
            200,
            function () {
                var target = '#pop1';
                $(target).hide();
            }
        ); }
    );

    $("#pop1").hover ( function () { MenuOpenCloseErgoTimer (
            0,
            function () {
                $("#pop1").show();
            }
        ); },
        function () { MenuOpenCloseErgoTimer (
            200,
            function () {
                $("#pop1").hide();
            }
        ); }
    );
};

function MenuOpenCloseErgoTimer (dDelay, fActionFunction, node) {
    if (typeof this.delayTimer == "number") {
        clearTimeout (this.delayTimer);
        this.delayTimer = '';
    }
    if (node)
        this.delayTimer     = setTimeout (function() { fActionFunction (node); }, dDelay);
    else
        this.delayTimer     = setTimeout (function() { fActionFunction (); }, dDelay);
}

//+++++++++++++++++++++
//logo_BLOCK        +
//+++++++++++++++++++++

Template.logo_COL.helpers({
    siteName : function(){
        return Session.get('siteName');
    }
});

//+++++++++++++++++++++
//headerStatic        +
//+++++++++++++++++++++

//Template.headerStatic.helpers({
//    siteColor : function(){
//        console.log(Session.get('siteColor'));
//        return Session.get('siteColor');
//    },
//    siteColorBorder : function(){
//        return shadeColor(Session.get('siteColor'), -20);
//    }
//});



Template.topMenu.helpers({
    linkColor : function(){
        //console.log("linkColor: " + this.id);
    }
});

Template.topMenu.events({

});

Template.topMenu.rendered = function(){
    var template = this;
    this.findAll("a").forEach( function(element){
        var id = element.id;
        var name = id.substring(0, id.length-4);


        $(element).css("color", Session.get(name));
        $(element).hover(function () {
                //console.log(Session.get(name));
           $(this).css({"border-top-color": Session.get(name),
               "border-top-width":"2px",
               "border-top-style":"solid"})
        },
            function () {
            $(this).css({"border-top-color": "transparent",
                "border-top-width":"2px",
                "border-top-style":"solid"})
            }

        );
    });
};

Template.topMenuStatic.rendered = function(){
    var template = this;
    this.findAll("a").forEach( function(element){
        var id = element.id;
        var name = id.substring(0, id.length-4);


        $(element).css("color", Session.get(name));
        $(element).hover(function () {
                $(this).css({"border-top-color": Session.get(name),
                    "border-top-width":"2px",
                    "border-top-style":"solid"})
            },
            function () {
                $(this).css({"border-top-color": "transparent",
                    "border-top-width":"2px",
                    "border-top-style":"solid"})
            }

        );
    });
    //var menuOffset = $('.top-nav')[0].offsetTop; // replace #menu with the id or class of the target navigation

    $(document).bind('ready scroll', function() {
        var docScroll = $(document).scrollTop();
        if (docScroll >= 155) {
            if (!$('#headerBlock .headerStatic').hasClass('headerStatic-is-active')) {
                $('#headerBlock .headerStatic').addClass('headerStatic-is-active').css({
                    top: '-146px',
                    display: 'block'
                }).stop().animate({
                    top: 0
                }, 250);
            }
        } else if (docScroll < 155){
            if ($('#headerBlock .headerStatic').hasClass('headerStatic-is-active')) {
                $('#headerBlock .headerStatic').stop().animate({
                    top: "-86px"
                }, 250, function(){
                    $(this).removeClass('headerStatic-is-active').removeAttr('style');
                });
            }
        }

    });
};




Template.megaMenu.helpers({

});

Template.megaMenu.events({

});

Template.megaMenu.rendered = function(){

};

Template.testMenu.helpers({
    siteColor : function(){
        return Session.get("siteColor");
    }
});

Template.testMenu.events({

});

Template.testMenu.rendered = function(){
    makeSuperMenu();

};

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