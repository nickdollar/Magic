import React from "react";

var types = ["artifact", "creature", "enchantment", "instant", "planeswalker", "sorcery", "land"];
typeOptions = { null : {},
    artifact : {creature : false, artifact : true},
    creature : {creature : true},
    enchantment : {enchantment : true, creature : false, artifact : false},
    instant : {instant : true},
    land : {land : true, creature : false, artifact : false},
    planeswalker : {planeswalker : true},
    sorcery : {sorcery : true}
};

typeOptionsArray = { null : {},
    artifact : {creature : false, artifact : true},
    creature : {creature : true},
    enchantment : {enchantment : true, creature : false, artifact : false},
    instant : {instant : true},
    land : {land : true, creature : false, artifact : false},
    planeswalker : {planeswalker : true},
    sorcery : {sorcery : true}
};


export default class Deck extends React.Component{
    constructor() {
        super();
    }

    componentDidMount() {
        $('.js-imagePopOver').off("popover");
        $('.js-imagePopOver').popover({
            html: true,
            trigger: 'hover',
            content: function () {
                var cardName = encodeURI($(this).data('name'));
                cardName = cardName.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "%22;").replace(/'/g, "%27");
                var linkBase = "https://mtgcards.file.core.windows.net/cards/";
                var key = "?sv=2015-12-11&ss=f&srt=o&sp=r&se=2017-07-01T10:06:43Z&st=2017-01-03T02:06:43Z&spr=https&sig=dKcjc0YGRKdFH441ITFgI5nhWLyrZR6Os8qntzWgMAw%3D";
                var finalDirectory = linkBase+cardName+".full.jpg" + key;
                return '<img src="'+finalDirectory +'" style="height: 310px; width: 223px"/>';
            }
        });
    }

    componentDidUpdate() {

        $('.js-imagePopOver').off("popover");
        $('.js-imagePopOver').popover({
            html: true,
            trigger: 'hover',
            content: function () {
                var cardName = encodeURI($(this).data('name'));
                cardName = cardName.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "%22;").replace(/'/g, "%27");
                var linkBase = "https://mtgcards.file.core.windows.net/cards/";
                var key = "?sv=2015-12-11&ss=f&srt=o&sp=r&se=2017-07-01T10:06:43Z&st=2017-01-03T02:06:43Z&spr=https&sig=dKcjc0YGRKdFH441ITFgI5nhWLyrZR6Os8qntzWgMAw%3D";
                var finalDirectory = linkBase+cardName+".full.jpg" + key;
                return '<img src="'+finalDirectory +'" style="height: 310px; width: 223px"/>';
            }
        });
    }

    getCardsByType(type) {
        return CardsData.find(typeOptions[type]).map(function(p) { return {name : p.name, manacost : p.manacost}});
    }

    getCardsSideboard() {
        var sideboard = this.props.DeckSelected.sideboard.map((card)=>{
            return card.name;
        });
        var cardsExists = CardsData.find({name : {$in : sideboard}}).fetch();

        var cardsComplete = cardsExists.filter((card)=>{
            return this.props.DeckSelected.sideboard.find((queryCard)=>{
                return card.name == queryCard.name;
            })
        })
            .map((card)=>{
                    var temp = this.props.DeckSelected.sideboard.find((queryCard)=>{
                        return card.name == queryCard.name;
                    })
                    return Object.assign(card, temp);
                }
            )
        return cardsComplete;
    }

