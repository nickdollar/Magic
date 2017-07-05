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

export default class Deck extends React.Component{
    constructor(props) {
        super();
        this.state = {
            listLoading : false
        }
    }

    componentDidMount() {
        this.addEventHandlers();
    }

    componentDidUpdate() {
        this.addEventHandlers();
    }

    addEventHandlers(){
        cardPopover(".js-cardNameInput");
        $('.js-select2').off("select2");
        $('.js-select2').select2({
            ajax : {
                transport : function(params, sucess, failure){
                    Meteor.call("getAutoComplete", {term : params.data.q}, (err, data)=>{
                        sucess(data.map((obj)=>{
                            return obj.name;
                        }));
                    });
                },
                processResults : function(data){
                    return {
                        results: data.map((cardsName)=>{
                            return {id : cardsName, text : cardsName}
                        })
                    };
                }
            }
        });

        $('.js-select2').off("select2:selecting");
        $('.js-select2').on("select2:selecting", (e)=> {
            if(e.target.getAttribute("data-mainSideboard")== "change"){
                this.props.changeCardDeck(e);
            }

            if(e.target.getAttribute("data-mainSideboard")== "add"){
                this.props.changeCardDeck(e);
            }
        });
    }

    subscribeToNewCards(cardName){
        var index = this.state.newCards.findIndex((card)=>{
            return card == cardName;
        })

        if(index == -1){
            this.state.newCards.push(cardName);
        }

        Meteor.subscribe("cardsFromArray", this.state.newCards, {
            onReady: ()=>{
                this.forceUpdate();
            }
        });
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.listLoading){
            this.setState({listLoading : false});
        }

    }

    shouldComponentUpdate(nextProps, nextState){
        if(nextState.listLoading == false){
            if(nextProps.listLoading == false){
                return true
            }else{
                return false
            }
        }

        return true;
    }

    getCardsByType(type) {
        return Cards.find(typeOptions[type]).map(function(p) { return {_id : p.name, manaCost : p.manaCost}});
    }
    getCardsSideboard() {
        var sideboard = this.props.deck.sideboard.map((card)=>{
            return card.Cards_id;
        });
        var cardsExists = Cards.find({_id : {$in : sideboard}}).fetch();

        var cardsComplete = cardsExists.filter((card)=>{
            return this.props.deck.sideboard.find((queryCard)=>{
                return card.Cards_id == queryCard.Cards_id;
            })
        })
            .map((card)=>{
                    var temp = this.props.deck.sideboard.find((queryCard)=>{
                        return card.Cards_id == queryCard.Cards_id;
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
            var cardQuery = Cards.findOne({_id : card.Cards_id});
            var cardComplete;

            if(cardQuery){
                cardComplete = Object.assign(card, {manaCost : cardQuery.manaCost});
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
            var cardQuery = Cards.findOne({_id : card.Cards_id});
            var cardComplete;
            if(cardQuery){
                cardComplete = Object.assign(card, {manaCost : cardQuery.manaCost});
            }else{
                cardComplete = card;
            }
            if(cardQuery){
                cardComplete = Object.assign(card, {manaCost : cardQuery.manaCost});
            }
            sideboard.push(cardComplete);
        })
        return sideboard;
    }

    cardRow(card, mainSideboard){
        var selectors = {
            "data-mainSideboard" : mainSideboard
        };

        var cardDataName = {"data-name" : card.Cards_id};
        var cardQty = {value : card.qty};

        return  <div className="cardLine" key={card.Cards_id} >
            <div className="cardQtyAndNameWrapper js-imagePopOver" {...cardDataName}>
                <div className="removeCardButtonWrapper"><button type="button" {...selectors} {...cardDataName} className="btn btn-xs" onClick={this.props.removeCardDeck}><span {...selectors} {...cardDataName} className="glyphicon glyphicon-remove"></span></button></div>
                <input type="number" className="qtyInput" {...cardDataName} data-mainSideboard={mainSideboard} onChange={this.props.updateQty.bind(this)} {...cardQty}/>
                <div className="js-cardNameInput nameSelectedWrapper"
                     {...cardDataName}
                     {...selectors}
                >
                    <select className="cardNameSelect js-select2"
                            type="text"
                            {...cardDataName}
                            {...selectors}
                    >
                        <option>{card.Cards_id}</option>
                    </select>
                </div>
                {card ? <div className="cardInfo">
                        <div className="manaValue">
                            {
                                getHTMLColors(card).map((mana)=>{
                                    return <div key={mana.key} className={"mana " + mana.mana}></div>
                                })
                            }
                        </div>
                    </div>: null}

            </div>
        </div>
    }

    addRow(mainSideboard){
        var selectors = {
            "data-mainSideboard" : mainSideboard,
        };
        var cardQty = {value : 4};


        return  <div className="addLine" key={mainSideboard}>
            <div className="cardQtyAndNameWrapper js-imagePopOver">
                <input type="number" className="qtyInput" data-mainSideboard={mainSideboard} onChange={this.props.updateQty} {...cardQty}/>
                <div className="js-cardNameInput nameSelectedWrapper"
                     {...selectors}
                >
                    <select className="cardNameSelect js-select2"
                            type="text"
                            {...selectors}
                    >
                        <option></option>
                    </select>
                </div>
                <div className="addToMainButtonWrapper">
                    <button onClick={this.props.addCardToDeck} {...selectors}>Add To {mainSideboard.toTitleCase()}</button>
                </div>
            </div>
        </div>
    }

    totalCards(mainSideboard){
        if(mainSideboard == "main"){
            return this.props.deck.main.reduce((a, b)=>{
                return a + b.qty;
            }, 0)
        }else{
            return this.props.deck.sideboard.reduce((a, b)=>{
                return a + b.qty;
            }, 0)
        }
    }

    render() {

        if(this.state.listLoading){return <div>Loading...</div>}
        var typesSeparated = this.separateCardsByTypeAddManaCost(this.props.deck.main);
        var resultMain = [];
        for(var type in typesSeparated){
            if(typesSeparated[type].length == 0) continue;
            resultMain.push(<div className="typeHeader" key={type} >{type} ({typesSeparated[type].reduce((a, b)=>{
                return a + b.qty;
            },0)})</div>)
            resultMain.push(
                typesSeparated[type].map((card)=>{
                    return  this.cardRow(card, "main", "change");
                })
            )
        }

        var sideboardCards = this.addManaCostToSideboard(this.props.deck.sideboard);

        var resultSideboard = sideboardCards.map((card)=>{
            return this.cardRow(card, "sideboard", "change")
        })

        return (
            <div className="deckEdit">
                <button onClick={this.props.submitDeck.bind(this)}>Submit Changes</button>
                <span className="error">{this.props.submitMessage}</span>

                <h3>Main <span className={this.totalCards("main") < 60? "wrongCardNumber": ""}>({this.totalCards("main")})</span></h3>
                {this.addRow("main")}
                <div className="deckBlock">
                    <div className="newDeckColumn">
                        {resultMain.map((obj)=>{
                            return obj;
                        })}
                    </div>
                </div>
                <h3>Sideboard <span className={this.totalCards("sideboard") > 15? "wrongCardNumber": ""}>({this.totalCards("sideboard")})</span></h3>
                {this.addRow("sideboard")}
                <div className="deckBlock">
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

