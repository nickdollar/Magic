import cheerio from "cheerio";
console.log("START: getStarCityGamesEvents");

importCollection = (URL)=>{

    console.log("START: importCollection");
    var URL = "http://store.tcgplayer.com/collection/view/142729"
    var resMainPage = Meteor.http.get(URL);
    if (resMainPage.statusCode == 200) {
        var $collectionPage = cheerio.load(resMainPage.content, {decodeEntities: false});
        var collectionTable = $collectionPage("#collectionContainer");

        if(collectionTable.length){

            var headers = $collectionPage(collectionTable).find("thead th");
            var rows = $collectionPage(collectionTable).find("tbody tr");
            var nameRegex = /(\b.+\b) *(?= - \[Foil\]|$|\(\b\w+\b\))(\(\b\w+\b\))?( - \[Foil\])?/i;

            for(var i = 0; i < rows.length; i++){
                var qty = parseInt($collectionPage(rows[i]).find("td:nth-child(1)").html());
                if(isNaN(qty)){
                    qty = 0;
                }
                var name = $collectionPage(rows[i]).find("td:nth-child(2) a").html();

                var match = name.match(nameRegex);

                var nameMatched = match[1];
                var foil;

                if(match[3]){
                    foil = true;
                }else{
                    foil = false;
                }
                var setName = replaceEdition($collectionPage(rows[i]).find("td:nth-child(4)").html());
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
    console.log("   END: importCollection");
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
    edition = edition.replace("&#39;", "'");
    edition = edition.replace("Prerelease Cards", "Prerelease Events");
    edition = edition.replace("WPN &amp; Gateway Promos", "Wizards Play Network");
    edition = edition.replace("Game Day Promos", "Magic Game Day");
    edition = edition.replace("Grand Prix Promos", "Grand Prix");
    edition = edition.replace("Magic Modern Event Deck", "Modern Event Deck 2014");

    return edition;
}