    separateCardsByTypeAddManaCost(main){
        var typesSeparated = { null : [],
            artifact : [],
            creature : [],
            enchantment : [],
            instant : [],
            land : [],
            planeswalker : [],
            sorcery : []
        };
        var tempMain = main.concat();
        tempMain.forEach((card)=>{


            var cardQuery = CardsData.findOne({name : card.name});
            var cardComplete;

            if(cardQuery){
                cardComplete = Object.assign(card, {manacost : cardQuery.manacost});
            }else{
                cardComplete = card;
            }

            if(!cardQuery){typesSeparated.null.push(cardComplete)}
            else if(cardQuery.artifact == true && cardQuery.creature == false){typesSeparated.artifact.push(cardComplete)}
            else if (cardQuery.creature == true){typesSeparated.creature.push(cardComplete)}
            else if (cardQuery.enchantment == true && cardQuery.creature == false && cardQuery.artifact == false){typesSeparated.enchantment.push(cardComplete)}
            else if (cardQuery.instant == true){typesSeparated.instant.push(cardComplete)}
            else if (cardQuery.land == true && cardQuery.creature == false && cardQuery.artifact == false){typesSeparated.land.push(cardComplete)}
            else if (cardQuery.planeswalker == true){typesSeparated.planeswalker.push(cardComplete)}
            else if (cardQuery.sorcery == true){typesSeparated.sorcery.push(cardComplete)}
        })
        return typesSeparated;
    }

    addManaCostToSideboard(cards){

        var sideboard = [];
        var cardsTemp = cards.concat();
        cardsTemp.forEach((card)=>{
            var cardQuery = CardsData.findOne({name : card.name});
            var cardComplete;
            if(cardQuery){
                cardComplete = Object.assign(card, {manacost : cardQuery.manacost});
            }else{
                cardComplete = card;
            }
            if(cardQuery){
                cardComplete = Object.assign(card, {manacost : cardQuery.manacost});
            }
            sideboard.push(cardComplete);
        })
        return sideboard;
    }


    getHTMLColors(card){
        if(typeof card.manacost == "undefined") return [];
        var manacost = card.manacost;
        var manaRegex = new RegExp("(?:B|C|G|R|U|W)?\/?(?:X|P|B|C|G|R|U|W|\\d+)(?=})", 'g');

        var str = [];
        var matches = manacost.match(manaRegex);

        for(var i = 0; i < matches.length; i ++){
            if(     matches[i] ==  "X" ) {str.push({key : i, mana :'sx' }) }
            else if(matches[i] === "1" ) {str.push({key : i, mana :'s1' }) }
            else if(matches[i] === "2" ) {str.push({key : i, mana :'s2' }) }
            else if(matches[i] === "3" ) {str.push({key : i, mana :'s3' }) }
            else if(matches[i] === "4" ) {str.push({key : i, mana :'s4' }) }
            else if(matches[i] === "5" ) {str.push({key : i, mana :'s5' }) }
            else if(matches[i] === "6" ) {str.push({key : i, mana :'s6' }) }
            else if(matches[i] === "7" ) {str.push({key : i, mana :'s7' }) }
            else if(matches[i] === "8" ) {str.push({key : i, mana :'s8' }) }
            else if(matches[i] === "9" ) {str.push({key : i, mana :'s9' }) }
            else if(matches[i] === "10") {str.push({key : i, mana :'s10'}) }
            else if(matches[i] === "11") {str.push({key : i, mana :'s11'}) }
            else if(matches[i] === "12") {str.push({key : i, mana :'s12'}) }
            else if(matches[i] === "13") {str.push({key : i, mana :'s13'}) }
            else if(matches[i] === "14") {str.push({key : i, mana :'s14'}) }
            else if(matches[i] === "15") {str.push({key : i, mana :'s15'}) }
            else if(matches[i] === "16") {str.push({key : i, mana :'s16'}) }
            else if(matches[i] === "17") {str.push({key : i, mana :'s17'}) }
            else if(matches[i] === "18") {str.push({key : i, mana :'s18'}) }
            else if(matches[i] === "19") {str.push({key : i, mana :'s19'}) }
            else if(matches[i] === "20") {str.push({key : i, mana :'s20'}) }

            else if(matches[i] === "B" ) {str.push({key : i, mana :'sb' }) }
            else if(matches[i] === "C" ) {str.push({key : i, mana :'scl'}) }
            else if(matches[i] === "G" ) {str.push({key : i, mana :'sg' }) }
            else if(matches[i] === "R" ) {str.push({key : i, mana :'sr' }) }
            else if(matches[i] === "U" ) {str.push({key : i, mana :'su' }) }
            else if(matches[i] === "W" ) {str.push({key : i, mana :'sw' }) }

            else if(matches[i] === "2B") {str.push({key : i, mana :'s2b'}) }
            else if(matches[i] === "2G") {str.push({key : i, mana :'s2g'}) }
            else if(matches[i] === "3R") {str.push({key : i, mana :'s3r'}) }
            else if(matches[i] === "2U") {str.push({key : i, mana :'s2u'}) }
            else if(matches[i] === "2W") {str.push({key : i, mana :'s2w'}) }

            else if(matches[i] === "B/P"){str.push({key : i, mana :'sbp'}) }
            else if(matches[i] === "G/P"){str.push({key : i, mana :'sgp'}) }
            else if(matches[i] === "R/P"){str.push({key : i, mana :'srp'}) }
            else if(matches[i] === "U/P"){str.push({key : i, mana :'sup'}) }
            else if(matches[i] === "W/P"){str.push({key : i, mana :'swp'}) }

            else if(matches[i] === "B/G"){str.push({key : i, mana :'sbg'}) }
            else if(matches[i] === "B/R"){str.push({key : i, mana :'sbr'}) }
            else if(matches[i] === "G/U"){str.push({key : i, mana :'sgu'}) }
            else if(matches[i] === "G/W"){str.push({key : i, mana :'sgw'}) }
            else if(matches[i] === "R/G"){str.push({key : i, mana :'srg'}) }
            else if(matches[i] === "R/W"){str.push({key : i, mana :'srw'}) }
            else if(matches[i] === "U/B"){str.push({key : i, mana :'sub'}) }
            else if(matches[i] === "U/R"){str.push({key : i, mana :'sur'}) }
            else if(matches[i] === "W/B"){str.push({key : i, mana :'swb'}) }
            else if(matches[i] === "W/U"){str.push({key : i, mana :'swu'}) }
        }
        return str;
    }

