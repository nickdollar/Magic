import React from "react";

export default class Deck extends React.Component{
    constructor() {
        super();
        this.state = {DecksData : {main : [], sideboard : []}, importedDeck : false};
    }

    componentDidUpdate() {
        cardPopoverNames(".js-imagePopOver", true);
    }

    componentDidMount() {
        this.getDecksDataById(this.props.DecksData_id);
        cardPopoverNames(".js-imagePopOver", true);
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
            else if (this.checkType({card : card, type : "land"})){typesSeparated.land.array.push(card)}
            else if (this.checkType({card : card, type : "creature"})){typesSeparated.creature.array.push(card)}
            else if (this.checkType({card : card, type : "artifact"})){typesSeparated.artifact.array.push(card)}
            else if (this.checkType({card : card, type : "enchantment"})){typesSeparated.enchantment.array.push(card)}
            else if (this.checkType({card : card, type : "instant"})){typesSeparated.instant.array.push(card)}
            else if (this.checkType({card : card, type : "planeswalker"})){typesSeparated.planeswalker.array.push(card)}
            else if (this.checkType({card : card, type : "sorcery"})){typesSeparated.sorcery.array.push(card)}
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
            var have = Session.get("cards")[cardList[i].Cards_id];
            if(!have){
                have = 0;
            }
            cardList[i].have = have;
        }
    }

    getDecksDataById(DecksData_id){
        Meteor.call("getDecksDataWithCardsInformation", {DecksData_id : DecksData_id}, (err, response)=>{
            console.log(response);
            if(response){
                for(var i = 0 ; i < response.main.length ; i++){
                    Object.assign(response.main[i], response.cardsInfo.find(cardInfo => cardInfo._id == response.main[i].Cards_id))
                }
                for(var i = 0 ; i < response.sideboard.length ; i++){
                    Object.assign(response.sideboard[i], response.cardsInfo.find(cardInfo => cardInfo._id == response.sideboard[i].Cards_id))
                }

                this.setState({DecksData : response})
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
            var cardAvg = card.avgPrice ? card.avgPrice : 0;
            var have = card.have ? card.have : 0;

            var missQty = qty - have;
            missQty < 0 ? missQty = 0 : null;


            if(qty){
                linkAllCards += `${qty} ${card.Cards_id}||`
            }
            if(missQty){
                linkMissingCards += `${missQty} ${card.Cards_id}||`
            }
            totalValue += qty * cardAvg;
            totalMissing += missQty * cardAvg;

        })

        totalValue = totalValue.toLocaleString('en-us', {minimumFractionDigits :2});
        totalMissing = totalMissing.toLocaleString('en-us', {minimumFractionDigits :2});


        return <div>
                {/*<div>*/}
                    {/*<a target='_blank' href={linkAllCards}>Buy At TCGPLAYER.com ${totalValue}</a>*/}
                {/*</div>*/}
                {/*{Meteor.user() ? <div><a target='_blank' href={linkMissingCards}>Buy Missing Cards ${totalMissing} </a></div> : null}*/}
                </div>
    }

    cardPriceLink(card){
        if(!card.avgPrice){
            return ""
        }
        return <a  target="_blank" href={`http://shop.tcgplayer.com/magic/product/show?productname=${card.Cards_id}&partner=Crowd`}>{card.avgPrice ? card.avgPrice.toLocaleString('en-us', {minimumFractionDigits :2}) : "NULL"}</a>
    }

    cardQty(card){
        if(Meteor.userId()){
            if(card.Cards_id.match(/Plain|Forest|Swamp|Island|Mountain/)){
                return <span  className="card-row__quantity">4/4</span>
            }
            return <span className={`card-row__quantity ${card.qty > card.have ? "card-row__quantity--lessThan" : null}`}>{`${card.qty}/${card.have}`}</span>
        }
        return card.qty;
    }

    importDeck(){
        Meteor.call("importDeckMethod", {DecksData_id : this.props.DecksData_id},()=>{
            this.setState({importedDeck : true});
        });
    }

    getCardRow(card){
        return  <div className="deck-block__card-line" key={card.Cards_id}>
            <div className="card-row" >
                {this.cardQty(card)}
                <div className="card-row__name js-imagePopOver" data-Cards_id={card.Cards_id} data-layout={card.layout} data-names={JSON.stringify(card.names)}>{card.Cards_id}</div>
                <div className="card-row__price">{this.cardPriceLink(card)}</div>
                <div className="card-row__mana">
                    {
                        getHTMLFromArray(card.manaCost).map((mana)=>{
                            if(mana.mana == "//"){
                                return <span key={mana.key} className="card-mana-price__mana-division">//</span>
                            }
                            return <div key={mana.key} className={"mana " + mana.mana}></div>
                        })
                    }
                </div>
            </div>
        </div>
    }


    render() {
        this.getCardQty(this.state.DecksData.main);
        var typesSeparated = this.separateCardsByType(this.state.DecksData.main);
        var resultMain = [];
        for(var type in typesSeparated){
            if(typesSeparated[type].array.length == 0) continue;
            resultMain.push(<div className="deck-block__type-header" key={type} >{typesSeparated[type].text} ({typesSeparated[type].array.reduce((a, b)=>{
                return a + b.qty;
            },0)})</div>)
            resultMain.push(
                typesSeparated[type].array.map((card)=>{
                    return this.getCardRow(card);
                })
            )
        }
        this.getCardQty(this.state.DecksData.sideboard);
        var sideboardCards = this.addManaCostToSideboard(this.state.DecksData.sideboard);

        var resultSideboard = sideboardCards.map((card)=>{
            return this.getCardRow(card);
        })


        return (

            <div className="DeckAggregateContainer deck-aggregate">
                {/*<div className="buy-place">{this.createLink(this.state.DecksData)}</div>*/}
                <div className="btn-group" role="group" aria-label="Basic example">
                    <button className="btn btn-default" disabled={this.state.importedDeck} onClick={this.importDeck.bind(this)}>{this.state.importedDeck ? "Imported" : "Import To Collection"}</button>
                    {/*<button type="button" className="btn btn-default" onClick={this.openModal.bind(this)}>Import</button>*/}
                </div>
                <div className="deck-aggregate__main-side">Main</div>
                <div className="deck-block">
                    <div className="deck-block__columns">
                        {resultMain.map((obj)=>{
                            return obj;
                        })}
                    </div>
                </div>
                <div className="deck-aggregate__main-side">Sideboard</div>
                <div className="deck-block__columns">
                    <div className="block__columns">
                        {resultSideboard.map((obj)=>{
                            return obj;
                        })}
                    </div>
                </div>
            </div>
        )
    }
}

