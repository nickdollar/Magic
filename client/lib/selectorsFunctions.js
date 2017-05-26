cardPopover = function(jsClassName, confirmed){

    $(jsClassName).off("popover");
    $(jsClassName).popover({
        html: true,
        trigger: 'hover',
        placement : "auto right",
        content: function () {
            var html = "";
            var element = $(this).get()[0];
            var cardName = encodeURI(element.getAttribute("data-name"));
            if(confirmed){
                var html = "";
                var element = $(this).get()[0];
                var cardName = encodeURI(element.getAttribute("data-name"));
                // var cardName = encodeURI($(this).data("name"));
                cardName = cardName.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "%22;").replace(/'/g, "%27");
                var linkBase = "https://storage.googleapis.com/magiccards/";
                // var key = "?sv=2015-12-11&ss=f&srt=o&sp=r&se=2017-07-01T10:06:43Z&st=2017-01-03T02:06:43Z&spr=https&sig=dKcjc0YGRKdFH441ITFgI5nhWLyrZR6Os8qntzWgMAw%3D";
                var finalDirectory = linkBase+cardName+".original.jpg";
                html += '<span><img src="'+finalDirectory +'" style="height: 310px; width: 223px"/></span>';
                return html;
            }

            var cardQuery = Cards.findOne({_id : $(this).data('name')});
            if(!cardQuery){
                return "";
            }

            if(cardQuery.layout == "split"){
                var cardName = "";
                cardQuery.names.forEach((card)=>{
                    cardName += card.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "%22;").replace(/'/g, "%27");
                })
                var linkBase = "https://storage.googleapis.com/magiccards/";
                // var key = "?sv=2015-12-11&ss=f&srt=o&sp=r&se=2017-07-01T10:06:43Z&st=2017-01-03T02:06:43Z&spr=https&sig=dKcjc0YGRKdFH441ITFgI5nhWLyrZR6Os8qntzWgMAw%3D";
                var finalDirectory = linkBase+cardName+".original.jpg";
                html += '<span><img src="'+finalDirectory +'" style="height: 310px; width: 223px"/></span>';
            }else if(cardQuery.names){
                cardQuery.names.forEach((card)=>{
                    cardName = card.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "%22;").replace(/'/g, "%27");
                    var linkBase = "https://storage.googleapis.com/magiccards/";
                    // var key = "?sv=2015-12-11&ss=f&srt=o&sp=r&se=2017-07-01T10:06:43Z&st=2017-01-03T02:06:43Z&spr=https&sig=dKcjc0YGRKdFH441ITFgI5nhWLyrZR6Os8qntzWgMAw%3D";
                    var finalDirectory = linkBase+cardName+".original.jpg";
                    html += '<span><img src="'+finalDirectory +'" style="height: 310px; width: 223px"/></span>';
                })
            }else{
                cardName = cardName.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "%22;").replace(/'/g, "%27");
                var linkBase = "https://storage.googleapis.com/magiccards/";
                // var key = "?sv=2015-12-11&ss=f&srt=o&sp=r&se=2017-07-01T10:06:43Z&st=2017-01-03T02:06:43Z&spr=https&sig=dKcjc0YGRKdFH441ITFgI5nhWLyrZR6Os8qntzWgMAw%3D";
                var finalDirectory = linkBase+cardName+".original.jpg";
                html += '<img src="'+finalDirectory +'" style="height: 310px; width: 223px"/>';
            }
            return html;

        }
    });
}


cardPopoverNames = function(jsClassName){
    $(jsClassName).off("popover");
    $(jsClassName).popover({
        html: true,
        trigger: 'hover',
        placement : "auto right",
        content: function () {
            var html = "";
            var element = $(this).get()[0];
            var layout = element.getAttribute("data-layout");
            var name = JSON.parse(element.getAttribute("data-names"));
            var names = JSON.parse(element.getAttribute("data-names"));
            var linkBase = "https://storage.googleapis.com/magiccards/";

            var oneCardRegex = new RegExp(/normal/, "i");
            var splitCardRegex = new RegExp(/split/, "i");
            var multiCardRegex = new RegExp(/double-faced|meld/, "i");
            var meldCardRegex = new RegExp(/meld/, "i");

            var cardsNames = [];
            html = "";

            if(layout.match(oneCardRegex)){
                var replacedName = `${names[0]}`.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "%22;").replace(/'/g, "%27");
                var finalDirectory = linkBase+replacedName+".original.jpg";
                html += '<span><img src="'+finalDirectory +'" style="height: 310px; width: 223px"/></span>';
            }else if(layout.match(splitCardRegex)){
                var replacedName = `${names[1]}${names[2]}`.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "%22;").replace(/'/g, "%27");
                var finalDirectory = linkBase+replacedName+".original.jpg";
                html += '<span><img src="'+finalDirectory +'" style="height: 310px; width: 223px"/></span>';
            }else if(layout.match(multiCardRegex)){
                for(var i = 0; i < names.length; i++){
                    var replacedName = names[i].replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "%22;").replace(/'/g, "%27");
                    var finalDirectory = linkBase+replacedName+".original.jpg";
                    html += '<span><img src="'+finalDirectory +'" style="height: 310px; width: 223px"/></span>';
                }
            }else if(layout.match(meldCardRegex)){

            }else{
                var replacedName = names.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "%22;").replace(/'/g, "%27");
                var finalDirectory = linkBase+replacedName+".original.jpg";
                html += '<span><img src="'+finalDirectory +'" style="height: 310px; width: 223px"/></span>';
            }
            return html;
        }
    });
}