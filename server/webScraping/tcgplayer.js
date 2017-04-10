import cheerio from "cheerio";

importCollection = (URL)=>{
    logFunctionsStart("importCollection");
    var URL = "http://store.tcgplayer.com/collection/view/142729"
    var resMainPage = Meteor.http.get(URL);
    if (resMainPage.statusCode == 200) {
        var $collectionPage = cheerio.load(resMainPage.content, {decodeEntities: false});
        var collectionTable = $collectionPage("#collectionContainer");

        if(collectionTable.length){

            var headers = $collectionPage(collectionTable).find("thead th");
            var rows = $collectionPage(collectionTable).find("tbody tr");
            var nameRegex = /(\b.+\b) *(?= - \[Foil\]|$|\(\b\w+\b\))(\(\b\w+\b\))?( - \[Foil\])?/i;

            var columnPosition = {};
            for(var i = 0; i < headers.length; i++){
                columnPosition[$collectionPage(headers[i]).html()] = i +1;
            }
            for(var i = 0; i < rows.length; i++){
                var game = $collectionPage(rows[i]).find(`td:nth-child(${columnPosition.Game})`).html();
                if(game != "Magic"){
                    continue;
                }
                var qty = parseInt($collectionPage(rows[i]).find(`td:nth-child(${columnPosition.Have})`).html());
                if(isNaN(qty)){
                    qty = 0;
                }
                var name = $collectionPage(rows[i]).find(`td:nth-child(${columnPosition.Name}) a`).html();

                var match = name.match(nameRegex);

                var nameMatched = match[1];
                var foil;

                if(match[3]){
                    foil = true;
                }else{
                    foil = false;
                }
                var setName = replaceEdition($collectionPage(rows[i]).find(`td:nth-child(${columnPosition.Set})`).html());
                if(setName == "Unique and Miscellaneous Promos"){
                    var setCode = "PROMOS"
                }else{
                    var setCode = MTGSets.findOne({name : {$regex : `^${setName}`, $options : "i"}}).code;
                }

                if(!setCode){
                    setCode = "wrongCode";
                }
                addCardToCollection({ qty : qty, name : nameMatched, foil : foil, setCode : setCode});
            }
        }
    }
    logFunctionsEnd("importCollection");
}

Meteor.methods({
    getDeckSetsFromGoogleCacheMethod(){
        getDeckSetsFromGoogleCache();
    },
    getCardsOfTheSetCacheMethod(){
        logFunctionsStart("getCardsOfTheSetcacheMethod");
            var sets = TCGPlayerCards.find({state : {$ne : "cards"}}).map(set => set.name);
            for(var i = 0; i < sets.length; ++i){
                webScrapingQueue.add({func : getCardsOfTheSetCache, args : {setName : sets[i]}, wait : 60000 + 15000*Math.random()});
            }
        logFunctionsEnd("getCardsOfTheSetcacheMethod");
    },
    convertCSVToJson(){
        logFunctionsStart("convertCSVToJson");
            var myobject = JSON.parse(Assets.getText('convertcsv.json'));
            for(var i = 1; i < myobject.length; ++i){
                var set = fixTCGPlayersSetNames(myobject[i]["FIELD1"]);
                var card = {};

                var name = myobject[i]["FIELD5"];
                var rarity = myobject[i]["FIELD6"];
                var number = parseInt(myobject[i]["FIELD7"]);


                card.name = name ? name : "##MISSING##";
                card.rarity = rarity ? rarity : "##MISSING##"
                isNaN(number) ? null : card.number = number;

                TCGPlayerCards.update({name : set},
                    {
                        $setOnInsert : {name : set, cards : []}
                    },
                    {
                        upsert : true
                    }
                )
                TCGPlayerCards.update({name : set, "cards.name" : {$ne : name}},
                    {
                        $push : {cards : card}
                    }
                )
            }
        logFunctionsEnd("convertCSVToJson");
    }
})