    render() {
        if(!this.props.DeckSelected){return <div>Loading...</div>}
        if(!this.props.DeckSelected.main){return <div>Loading...</div>}
        if(!this.props.DeckSelected.sideboard){return <div>Loading...</div>}


        var typesSeparated = this.separateCardsByTypeAddManaCost(this.props.DeckSelected.main);
        var resultMain = [];
        for(var type in typesSeparated){
            if(typesSeparated[type].length == 0) continue;
            resultMain.push(<div className="typeHeader" key={type} >{type} ({typesSeparated[type].reduce((a, b)=>{
                return a + b.quantity;
            },0)})</div>)
            resultMain.push(
                typesSeparated[type].map((card)=>{
                    return  <div className="cardLine" key={card.name}>
                                <div className="name js-imagePopOver" data-name={card.name}>
                                    <span className="quantity">{card.quantity}</span><span >{card.name}</span>
                                </div>
                                <div className="cardInfo">
                                    <div className="manaValue">
                                        {
                                            this.getHTMLColors(card).map((mana)=>{
                                                return <div key={mana.key} className={"mana " + mana.mana}></div>
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                })
            )
        }
        var sideboardCards = this.addManaCostToSideboard(this.props.DeckSelected.sideboard);

        var resultSideboard = sideboardCards.map((card)=>{
        return <div className="cardLine" key={card.name}>
                <div className="name js-imagePopOver" data-name={card.name}>
                    <span className="quantity">{card.quantity}</span><span >{card.name}</span>
                </div>
                <div className="cardInfo">
                    <div className="manaValue">
                        {
                            this.getHTMLColors(card).map((mana)=>{
                                return <div key={mana.key} className={"mana " + mana.mana}></div>
                            })
                        }
                    </div>
                </div>
            </div>
        })

           return (
            <div>
                <span ref={"error"} className="error"></span>
                <div className="deckBlock">
                    <div className="newDeckColumn">
                        {resultMain.map((obj)=>{
                            return obj;
                        })}
                    </div>
                </div>
                <div className="deckBlock" key="sideboard">
                    <div className="newDeckColumn">

                        {resultSideboard.map((obj)=>{
                            return obj;
                        })}
                    </div>
                </div>
            </div>
        )
    }
}

