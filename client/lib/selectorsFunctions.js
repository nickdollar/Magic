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
                var linkBase = "https://mtgcards.file.core.windows.net/cards/";
                var key = "?sv=2015-12-11&ss=f&srt=o&sp=r&se=2017-07-01T10:06:43Z&st=2017-01-03T02:06:43Z&spr=https&sig=dKcjc0YGRKdFH441ITFgI5nhWLyrZR6Os8qntzWgMAw%3D";
                var finalDirectory = linkBase+cardName+".full.jpg" + key;
                html += '<span><img src="'+finalDirectory +'" style="height: 310px; width: 223px"/></span>';
                return html;
            }

            var cardQuery = CardsData.findOne({name : $(this).data('name')});
            if(!cardQuery){
                return "";
            }

            if(cardQuery.layout == "split"){
                var cardName = "";
                cardQuery.names.forEach((card)=>{
                    cardName += card.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "%22;").replace(/'/g, "%27");
                })
                var linkBase = "https://mtgcards.file.core.windows.net/cards/";
                var key = "?sv=2015-12-11&ss=f&srt=o&sp=r&se=2017-07-01T10:06:43Z&st=2017-01-03T02:06:43Z&spr=https&sig=dKcjc0YGRKdFH441ITFgI5nhWLyrZR6Os8qntzWgMAw%3D";
                var finalDirectory = linkBase+cardName+".full.jpg" + key;
                html += '<span><img src="'+finalDirectory +'" style="height: 310px; width: 223px"/></span>';
            }else if(cardQuery.names){
                cardQuery.names.forEach((card)=>{
                    cardName = card.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "%22;").replace(/'/g, "%27");
                    var linkBase = "https://mtgcards.file.core.windows.net/cards/";
                    var key = "?sv=2015-12-11&ss=f&srt=o&sp=r&se=2017-07-01T10:06:43Z&st=2017-01-03T02:06:43Z&spr=https&sig=dKcjc0YGRKdFH441ITFgI5nhWLyrZR6Os8qntzWgMAw%3D";
                    var finalDirectory = linkBase+cardName+".full.jpg" + key;
                    html += '<span><img src="'+finalDirectory +'" style="height: 310px; width: 223px"/></span>';
                })
            }else{
                cardName = cardName.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "%22;").replace(/'/g, "%27");
                var linkBase = "https://mtgcards.file.core.windows.net/cards/";
                var key = "?sv=2015-12-11&ss=f&srt=o&sp=r&se=2017-07-01T10:06:43Z&st=2017-01-03T02:06:43Z&spr=https&sig=dKcjc0YGRKdFH441ITFgI5nhWLyrZR6Os8qntzWgMAw%3D";
                var finalDirectory = linkBase+cardName+".full.jpg" + key;
                html += '<img src="'+finalDirectory +'" style="height: 310px; width: 223px"/>';
            }
            return html;

        }
    });
}