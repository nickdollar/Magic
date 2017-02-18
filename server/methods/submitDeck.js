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
                    var quantity = parseInt($res(mainQuery[i]).find(".qty").attr("data-qty"));
                    var name = $res(mainQuery[i]).find(".card a").attr("data-name");
                    main.push({name : name, quantity : quantity});
                }
                var sideboardQuery = $res(".board-container h3:contains(Sideboard)").next().find("li");
                for(var i = 0; i < sideboardQuery.length; i++){
                    var quantity = parseInt($res(sideboardQuery[i]).find(".qty").attr("data-qty"));
                    var name = $res(sideboardQuery[i]).find(".card a").attr("data-name");
                    sideboard.push({name : name, quantity : quantity});
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
                    var quantity = parseInt($res(mainQuery[i]).find(".qty").attr("data-qty"));
                    var name = $res(mainQuery[i]).find(".card a").attr("data-name");
                    main.push({name : name, quantity : quantity});
                }
                var sideboardQuery = $res(".board-container h3:contains(Sideboard)").next().find("li");
                for(var i = 0; i < sideboardQuery.length; i++){
                    var quantity = parseInt($res(sideboardQuery[i]).find(".qty").attr("data-qty"));
                    var name = $res(sideboardQuery[i]).find(".card a").attr("data-name");
                    sideboard.push({name : name, quantity : quantity});
                }
                return {main : main, sideboard : sideboard};
            }

        },
        importFromDeckName : function(deckNames_id){
            var main = DecksData.aggregate(
                [
                    {$match : {
                        DecksNames_id : deckNames_id
                    }},
                    {
                        $project : {
                            main : "$main"
                        }

                    },
                    {
                        "$unwind" : "$main"
                    },
                    {
                        $group : {
                            _id : "$main.name",
                            quantity : {$avg : "$main.quantity"},
                            total : {$sum : 1}
                        }
                    },
                    {
                        $project : {
                            name : "$_id",
                            quantity : "$quantity",
                            total : "$total"
                        }
                    },
                    {
                        $sort: { total : 1}
                    }
                ]
            )

            for(var i = 0; i < main.length; i++){
                main[i].quantity = Math.round(main[i].quantity)
            }

            var sideboard = DecksData.aggregate(
                [
                    {
                        $match : {
                            DecksNames_id : deckNames_id
                        }
                    },
                    {
                        $project: {
                            sideboard: "$sideboard"
                        }
                    },
                    {
                        "$unwind" : "$sideboard"
                    },
                    {
                        $group : {
                            _id : "$sideboard.name",
                            quantity : {$avg : "$sideboard.quantity"},
                            total : {$sum : 1}
                        }
                    },
                    {
                        $project : {
                            name : "$_id",
                            quantity : "$quantity",
                            total : "$total"
                        }
                    },
                    {
                        $sort: { total : 1}
                    }
                ]
            )

            for(var i = 0; i < sideboard.length; i++){
                sideboard[i].quantity = Math.round(sideboard[i].quantity)
            }

            return {main : main, sideboard : sideboard}
        }
})