import React from "react";
import CardNamesCall from "./CardNamesCall/CardNamesCall";

export default class DeckEditStandalone extends React.Component{
    constructor(props) {
        super();
        this.state = {
            sideboardSelected : "",
            DecksData_id : props.DecksData_id,
            deck : {main : [], sideboard : []},
            qty : {main : 0, sideboard : 0},
            main : {name : null, _id : null, qty : 4},
            sideboard : {name : null,  _id : null, qty : 4},
            changes : false
        }
    }

    getSelectedDeck(){
        Meteor.call("getDeckWithInformation", {DecksData_id : this.state.DecksData_id}, (err, response)=>{
            var qty = {main : 0, sideboard : 0};
            if(response){
                for(var i = 0 ; i < response.main.length ; i++){
                    qty.main += response.main[i].qty;
                    Object.assign(response.main[i], response.cardsInfo.find(cardInfo => cardInfo.name == response.main[i].name))

                }
                for(var i = 0 ; i < response.sideboard.length ; i++){
                    qty.sideboard += response.sideboard[i].qty;
                    Object.assign(response.sideboard[i], response.cardsInfo.find(cardInfo => cardInfo.name == response.sideboard[i].name))
                }
                this.setState({
                    deck : response,
                    main : {name : null, _id : null, qty : 4},
                    sideboard : {name : null,  _id : null, qty : 4},
                    clear : true,
                    changes : false,
                    qty : qty
                })
            }
        });
    }

    removeCardDeck(index, mainSideboard){
        var deck = Object.assign({}, this.state.deck);

        if(deck[mainSideboard][index]._id){
            this.state.qty[mainSideboard] -= deck[mainSideboard][index].qty;
        }

        deck[mainSideboard].splice(index, 1);
        this.setState({deck : deck, changes : true});
    }
    mainSideboardChangeValue(target, mainSideboard){
        var qty = parseInt(target.value);
        if(isNaN(qty)){
            qty = 0;
        }
        this.state[mainSideboard].qty = qty;
    }

    changeACardQty(target, index, mainSideboard){
        if(this.state.deck[mainSideboard][index]._id){
            var qty = parseInt(target.value);
            if(isNaN(qty)){qty = 0;}
            this.state.qty[mainSideboard] -= this.state.deck[mainSideboard][index].qty;
            this.state.deck[mainSideboard][index].qty = qty;
            this.state.qty[mainSideboard] += qty;
            this.setState({changes : true});
        }
    }

    addCardToDeck(mainSideboard){
        var selectedCard = this.state[mainSideboard];
        if(!selectedCard.name){
            return;
        };

        var deck = this.state.deck;

        var index = deck[mainSideboard].findIndex(cardObj=> cardObj.name == this.state[mainSideboard].name)
        if(index != -1){
            return;
        }

        Meteor.call("getCardsBy_idMethod", {CardsSimple_id : selectedCard._id}, (err, data)=>{
            data.qty = selectedCard.qty;
            deck[mainSideboard].push(data);
            if(data._id){
                this.state.qty[mainSideboard] += selectedCard.qty;
            }
            var msObject = {};
            msObject[mainSideboard] = {name : null, _id : null, qty : 4};
            this.setState(Object.assign({deck : deck, clear : !this.state.clear, changes : true}, msObject));
        })
    }

    setCardSelected({suggestion, mainSideboard}) {
        this.state[mainSideboard].name = suggestion.name;
        this.state[mainSideboard]._id = suggestion._id;
    }

    submitDeck(){
        var options = ["main", "sideboard"];
        var deckData = {main : [], sideboard : []};
        for(var i = 0; i < options.length; i++){
            deckData[options[i]] = this.state.deck[options[i]].map((card)=>{
                return {name : card.name, qty : card.qty}
            })
        }
        Meteor.call("adminUpdateDeck", {DecksData_id : this.state.DecksData_id, deck : deckData}, (err, data)=>{
            this.setState({changes : false})
        })
    }

    componentWillReceiveProps(nextProps){
    }

    checkType({card, type}){
        var index = card.types.findIndex(typeObj => typeObj == type);
        if(index == -1){
            return false;
        }
        return true;
    }

    componentDidMount(){
        cardPopover(".js-cardNameInput", true);
        this.getSelectedDeck();
    }

    componentDidUpdate(){
        cardPopover(".js-cardNameInput", true);
    }

