import React from "react";
import CardNamesCall from "./CardNamesCall/CardNamesCall";

export default class Deck extends React.Component{
    constructor(props) {
        super();
        this.state = {
            sideboardSelected : "",
        }
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
    }

    componentDidUpdate(){
        cardPopover(".js-cardNameInput", true);
    }

    separateCardsByTypeAddManaCost(main){
        var typesSeparated = {
            passChecks : {array : [], text : "Pass Checks"},
            null : {array : [], text : "Others(Not Found?)"},
            creature : {array : [], text : "Creature"},
            sorcery : {array : [], text : "Sorcery"},
            instant : {array : [], text : "Instant"},
            planeswalker : {array : [], text : "Planeswalker"},
            artifact : {array : [], text : "Artifact"},
            enchantment : {array : [], text : "Enchantment"},
            land : {array : [], text : "Land"}
        };

        main.forEach((card, index)=>{
            card.index = index;
            if(!card.types){typesSeparated.null.array.push(card)}
            else if (this.checkType({card : card, type : "land"})){typesSeparated.land.array.push(card)}
            else if (this.checkType({card : card, type : "artifact"}) && this.checkType({card : card, type : "Creature"})==false){typesSeparated.artifact.array.push(card)}
            else if (this.checkType({card : card, type : "creature"})){typesSeparated.creature.array.push(card)}
            else if (this.checkType({card : card, type : "enchantment"}) && this.checkType({card : card, type : "Creature"}) == false && this.checkType({card : card, type : "Artifact"}) == false){typesSeparated.enchantment.array.push(card)}
            else if (this.checkType({card : card, type : "instant"})){typesSeparated.instant.array.push(card)}
            else if (this.checkType({card : card, type : "planeswalker"})){typesSeparated.planeswalker.array.push(card)}
            else if (this.checkType({card : card, type : "sorcery"})){typesSeparated.sorcery.array.push(card)}
            else {
                typesSeparated.passChecks.array.push(card)
            }
        })
        return typesSeparated;
    }

    cardRow(card, mainSideboard){
        var selectors = {"data-mainSideboard" : mainSideboard};
        var cardDataName = {"data-name" : card.Cards_id};
        return  <div className="deck-block__card-line" key={card._id} >
            <div className="card-row js-imagePopOver" {...cardDataName}>
                <div className="remove-button-x">
                    <button type="button" {...selectors} {...cardDataName} className="btn btn-xs" onClick={()=>this.props.removeCardDeck(card.index, mainSideboard)}>
                        <span {...selectors} {...cardDataName} className="glyphicon glyphicon-remove"></span>
                    </button>
                </div>
                <input type="number" min={0} className="card-row__input-quantity" onChange={(event)=>this.props.changeACardQty(event.target, card.index, mainSideboard)} defaultValue={card.qty}/>
                <div className="js-cardNameInput card-row__name"
                     {...cardDataName}
                     {...selectors}
                >
                    {card._id}
                </div>
                {card ? <div className="card-row__mana">
                        {
                            getHTMLFromArray(card.manaCost).map((mana)=>{
                                if(mana.mana == "//"){
                                    return <span key={mana.key} className="card-mana-price__mana-division">//</span>
                                }
                                return <div key={mana.key} className={"mana " + mana.mana}></div>
                            })
                        }
                    </div>:
                    null
                }

            </div>
        </div>
    }

    addRow(mainSideboard){
        return  <div className="input-quantity-name-submit" key={mainSideboard}>
                    <input type="number" className="input-quantity-name-submit__quantity" data-mainSideboard={mainSideboard} onChange={(event)=>this.props.mainSideboardChangeValue(event.target, mainSideboard)} defaultValue={4}/>
                    <div className="input-quantity-name-submit__decklist-autosuggest">
                        <CardNamesCall
                            mainSideboard={mainSideboard}
                            setCardSelected={this.props.setCardSelected}
                            clear={this.props.clear}
                        />
                    </div>
                    <button className="input-quantity-name-submit__submit-button" onClick={()=>this.props.addCardToDeck(mainSideboard)}>Add To {mainSideboard.toTitleCase()}</button>
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
        var typesSeparated = this.separateCardsByTypeAddManaCost(this.props.UsersDeck.main);

        var resultMain = [];

        for(var type in typesSeparated){
            if(typesSeparated[type].array.length == 0) continue;
            resultMain.push(<div className="deck-block__type-header" key={type} >{typesSeparated[type].text} ({typesSeparated[type].array.reduce((a, b)=>{
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

    render() {
        var resultMain = this.getMainCards();

        var resultSideboard = this.props.UsersDeck.sideboard.map((card, index)=>{
            card.index = index;
            return this.cardRow(card, "sideboard", "change")
        })

        var mainTotal = this.totalCards(this.props.UsersDeck.main);
        var sideboardTotal = this.totalCards(this.props.UsersDeck.sideboard);
        return (
            <div className="DeckEditMethodComponent">
                <h3>Main <span className={mainTotal < 60? "wrongCardNumber": ""}>({mainTotal})</span></h3>
                {this.addRow("main")}
                <div className="deck-block">
                    <div className="deck-block__columns">
                        {resultMain.map((obj)=>{
                            return obj;
                        })}
                    </div>
                </div>
                <h3>Sideboard <span className={sideboardTotal > 15? "wrongCardNumber": ""}>({sideboardTotal})</span></h3>
                    {this.addRow("sideboard")}
                    <div className="deck-block">
                        <div className="deck-block__columns">
                        {resultSideboard.map((obj)=>{
                            return obj;
                        })}
                    </div>
                </div>
            </div>
        )
    }
}
