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


class DeckList extends React.Component{
    constructor() {
        super();

    }

    componentDidMount() {
    }

    getCardsByType(type) {
        return CardsData.find(typeOptions[type]).map(function(p) { return {name : p.name, manacost : p.manacost}});
    }

    getCardsSideboard() {
        var sideboard = this.props.deck.sideboard.map((card)=>{
            return card.name;
        });
        var cardsExists = CardsData.find({name : {$in : sideboard}}).fetch();

        var cardsComplete = cardsExists.filter((card)=>{
                return this.props.deck.sideboard.find((queryCard)=>{
                    return card.name == queryCard.name;
                })
            })
                .map((card)=>{
                        var temp = this.props.deck.sideboard.find((queryCard)=>{
                            return card.name == queryCard.name;
                        })
                        return Object.assign(card, temp);
                    }
                )
        return cardsComplete;
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
        var cards = this.props.deck.main.map((card)=>{
            return card.name
        })

        cards = cards.concat(this.props.deck.sideboard.map((card)=>{
            return card.name
        }))

        var uniqueCards = cards.unique();

        var cardsExists = CardsData.find({name : {$in : uniqueCards}}).map((card)=>{
            return card.name;
        })

        var cardsThatDontExists = _.difference(uniqueCards, cardsExists);

        var blocks = types.map((type)=> {
            return this.getCardsByType(type);
        });



        var blockComplete = [];
        for(var i = 0; i < blocks.length; i++){
            blockComplete.push(blocks[i].filter((card)=>{
                return this.props.deck.main.find((queryCard)=>{
                    return card.name == queryCard.name;
                })
            })
                .map((card)=>{
                    var temp = this.props.deck.main.find((queryCard)=>{
                        return card.name == queryCard.name;
                    })
                    return Object.assign(card, temp);
                }
                ))
        };


        var total = 0;
        for(var i = 0; i < blockComplete.length; i++){

            total += blockComplete[i].reduce((a,b)=>{
                return a + b.quantity;
            }, 0);
        }

        var resultMain = [];



        for(var i =0; i < blockComplete.length; i++){
            if(blockComplete[i].length == 0) continue;
            resultMain.push(<div className="typeHeader" key={types[i]} >{types[i]} ({blockComplete[i].reduce((a, b)=>{
                return a + b.quantity;
            },0)})</div>)
            resultMain.push(
                        blockComplete[i].map((card)=>{
                            return <div className="cardLine" key={card.name}>
                                         <div className="name js-imagePopOver" data-name={card.name}><div onClick={this.props.removeCardDeck} data-mainside="main" data-name={card.name} className="removeCard" >Remove </div><input className="quantityInput" data-mainside="main" data-name={card.name} onChange={this.props.changeCardDeck} type="number" value={card.quantity} /> {card.name}</div>
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


        var sideboardCards = this.getCardsSideboard();
        
        var sideboardQuantity = sideboardCards.reduce((a, b)=>{
            return a + b.quantity;
        }, 0);

        var resultSideboard = [<div className="deckBlock" key="sideboard">
                                <div className="typeHeader">Sideboard ({sideboardQuantity})</div>
                                <div className="newDeckColumn">
                                    {sideboardCards.map((card)=>{
                                        return <div className="cardLine" key={card.name}>
                                            <div className="name js-imagePopOver"
                                                 data-name={card.name}>
                                                <div onClick={this.props.removeCardDeck}
                                                     data-mainside="sideboard"
                                                     data-name={card.name}
                                                     className="removeCard" >Remove </div>
                                                <input className="quantityInput"
                                                       data-mainside="sideboard"
                                                       data-name={card.name}
                                                       onChange={this.props.changeCardDeck}
                                                       type="number" value={card.quantity} /> {card.name}</div>
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
                                    })}
                                </div>
                                </div>]

        var blockEmpty = [];

        if(cardsThatDontExists.length){
            blockEmpty.push(<div className="typeHeader" key="badCards">BAD CARDS</div>);

            blockEmpty.push(cardsThatDontExists.map((card)=>{
                return <div className="cardLine" key={card}>
                            <div className="name js-imagePopOver"
                                 data-name={card}>
                                <div onClick={this.props.removeCardDeck}
                                    data-mainside="main"
                                    data-name={card}
                                    className="removeCard" >Remove </div>
                                {card}
                            </div>
                       </div>
            }));
        }

        return (
            <div>
                <div>Add Card : <input type="text" data-mainSide="main"/> <button onClick={this.props.addCardDeck}>submit</button></div>

                <div className="deckBlock">

                    <div className="newDeckColumn">
                        <div className="typeHeader">Main Total: {total}</div>

                        {blockEmpty.map((obj)=>{
                            return obj;
                        })}
                        {resultMain.map((obj)=>{
                            return obj;
                        })}
                    </div>
                </div>
                {resultSideboard.map((obj)=>{
                    return obj;
                })}
            </div>
        )
    }
}

export default DeckList;

// <div class="deckBlock">
//     <div class="typeHeader">Sideboard ({{sideboardQuantity}})</div>
//     <div class="newDeckColumn">
//         {{#each sideboard}}
//         <div class="cardLine">
//             <div class="name js-imagePopOver" data-name="{{name}}">{{quantity}} {{name}}</div>
//             <div class="cardInfo">
//                 <div class="manaValue">{{#each getManaCss name}}<div class="mana {{mana}}"></div>{{/each}}</div>
//             </div>
//         </div>
//         {{/each}}
//     </div>
// </div>