    separateCardsByTypeAddManaCost(main){
        var typesSeparated = {
            passChecks : {array : [], text : "Pass Checks"},
            null : {array : [], text : "Wrong Name"},
            creature : {array : [], text : "Creature"},
            sorcery : {array : [], text : "Sorcery"},
            instant : {array : [], text : "Instant"},
            planeswalker : {array : [], text : "Planeswalker"},
            artifact : {array : [], text : "Artifact"},
            enchantment : {array : [], text : "Enchantment"},
            land : {array : [], text : "Land"},
        };

        main.forEach((card, index)=>{
            card.index = index;
            if(!card.types){typesSeparated.null.array.push(card)}
            else if (this.checkType({card : card, type : "Land"})){typesSeparated.land.array.push(card)}
            else if (this.checkType({card : card, type : "Artifact"}) && this.checkType({card : card, type : "Creature"})==false){typesSeparated.artifact.array.push(card)}
            else if (this.checkType({card : card, type : "Creature"})){typesSeparated.creature.array.push(card)}
            else if (this.checkType({card : card, type : "Enchantment"}) && this.checkType({card : card, type : "Creature"}) == false && this.checkType({card : card, type : "Artifact"}) == false){typesSeparated.enchantment.array.push(card)}
            else if (this.checkType({card : card, type : "Instant"})){typesSeparated.instant.array.push(card)}
            else if (this.checkType({card : card, type : "Planeswalker"})){typesSeparated.planeswalker.array.push(card)}
            else if (this.checkType({card : card, type : "Sorcery"})){typesSeparated.sorcery.array.push(card)}
            else {
                typesSeparated.passChecks.array.push(card)
            }
        })
        return typesSeparated;
    }

    cardRow(card, mainSideboard){
        var selectors = {"data-mainSideboard" : mainSideboard};
        var cardDataName = {"data-name" : card.name};
        return  <div className="cardLine" key={card.name} >
            <div className="cardQtyAndNameWrapper js-imagePopOver" {...cardDataName}>
                <div className="removeCardButtonWrapper"><button type="button" {...selectors} {...cardDataName} className="btn btn-danger btn-xs btn-round" onClick={()=>this.removeCardDeck(card.index, mainSideboard)}><span {...selectors} {...cardDataName} className="glyphicon glyphicon-remove"></span></button></div>
                <input type="number" className="qtyInput" onChange={(event)=>this.changeACardQty(event.target, card.index, mainSideboard)} defaultValue={card.qty}/>
                <div className="js-cardNameInput nameSelectedWrapper"
                     {...cardDataName}
                     {...selectors}
                >
                    <div>{card.name}</div>
                </div>
                {card ? <div className="cardInfo">
                        <div className="manaValue">
                            {
                                getHTMLFromArray(card.manaCost).map((mana)=>{
                                    return <div key={mana.key} className={"mana " + mana.mana}></div>
                                })
                            }
                        </div>
                    </div>: null}

            </div>
        </div>
    }

    addRow(mainSideboard){
        return  <div className="addLine" key={mainSideboard}>
            <div className="cardQtyAndNameWrapper js-imagePopOver">
                <input type="number" className="qtyInput" data-mainSideboard={mainSideboard} onChange={(event)=>this.mainSideboardChangeValue(event.target, mainSideboard)} defaultValue={4}/>
                <div className="nameSelectedWrapper">
                    <CardNamesCall
                        mainSideboard={mainSideboard}
                        setCardSelected={this.setCardSelected.bind(this)}
                        clear={this.state.clear}
                    />
                </div>
                <div className="addToMainButtonWrapper">
                    <button onClick={()=>this.addCardToDeck(mainSideboard)}>Add To {mainSideboard.toTitleCase()}</button>
                </div>
            </div>
        </div>
    }

    totalCards(cardList){
        if(!cardList){
            return 0;
        }
        return cardList.reduce((a, b)=>{
            return a + b.qty;
        }, 0)
    }

    getMainCards(){
        var typesSeparated = this.separateCardsByTypeAddManaCost(this.state.deck.main);

        var resultMain = [];

        for(var type in typesSeparated){
            if(typesSeparated[type].array.length == 0) continue;
            resultMain.push(<div className="typeHeader" key={type} >{typesSeparated[type].text} ({typesSeparated[type].array.reduce((a, b)=>{
                return a + b.qty;
            },0)})</div>)
            resultMain.push(
                typesSeparated[type].array.map((card)=>{
                    return  this.cardRow(card, "main", "change");
                })
            )
        }

        return resultMain;
    }


    shouldComponentUpdate(){
        return true;
    }

    deckState(){
        if(this.state.qty.main < 60){
            return "Missing Cards"
        }
        if(this.state.qty.sideboard > 15){
            return "Too Much on Sideboard"
        }
        if(!this.state.changes){
            return "No Changes"
        }

        if(this.state.DecksData_id){
            return "Update";
        }

        return "Submit";
    }

    submitDeckState() {
        if(this.state.qty.main < 60){
            return true
        }else if(this.state.qty.sideboard > 15){
            return true
        }
        return !this.state.changes;
    }

    render() {
        var resultMain = this.getMainCards();

        var resultSideboard = this.state.deck.sideboard.map((card, index)=>{
            card.index = index;
            return this.cardRow(card, "sideboard", "change")
        })

        return (
            <div className="DeckEditMethodComponent">
                <span><button className="btn" disabled={this.submitDeckState()} onClick={this.submitDeck.bind(this)}>{this.deckState()}</button></span>
                <h3>Main <span className={this.state.qty.main < 60? "wrongCardNumber": ""}>({this.state.qty.main})</span></h3>
                {this.addRow("main")}
                <div className="deckBlock">
                    <div className="newDeckColumn">
                        {resultMain.map((obj)=>{
                            return obj;
                        })}
                    </div>
                </div>
                <h3>Sideboard <span className={this.state.qty.sideboard > 15? "wrongCardNumber": ""}>({this.state.qty.sideboard})</span></h3>
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
