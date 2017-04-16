import React from "react";

export default class Deck extends React.Component{
    constructor() {
        super();
        this.state = {DecksData : {main : [], sideboard : []}};
    }

    componentDidMount() {
        this.getDecksDataById(this.props.DecksData_id);
        cardPopover(".js-imagePopOver");
    }


    componentDidUpdate() {
        cardPopover(".js-imagePopOver");
    }

    separateCardsByTypeAddManaCost(main){
        var typesSeparated = {
            null : {array : [], text : "Wrong Name"},
            creature : {array : [], text : "Creature"},
            sorcery : {array : [], text : "Sorcery"},
            instant : {array : [], text : "Instant"},
            planeswalker : {array : [], text : "Planeswalker"},
            artifact : {array : [], text : "Artifact"},
            enchantment : {array : [], text : "Enchantment"},
            land : {array : [], text : "Land"},
        };

        var tempMain = main.concat();
        tempMain.forEach((card)=>{
            var cardQuery = CardsData.findOne({name : card.name});

            var cardComplete;

            if(cardQuery){
                cardComplete = Object.assign(card, {manaCost : cardQuery.manaCost});
            }else{
                cardComplete = card;
            }
            if(!cardQuery){typesSeparated.null.array.push(cardComplete)}
            else if (cardQuery.land == true){typesSeparated.land.array.push(cardComplete)}
            else if(cardQuery.artifact == true && cardQuery.creature == false){typesSeparated.artifact.array.push(cardComplete)}
            else if (cardQuery.creature == true){typesSeparated.creature.array.push(cardComplete)}
            else if (cardQuery.enchantment == true && cardQuery.creature == false && cardQuery.artifact == false){typesSeparated.enchantment.array.push(cardComplete)}
            else if (cardQuery.instant == true){typesSeparated.instant.array.push(cardComplete)}
            else if (cardQuery.planeswalker == true){typesSeparated.planeswalker.array.push(cardComplete)}
            else if (cardQuery.sorcery == true){typesSeparated.sorcery.array.push(cardComplete)}
        })
        return typesSeparated;
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
        Meteor.call("getDecksDataBy_id", DecksData_id, (err, data)=>{
            if(data){
                this.setState({DecksData : data})
            }
        });
    }

    addManaCostToSideboard(cards){

        var sideboard = [];
        var cardsTemp = cards.concat();
        cardsTemp.forEach((card)=>{
            var cardQuery = CardsData.findOne({name : card.name});
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

    componentWillReceiveProps(nextProps){
        if(nextProps.DecksData_id != this.props.DecksData_id){
            this.getDecksDataById(nextProps.DecksData_id);
        }
    }

    shouldComponentUpdate(nextProps, nextState){
        if(nextProps.listLoading){
            return false;
        }
        return true;
    }

    createLink(){
        var link = `http://store.tcgplayer.com/massentry?partner=CrowdMtG&c=`;

        this.state.DecksData.main.forEach((card)=>{
            link += `${card.qty} ${card.name}||`
        });
        this.state.DecksData.sideboard.forEach((card)=>{
            link += `${card.qty} ${card.name}||`
        });

        return <a href={link}>Buy At TCGPLAYER.com $555.55</a>

    }

    cardPriceLink(cardName){
        return <a  target="_blank" href={`http://shop.tcgplayer.com/magic/product/show?productname=${cardName}&partner=CrowdMtG`}>5.55</a>

    }

    cardQty(card){
        if(this.props.currentUser){
            return <span className={card.qty > card.have ? "lessThan" : null}>{`${card.qty}/${card.have}`}</span>
        }
        return card.qty;
    }

    render() {
        if(this.props.listLoading){return <div>Loading...</div>};


        this.getCardQty(this.state.DecksData.main);
        var typesSeparated = this.separateCardsByTypeAddManaCost(this.state.DecksData.main);


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
                                            getHTMLColors(card).map((mana)=>{
                                                return <div key={mana.key} className={"mana " + mana.mana}></div>
                                            })
                                        }
                                    </div>
                                    <div className="priceValue">{this.cardPriceLink(card.name)}</div>
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
                            getHTMLColors(card).map((mana)=>{
                                return <div key={mana.key} className={"mana " + mana.mana}></div>
                            })
                        }
                    </div>
                    <div className="priceValue">{this.cardPriceLink(card.name)}</div>
                </div>
            </div>
        })

           return (
            <div className="DeckContainer">
                <div className="buyPlace">{this.createLink()}</div>
                <span ref={"error"} className="error"></span>
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