fixTCGPlayersSetNames = (setName)=>{
    setName = setName.replace(/^pds:/i, "Premium Deck Series:")
    setName = setName.replace(/^Phyrexia vs. The Coalition/i, "Duel Decks: Phyrexia vs. the Coalition");
    setName = setName.replace(/^Speed vs. Cunning/i, "Duel Decks: Speed vs. Cunning");
    setName = setName.replace(/^Ajani vs. Nicol Bolas/i, "Duel Decks: Ajani vs. Nicol Bolas");
    setName = setName.replace(/^Divine vs. Demonic/i, "Duel Decks: Divine vs. Demonic");
    setName = setName.replace(/^Elspeth vs. Tezzeret/i, "Duel Decks: Elspeth vs. Tezzeret");
    setName = setName.replace(/^Elves vs. Goblins/i, "Duel Decks: Elves vs. Goblins");
    setName = setName.replace(/^Garruk vs. Liliana/i, "Duel Decks: Garruk vs. Liliana");
    setName = setName.replace(/^Heroes vs. Monsters/i, "Duel Decks: Heroes vs. Monsters");
    setName = setName.replace(/^Izzet vs. Golgari/i, "Duel Decks: Izzet vs. Golgari");
    setName = setName.replace(/^Jace vs. Chandra/i, "Duel Decks: Jace vs. Chandra");
    setName = setName.replace(/^Jace vs. Vraska/i, "Duel Decks: Jace vs. Vraska");
    setName = setName.replace(/^Knights vs. Dragons/i, "Duel Decks: Knights vs. Dragons");
    setName = setName.replace(/^Phyrexia vs. The Coalition/i, "Duel Decks: Phyrexia vs. the Coalition");
    setName = setName.replace(/^Sorin vs. Tibalt/i, "Duel Decks: Sorin vs. Tibalt");
    setName = setName.replace(/^Venser vs. Koth/i, "Duel Decks: Venser vs. Koth");
    setName = setName.replace(/^Launch Party & Release Event Cards/i, "Launch Party & Release Event Promos");
    setName = setName.replace(/^Modern Event Deck/i, "Magic Modern Event Deck");
    setName = setName.replace(/^Kaladesh Inventions/i, "Masterpiece Series: Kaladesh Inventions");
    setName = setName.replace(/^Tenth Edition/i, "10th Edition");
    setName = setName.replace(/^Ninth Edition/i, "9th Edition");
    setName = setName.replace(/^Eighth Edition/i, "8th Edition");
    setName = setName.replace(/^Seventh Edition/i, "7th Edition");
    setName = setName.replace(/^Sixth Edition/i, "Classic Sixth Edition");
    // setName = setName.replace(/^Kaladesh Inventions/i, "Masterpiece Series: Kaladesh Inventions");
    // setName = setName.replace(/^Kaladesh Inventions/i, "Masterpiece Series: Kaladesh Inventions");
    setName = setName.replace(/\s{2,}/g, ' ');
    return setName;
}


