import cheerio from "cheerio";

Meteor.methods({
        getDeckFromURL : function(url){
            var tappedoutPatt = /(tappedout).net\/mtg-decks\/(.*?)(?:\/|$|\n|\r)/i;
            if(tappedoutPatt.test(url)){
                var match = url.match(tappedoutPatt);
                url = "http://tappedout.net/mtg-decks/" + match[2] + "?cat=name&sort=";
                var res = Meteor.http.get(url);
                var $res = cheerio.load(res.content);
                var mainQuery = $res(".board-container h3:contains(Mainboard)").next().find("li");
                // console.log(main.html());
                var main = [];
                var sideboard = [];
                for(var i = 0; i < mainQuery.length; i++){
                    var qty = parseInt($res(mainQuery[i]).find(".qty").attr("data-qty"));
                    var name = $res(mainQuery[i]).find(".card a").attr("data-name");
                    main.push({name : name, qty : qty});
                }
                var sideboardQuery = $res(".board-container h3:contains(Sideboard)").next().find("li");
                for(var i = 0; i < sideboardQuery.length; i++){
                    var qty = parseInt($res(sideboardQuery[i]).find(".qty").attr("data-qty"));
                    var name = $res(sideboardQuery[i]).find(".card a").attr("data-name");
                    sideboard.push({name : name, qty : qty});
                }
                return {main : main, sideboard : sideboard};
            }
        },
        getDeckFromURL : function(url){
            var tappedoutPatt = /(tappedout).net\/mtg-decks\/(.*?)(?:\/|$|\n|\r)/i;
            if(tappedoutPatt.test(url)){
                var match = url.match(tappedoutPatt);
                url = "http://tappedout.net/mtg-decks/" + match[2] + "?cat=name&sort=";
                var res = Meteor.http.get(url);
                var $res = cheerio.load(res.content);
                var mainQuery = $res(".board-container h3:contains(Mainboard)").next().find("li");
                // console.log(main.html());
                var main = [];
                var sideboard = [];
                for(var i = 0; i < mainQuery.length; i++){
                    var qty = parseInt($res(mainQuery[i]).find(".qty").attr("data-qty"));
                    var name = $res(mainQuery[i]).find(".card a").attr("data-name");
                    main.push({name : name, qty : qty});
                }
                var sideboardQuery = $res(".board-container h3:contains(Sideboard)").next().find("li");
                for(var i = 0; i < sideboardQuery.length; i++){
                    var qty = parseInt($res(sideboardQuery[i]).find(".qty").attr("data-qty"));
                    var name = $res(sideboardQuery[i]).find(".card a").attr("data-name");
                    sideboard.push({name : name, qty : qty});
                }
                return {main : main, sideboard : sideboard};
            }

        },

})