import papaparse from "papaparse";
import entities from "entities";

Meteor.methods({
    CreateDatabaseFromCSVMethod(){
        logFunctionsStart("CreateDatabaseFromCSVMethod");
        const dataCSV = Assets.getText('TCGCardsScraped.csv');

        var TCGCSVparsed = papaparse.parse(dataCSV, {
            header : true,
            // dynamicTyping: true,
            skipEmptyLines : true
        });

        for(var i = 0; i < TCGCSVparsed.data.length; i++){
            var cardData = {};
            var _id = TCGCSVparsed.data[i]._id.replace("a", "");
            var number = parseInt(TCGCSVparsed.data[i].number);
            isNaN(number) ? null : cardData.number = number;
            cardData.TCGName =  entities.decodeHTML(TCGCSVparsed.data[i]["TCGName"]);
            cardData.TCGSet =  entities.decodeHTML(TCGCSVparsed.data[i]["﻿TCGSet"]);
            TCGCards.update({_id : _id},
                {
                    $set : cardData
                },
                {
                    upsert : true
                })
        }
        logFunctionsEnd("CreateDatabaseFromCSVMethod");
    },
    CreateLatestTCGCardsMethod(){
        logFunctionsStart("CreateDatabaseFromCSVMethod");
        const dataCSV = Assets.getText('TCGCardLatest.csv');

        var TCGCSVparsed = papaparse.parse(dataCSV, {
            header : true,
            // dynamicTyping: true,
            skipEmptyLines : true
        });

        for(var i = 0; i < TCGCSVparsed.data.length; i++){
            var cardData = {};
            var _id = TCGCSVparsed.data[i]._id.replace("a", "");
            var number = parseInt(TCGCSVparsed.data[i].number);
            isNaN(number) ? null : cardData.number = number;
            cardData.TCGName =  entities.decodeHTML(TCGCSVparsed.data[i]["TCGName"]);
            cardData.TCGSet =  entities.decodeHTML(TCGCSVparsed.data[i]["﻿TCGSet"]);
            cardData.rarity =  entities.decodeHTML(TCGCSVparsed.data[i]["rarity"]);


            console.log(cardData);

            if(TCGCards.find({_id : _id}).count()){
                console.log("FOUND")
            }else{
                console.log("NOT FOUND")
                TCGCards.update({_id : _id},
                    {
                        $set : cardData
                    },
                    {
                        upsert : true
                    })
            }
        }
        logFunctionsEnd("CreateDatabaseFromCSVMethod");
    }
})