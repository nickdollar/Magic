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
    constructor(props) {
        super();
        this.state = {
            totalMain : 0,
            totalSideboard : 0
        }
    }

    componentDidMount() {
    }

    getCardsByType(type) {
        return CardsData.find(typeOptions[type]).map(function(p) { return {name : p.name, manacost : p.manacost}});
    }

    getCardsSideboard() {
        var sideboard = this.state.deck.sideboard.map((card)=>{
            return card.name;
        });
        var cardsExists = CardsData.find({name : {$in : sideboard}}).fetch();

        var cardsComplete = cardsExists.filter((card)=>{
            return this.state.deck.sideboard.find((queryCard)=>{
                return card.name == queryCard.name;
            })
        })
            .map((card)=>{
                    var temp = this.state.deck.sideboard.find((queryCard)=>{
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

    componentWillReceiveProps(props){
        if(DecksData.findOne({_id : props.DecksData_id})){
            this.setState({deck : DecksData.findOne({_id : props.DecksData_id})});
        }
    }

    submitDeck(){
        var cardsMain = this.state.deck.main.map((card)=>{
            return card.name
        })
        var uniqueCardsMain = cardsMain.unique();;
        var cardsExistsMain = CardsData.find({name : {$in : uniqueCardsMain}}).map((card)=>{
            return card.name;
        })

        var cardsThatDontExistsMain = _.difference(uniqueCardsMain, cardsExistsMain);


        for(var i = 0; i < cardsThatDontExistsMain.length; i++){
            this.removeCardDeckFromName({name : cardsThatDontExistsMain[i], sideMain : "main"})
        }


        //remove card from sideboard
        var cardsSideboard = this.state.deck.sideboard.map((card)=>{
            return card.name
        })
        var uniqueCardsSideboard = cardsSideboard.unique();;
        var cardsExistsSideboard = CardsData.find({name : {$in : uniqueCardsSideboard}}).map((card)=>{
            return card.name;
        })

        var cardsThatDontExistsSideboard = _.difference(uniqueCardsSideboard, cardsExistsSideboard);

        for(var i = 0; i < cardsThatDontExistsSideboard.length; i++){
            this.removeCardDeckFromName({name : cardsThatDontExistsSideboard[i], sideMain : "sideboard"})
        }

        var blocks = types.map((type)=> {
            return this.getCardsByType(type);
        });

        var i = this.state.deck.sideboard.length
        while (i--) {
            if(!this.state.deck.sideboard[i].quantity){
                this.state.deck.sideboard.splice(i, 1);
            }

        }

        var i = this.state.deck.main.length
        while (i--) {
            if(!this.state.deck.main[i].quantity){
                this.state.deck.main.splice(i, 1);
            }

        }

        var totalMain = this.state.deck.main.reduce((a, b)=>{
            return a + b.quantity;
        }, 0);

        var totalSideboard = this.state.deck.sideboard.reduce((a, b)=>{
            return a + b.quantity;
        }, 0);

        console.log(totalMain, totalSideboard);
        if(totalMain < 60){
            this.refs["error"].textContent = "Deck Less Than 60 cards";
            return;
        }else{
            this.refs["error"].textContent = "";
        }

        if(totalSideboard > 15){
            this.refs["error"].textContent = "Sideboard greater than 15 cards";
            return;
        }else{
            this.refs["error"].textContent = ""
        }

        var submitDeck = Object.assign({}, {main : this.state.deck.main, sideboard : this.state.deck.sideboard}, {totalMain : totalMain}, {totalSideboard : totalSideboard});

        Meteor.call("updateLGSDecksData", submitDeck, ()=>{
        
        });

        this.setState(submitDeck);

    }

    addCardDeck(e){

        var cardName = e.target.previousElementSibling.value;
        var sideMain = e.target.previousElementSibling.getAttribute("data-mainSide");
        if(cardName.length == 0){
            return;
        };

        cardName = cardName.toTitleCase();

        if(this.state.deck[sideMain].findIndex((card)=>{
                return cardName == card.name
            }) != -1){
            return
        }

        var deck = Object.assign({}, this.state.deck);

        cardName = cardName.toTitleCase()

        deck[sideMain].push({name : cardName, quantity : 0});

        this.setState({
            deck : deck
        })
    }

    removeCardDeck(e){
        var cardName = e.target.getAttribute("data-name");
        var sideMain = e.target.getAttribute("data-mainside");

        var deck = Object.assign({}, this.state.deck);

        var index = deck[sideMain].findIndex((obj)=>{
            return cardName == obj.name
        });

        deck[sideMain].splice(index, 1);

        this.setState({
            deck : deck
        })
    }

    changeCardDeck(e){
        console.log()
        var cardName = e.target.getAttribute("data-name");
        var sideMain = e.target.getAttribute("data-mainside");

        if(e.target.value < 0) return;
        var deck = Object.assign({}, this.state.deck);

        var item = deck[sideMain].find((obj)=>{
            return cardName == obj.name
        });

        item.quantity = parseInt(e.target.value);
        this.setState({
            deck : deck
        })
    }


    render() {
        if(this.state.deck){
            var cardsMain = this.state.deck.main.map((card)=>{
                return card.name
            })
            var uniqueCardsMain = cardsMain.unique();;
            var cardsExistsMain = CardsData.find({name : {$in : uniqueCardsMain}}).map((card)=>{
                return card.name;
            })

            var cardsThatDontExistsMain = _.difference(uniqueCardsMain, cardsExistsMain);

            var cardsSideboard = this.state.deck.sideboard.map((card)=>{
                return card.name
            })
            var uniqueCardsSideboard = cardsSideboard.unique();;
            var cardsExistsSideboard = CardsData.find({name : {$in : uniqueCardsSideboard}}).map((card)=>{
                return card.name;
            })

            var cardsThatDontExistsSideboard = _.difference(uniqueCardsSideboard, cardsExistsSideboard);



            var blocks = types.map((type)=> {
                return this.getCardsByType(type);
            });



            var blockComplete = [];
            for(var i = 0; i < blocks.length; i++){
                blockComplete.push(blocks[i].filter((card)=>{
                    return this.state.deck.main.find((queryCard)=>{
                        return card.name == queryCard.name;
                    })
                })
                    .map((card)=>{
                            var temp = this.state.deck.main.find((queryCard)=>{
                                return card.name == queryCard.name;
                            })
                            return Object.assign(card, temp);
                        }
                    ))
            };


            var totalMain = 0;
            for(var i = 0; i < blockComplete.length; i++){

                totalMain += blockComplete[i].reduce((a,b)=>{
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
                            <div className="name js-imagePopOver" data-name={card.name}><div onClick={this.removeCardDeck.bind(this)} data-mainside="main" data-name={card.name} className="removeCard" >Remove </div><input className="quantityInput" data-mainside="main" data-name={card.name} onChange={this.changeCardDeck.bind(this)} type="number" value={card.quantity} /> {card.name}</div>
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

            var totalSideboard = sideboardCards.reduce((a, b)=>{
                return a + b.quantity;
            }, 0);

            var resultSideboard = sideboardCards.map((card)=>{
                return <div className="cardLine" key={card.name}>
                    <div className="name js-imagePopOver"
                         data-name={card.name}>
                        <div onClick={this.removeCardDeck.bind(this)}
                             data-mainside="sideboard"
                             data-name={card.name}
                             className="removeCard" >Remove </div>
                        <input className="quantityInput"
                               data-mainside="sideboard"
                               data-name={card.name}
                               onChange={this.changeCardDeck.bind(this)}
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
            })


            var badCardsMain = [];

            if(cardsThatDontExistsMain.length){
                badCardsMain.push(<div className="typeHeader" key="badCards">BAD CARDS</div>);

                badCardsMain.push(cardsThatDontExistsMain.map((card)=>{
                    return <div className="cardLine" key={card}>
                        <div className="name js-imagePopOver"
                             data-name={card}>
                            <div onClick={this.removeCardDeck.bind(this)}
                                 data-mainside="main"
                                 data-name={card}
                                 className="removeCard" >Remove </div>
                            {card}
                        </div>
                    </div>
                }));
            }
            var badCardsSideboard = [];

            if(cardsThatDontExistsSideboard.length){
                badCardsSideboard.push(<div className="typeHeader" key="badCards">BAD CARDS</div>);

                badCardsSideboard.push(cardsThatDontExistsSideboard.map((card)=>{
                    return <div className="cardLine" key={card}>
                        <div className="name js-imagePopOver"
                             data-name={card}>
                            <div onClick={this.removeCardDeck.bind(this)}
                                 data-mainside="sideboard"
                                 data-name={card}
                                 className="removeCard" >Remove </div>
                            {card}
                        </div>
                    </div>
                }));
            }
        }

        if(!this.state.deck){
            return (<div>Loading...</div>)
        }

        return (

            <div>
                <button ref={"submitButton"} onClick={this.submitDeck.bind(this)}>Submit Deck</button>
                <span ref={"error"} className="error"></span>
                <div>Add Card to Main : <input type="text" data-mainSide="main"/> <button onClick={this.addCardDeck.bind(this)}>submit</button></div>


                <div className="deckBlock">

                    <div className="newDeckColumn">
                        <div className="typeHeader">Main Total: {totalMain}</div>

                        {badCardsMain.map((obj)=>{
                            return obj;
                        })}
                        {resultMain.map((obj)=>{
                            return obj;
                        })}
                    </div>
                </div>
                <div>Add Card to Sideboard: <input type="text" data-mainSide="sideboard"/> <button onClick={this.addCardDeck.bind(this)}>submit</button></div>
                <div className="deckBlock" key="sideboard">
                    <div className="typeHeader">Sideboard ({totalSideboard})</div>
                    <div className="newDeckColumn">

                        {badCardsSideboard.map((obj)=>{
                            return obj;
                        })}
                        {resultSideboard.map((obj)=>{
                            return obj;
                        })}
                    </div>
                </div>

            </div>
        )
    }
}

export default DeckList;