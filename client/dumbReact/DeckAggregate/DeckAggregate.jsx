import React from "react";

export default class Deck extends React.Component{
    constructor() {
        super();
        this.state = {DecksData : {main : [], sideboard : []}};
    }




    componentDidUpdate() {
        cardPopover(".js-imagePopOver", true);
    }

    componentDidMount() {
        this.getDecksDataById(this.props.DecksData_id);
        cardPopover(".js-imagePopOver", true);
    }


    componentWillReceiveProps(nextProps){
        if(nextProps.DecksData_id != this.props.DecksData_id){
            this.getDecksDataById(nextProps.DecksData_id);
        }
    }

    separateCardsByType(main){
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

        main.forEach((card)=>{
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

    checkType({card, type}){
        var index = card.types.findIndex(typeObj => typeObj == type);
        if(index == -1){
            return false;
        }
        return true;
    }

    getCardQty(cardList){
        for(var i =0; i < cardList.length; i++){
            var have = Session.get("cards")[cardList[i].name];
            if(!have){
                have = 0;
            }
            cardList[i].have = have;
        }
    }

    getDecksDataById(DecksData_id){
        Meteor.call("getDecksDataWithCardsInformation", {DecksData_id : DecksData_id}, (err, data)=>{
            if(data){
                for(var i = 0 ; i < data.main.length ; i++){
                    Object.assign(data.main[i], data.cardsInfo.find(cardInfo => cardInfo.name == data.main[i].name))
                }
                for(var i = 0 ; i < data.sideboard.length ; i++){
                    Object.assign(data.sideboard[i], data.cardsInfo.find(cardInfo => cardInfo.name == data.sideboard[i].name))
                }
                this.setState({DecksData : data})
            }
        });
    }

    addManaCostToSideboard(cards){

        var sideboard = [];
        var cardsTemp = cards.concat();
        cardsTemp.forEach((card)=>{
            sideboard.push(card);
        })
        return sideboard;
    }

    createLink({main, sideboard}){

        var cards = main.concat(sideboard);

        var linkAllCards = `http://store.tcgplayer.com/massentry?partner=Crowd&c=`;
        var linkMissingCards = `http://store.tcgplayer.com/massentry?partner=Crowd&c=`;

        var totalValue = 0;
        var totalMissing = 0;
        cards.forEach((card)=>{
            var qty = card.qty ? card.qty : 0;
            var cardAvg = card.avg ? card.avg : 0;
            var have = card.have ? card.have : 0;

            var missQty = qty - have;
            missQty < 0 ? missQty = 0 : null;


            if(qty){
                linkAllCards += `${qty} ${card.name}||`
            }
            if(missQty){
                linkMissingCards += `${missQty} ${card.name}||`
            }


            totalValue += qty * cardAvg;
            totalMissing += missQty * cardAvg;

        })

        totalValue = totalValue.toLocaleString('en-us', {minimumFractionDigits :2});
        totalMissing = totalMissing.toLocaleString('en-us', {minimumFractionDigits :2});


        return <div>
                <div>
                    <a target='_blank' href={linkAllCards}>Buy At TCGPLAYER.com ${totalValue}</a>
                </div>
                {Meteor.user() ? <div><a target='_blank' href={linkMissingCards}>Buy Missing Cards ${totalMissing} </a></div> : null}
                </div>
    }

    cardPriceLink(card){
        if(!card.avg){
            return "ERR"
        }
        return <a  target="_blank" href={`http://shop.tcgplayer.com/magic/product/show?productname=${card.name}&partner=Crowd`}>{card.avg ? card.avg.toLocaleString('en-us', {minimumFractionDigits :2}) : "NULL"}</a>
    }

    cardQty(card){
        if(Meteor.userId()){
            return <span className={card.qty > card.have ? "lessThan" : null}>{`${card.qty}/${card.have}`}</span>
        }
        return card.qty;
    }

    render() {

        this.getCardQty(this.state.DecksData.main);
        var typesSeparated = this.separateCardsByType(this.state.DecksData.main);
        var resultMain = [];
        for(var type in typesSeparated){
            if(typesSeparated[type].array.length == 0) continue;
            resultMain.push(<div className="typeHeader" key={type} >{typesSeparated[type].text} ({typesSeparated[type].array.reduce((a, b)=>{
                return a + b.qty;
            },0)})</div>)
            resultMain.push(
                typesSeparated[type].array.map((card)=>{
                    return  <div className="cardLine" key={card.name}>
                        <div className="cardQtyAndNameWrapper js-imagePopOver" data-name={card.name}>
                            <span className="qty">{this.cardQty(card)}</span><span data-name={card.name}>{card.name}</span>
                        </div>
                        <div className="cardInfo">
                            <div className="manaValue">
                                {
                                    getHTMLFromArray(card.manaCost).map((mana)=>{
                                        return <div key={mana.key} className={"mana " + mana.mana}></div>
                                    })
                                }
                            </div>
                            <div className="priceValue">{this.cardPriceLink(card)}</div>
                        </div>
                    </div>
                })
            )
        }
        this.getCardQty(this.state.DecksData.sideboard);
        var sideboardCards = this.addManaCostToSideboard(this.state.DecksData.sideboard);

        var resultSideboard = sideboardCards.map((card)=>{
            return <div className="cardLine" key={card.name}>
                <div className="cardQtyAndNameWrapper js-imagePopOver" data-name={card.name}>
                    <span className="qty">{this.cardQty(card)}</span><span className="name " data-name={card.name}>{card.name}</span>
                </div>
                <div className="cardInfo">
                    <div className="manaValue">
                        {
                            getHTMLFromArray(card.manaCost).map((mana)=>{
                                return <div key={mana.key} className={"mana " + mana.mana}></div>
                            })
                        }
                    </div>
                    <div className="priceValue">{this.cardPriceLink(card)}</div>
                </div>
            </div>
        })


        return (

            <div className="DeckAggregateContainer">
                <div className="buyPlace">{this.createLink(this.state.DecksData)}</div>
                <div className="mainSide">Main</div>
                <div className="deckBlock">
                    <div className="newDeckColumn">
                        {resultMain.map((obj)=>{
                            return obj;
                        })}
                    </div>
                </div>

                <div className="mainSide">Sideboard</div>
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

