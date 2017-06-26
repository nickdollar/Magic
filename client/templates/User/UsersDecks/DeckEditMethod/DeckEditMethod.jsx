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
        return  <div className="cardLine" key={card.Cards_id} >
            <div className="cardQtyAndNameWrapper js-imagePopOver" {...cardDataName}>
                <input type="number" className="qtyInput" onChange={(event)=>this.props.changeACardQty(event.target, card.index, mainSideboard)} defaultValue={card.qty}/>
                <div className="removeCardButtonWrapper"><button type="button" {...selectors} {...cardDataName} className="btn btn-xs" onClick={()=>this.props.removeCardDeck(card.index, mainSideboard)}><span {...selectors} {...cardDataName} className="glyphicon glyphicon-remove"></span></button></div>
                <div className="js-cardNameInput nameSelectedWrapper"
                     {...cardDataName}
                     {...selectors}
                >
                    <div>{card.Cards_id}</div>
                </div>
                {card ? <div className="cardInfo">
                        <div className="manaValue">
                            {
                                getHTMLFromArray(card.manaCost).map((mana)=>{
                                    return <div key={mana.key} className={"mana " + mana.mana}></div>
                                })
                            }
                        </div>
                    </div>: null
                }
            </div>
        </div>
    }

    addRow(mainSideboard){
        return  <div className="addLine" key={mainSideboard}>
            <div className="cardQtyAndNameWrapper js-imagePopOver">
                <input type="number" className="qtyInput" data-mainSideboard={mainSideboard} onChange={(event)=>this.props.mainSideboardChangeValue(event.target, mainSideboard)} defaultValue={4}/>
                <div className="nameSelectedWrapper">
                    <CardNamesCall
                        mainSideboard={mainSideboard}
                        setCardSelected={this.props.setCardSelected}
                        clear={this.props.clear}
                    />
                </div>
                <div className="addToMainButtonWrapper">
                    <button onClick={()=>this.props.addCardToDeck(mainSideboard)}>Add To {mainSideboard.toTitleCase()}</button>
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
        var typesSeparated = this.separateCardsByTypeAddManaCost(this.props.UsersDeck.main);

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
                <div className="deckBlock">
                    <div className="newDeckColumn">
                        {resultMain.map((obj)=>{
                            return obj;
                        })}
                    </div>
                </div>
                <h3>Sideboard <span className={sideboardTotal > 15? "wrongCardNumber": ""}>({sideboardTotal})</span></h3>
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