getCardsOfTheSetCache = ({setName})=>{
    logFunctionsStart("getCardsOfTheSetCache");
    var fixedSetName = setName.replace(/\s/g, "-").replace(/'/g, "").replace(/:/g, "").replace(/./g, "").toLowerCase();
    var URL = `http://webcache.googleusercontent.com/search?q=cache:http://shop.tcgplayer.com/price-guide/magic/${fixedSetName}`
    try{
        var resMainPage = Meteor.http.get(URL);
        if (resMainPage.statusCode == 200) {
            var $cardsPage = cheerio.load(resMainPage.content, {decodeEntities: false});

            if(!$cardsPage.length){
                return;
            }
            var rows = $cardsPage("tbody tr");

            if(rows.length){
                for(var i = 0; i < rows.length; i++){
                    var name = htmlUnescape($cardsPage(rows[i]).find(".productDetail a").text());
                    var rarity = htmlUnescape($cardsPage(rows[i]).find(".rarity div").text()).trim();
                    var number = parseInt(htmlUnescape($cardsPage(rows[i]).find(".number div").text()).trim());

                    TCGPlayerCards.update({name : setName, cards : {$exists : false}},
                        {
                            $set : {cards : []}
                        }
                    )

                    TCGPlayerCards.update({name : setName},
                        {
                            $push : {cards : {name : name, rarity : rarity, number : number}}
                        }
                    )
                }

                TCGPlayerCards.update({name : setName},
                    {
                        $set : {state : "cards"}
                    }
                )
            }else{
                TCGPlayerCards.update({name : setName},
                    {
                        $set : {state : "empty"}
                    }
                )
            }



        }
    }catch (e){
        TCGPlayerCards.update({name : setName},
            {
                $set : {state : "badLink"}
            }
        )
    }
    logFunctionsEnd("getCardsOfTheSetCache");
}

htmlUnescape = (str)=>{
    return str
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
}


getDeckSetsFromGoogleCache = ()=>{
    logFunctionsStart("getDeckSetsFromGoogleCache");
        var URL = `http://webcache.googleusercontent.com/search?q=cache:http://shop.tcgplayer.com/magic/`;
        var resMainPage = Meteor.http.get(URL);

        if (resMainPage.statusCode == 200) {
            var $setsPage = cheerio.load(resMainPage.content, {decodeEntities: false});
            var setsList = $setsPage(".search-list");
            for(var i =0; i < setsList.length; i++){
                TCGPlayerCards.update({name : $setsPage(setsList[i]).text()},
                    {
                        $set : {name : $setsPage(setsList[i]).text(), cards : [], state : "created"}
                    },
                    {
                        upsert : true
                    }
                )
            }
        }
    logFunctionsEnd("getDeckSetsFromGoogleCache");
}






replaceEdition = (edition)=>{
    edition = edition.replace("6th Edition", "Classic Sixth Edition");
    edition = edition.replace("7th Edition", "Seventh Edition");
    edition = edition.replace("8th Edition", "Eighth Edition");
    edition = edition.replace("9th Edition", "Ninth Edition");
    edition = edition.replace("10th Edition", "Tenth Edition");
    edition = edition.replace("FNM Promos", "Friday Night Magic");
    edition = edition.replace("JSS/MSS Promos", "Super Series");
    edition = edition.replace("Timeshifted", `Time Spiral "Timeshifted"`);
    edition = edition.replace("Launch Party &amp; Release Event Promos", "Launch Parties");
    edition = edition.replace("Media Promos", "Media Inserts");
    edition = edition.replace("Magic 2010 (M10)", "Magic 2010");
    edition = edition.replace("Magic 2011 (M11)", "Magic 2011");
    edition = edition.replace("Magic 2012 (M12)", "Magic 2012");
    edition = edition.replace("Magic 2013 (M13)", "Magic 2013");
    edition = edition.replace("Magic 2014 (M14)", "Magic 2014 Core Set");
    edition = edition.replace("Magic 2015 (M15)", "Magic 2015 Core Set");
    edition = edition.replace("Magic 2015 (M15)", "Magic 2015 Core Set");
    edition = edition.replace("&#39;", "'");
    edition = edition.replace("Prerelease Cards", "Prerelease Events");
    edition = edition.replace("WPN &amp; Gateway Promos", "Wizards Play Network");
    edition = edition.replace("Game Day Promos", "Magic Game Day");
    edition = edition.replace("Grand Prix Promos", "Grand Prix");
    edition = edition.replace("Magic Modern Event Deck", "Modern Event Deck 2014");

    return edition;
}

Meteor.methods({
    phantomjs(){
        var path = require('path')
        var childProcess = require('child_process')
        var phantomjs = require('phantomjs-prebuilt')
        var binPath = phantomjs.path

        var childArgs = [
            Assets.absoluteFilePath("phantomjs-script.js"),
        ]

        childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {

        })

        // var phantomjs = require('phantomjs-prebuilt')
        // var program = phantomjs.exec('phantomjs-script.js', 'arg1', 'arg2')
        // program.stdout.pipe(process.stdout)
        // program.stderr.pipe(process.stderr)
        // program.on('exit', code => {
        //     // do something on end
        // })
    },
})

convertLinux = ()=>{

}