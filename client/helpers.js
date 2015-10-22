//Meteor.subscribe('deckCards');
//
//Template.table.helpers({
//
//    deckCards: function () {
//
//    }
//
//});
//
//
//
//
//
//Template.table.events({
//
//
//    //'mouseenter #tableA .a.screenshot' : function(e){
//    //            console.log(this.href);
//    //            this.t = this.title;
//    //            this.title = "";
//    //            var c = (this.t != "") ? "<br/>" + this.t : "";
//    //            $("body").append("<p id='screenshot'><img src='"+ this.rel +"' alt='url preview' />"+ c +"</p>");
//    //            $("#screenshot")
//    //                .css("top",(e.pageY - 10) + "px")
//    //                .css("left",(e.pageX + 30) + "px")
//    //                .fadeIn("fast");
//    //},
//    //
//    //'mouseleave a.screenshot' : function(e){
//    //    this.title = this.t;
//    //    $("#screenshot").remove();
//    //}
//
//});
//
//
//
//
//
//
//Template.table.rendered = function () {
//    var table = "";
//    Meteor.call('getCards',function(err,data){
//        if(err)
//        {
//            console.log('Problem: ' + err.reason);
//        }else
//        {
//            //$("#tableA").append(data);
//           // $("#tableA").append(table);
//        }
//    });
//
//
//
//    console.log("AAAAAA: " + table);
//
//    //$("#tableA").hover(function(e){
//    //        alert("Hellooooooooo");
//    //    },
//    //    function(){
//    //        alert("AAAAAAAAAAAAAAA");
//    //    });
//    //
//    //$(".screenshot").mousemove(function(e){
//    //    alert("BBBBBBBBBBBBBBBB");
//    //});
//
//};
//
//Template.table.created = function(){
//
//};
//
//Template.table.destroyed = function(){
//
//};
//
//Meteor.startup(function(){
//
//
//    //console.log("Hellllllo: " + $('.screenshot').text());
//
//
//    //$('.screenshot').hover(function(e){
//    //        alert("Hellooooooooo");
//    //    },
//    //    function(){
//    //        alert("AAAAAAAAAAAAAAA");
//    //    });
//    //
//    //$(".screenshot").mousemove(function(e){
//    //    alert("BBBBBBBBBBBBBBBB");
//    //});
//});