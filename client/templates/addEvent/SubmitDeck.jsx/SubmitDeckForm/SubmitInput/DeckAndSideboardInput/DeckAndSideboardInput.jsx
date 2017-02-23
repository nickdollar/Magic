import React from 'react' ;
import DeckListContainer from "./DeckList/DeckListContainer.jsx";
import TextDeck from "./TextDeck/TextDeck.jsx";



export default class DeckAndSideboardInput extends React.Component{
    constructor(props){
        super();
        this.state = {
            textOrList : "list",
            deck : props.deck,
            event : props.event,
            submitMessage : "",
            newCards : []
        }

    }

    onChangeTextOrList(e){
        this.setState({textOrList : e.target.value});
    }

    setDeck(deck){
        var temp = Object.assign({}, deck);
        var mainSideTemp = [].concat(temp.main, temp.sideboard)
        var cardsNames = mainSideTemp.map((card)=>{
           return card.name;
        });
        this.subscribeToNewCards(cardsNames);
        this.setState({deck : temp})
    }
    componentWillReceiveProps(nextProps){
        if(nextProps != this.state.deck){
            var deckTemp = Object.assign({}, nextProps.deck)
            this.setState({deck : deckTemp});
        }
    }

    addCardToDeck(e){
        var cardName = $(e.target).closest(".addToMainButtonWrapper").siblings(".js-cardNameInput").find(".js-select2").val();
        var cardQuantity = $(e.target).closest(".addToMainButtonWrapper").siblings(".quantityInput").val();
        var mainSideboard = e.target.getAttribute("data-mainSideboard");
        this.subscribeToNewCards([cardName]);
        if(cardName.length == 0){
            return;
        };

        cardName = cardName.toTitleCase();

        if(this.state.deck[mainSideboard].findIndex((card)=>{
                return cardName == card.name
            }) != -1){
            return
        }

        var deck = Object.assign({}, this.state.deck);

        cardName = cardName.toTitleCase()

        deck[mainSideboard].push({name : cardName, quantity : parseInt(cardQuantity)});

        this.setState({
            deck : deck
        })
    }

    changeCardDeck(e){
        var cardName = e.target.getAttribute("data-name");
        var mainSideboard = e.target.getAttribute("data-mainSideboard");

        if(e.target.value < 0) return;
        var deck = Object.assign({}, this.state.deck);

        var itemIndex = deck[mainSideboard].findIndex((obj)=>{
            return cardName == obj.name
        });

        deck[mainSideboard][itemIndex].name = e.params.args.data.id;
        this.setState({
            deck : deck
        })
    }

    removeCardDeck(e){

        var name = e.currentTarget.getAttribute("data-name");
        var mainSideboard = e.currentTarget.getAttribute("data-mainSideboard");

        var tempArray = Object.assign({}, this.state.deck);
        if(mainSideboard=="main")
        {
            var index = tempArray.main.findIndex((card)=>{
                return name  == card.name;
            })

            tempArray.main.splice(index, 1);

            this.setState({deck : tempArray });
        }
        if(mainSideboard=="sideboard")
        {
            var index = tempArray.sideboard.findIndex((card)=>{
                return name  == card.name;
            })

            tempArray.sideboard.splice(index, 1);

            this.setState({deck : tempArray });
        }
    }

    updateQuantity(e){
        if(parseInt(e.target.value) < 0){
            return
        }
        var cardName = e.target.getAttribute("data-name");
        var mainSideboard = e.target.getAttribute("data-mainSideboard");

        var value = parseInt(e.target.value);

        if(mainSideboard=="main")
        {
            var tempArray = this.state.deck.main.concat();
            var index = tempArray.findIndex((card)=>{
                return cardName == card.name;
            })
            if(parseInt(value)< 0){

            }
            tempArray[index].quantity = value;
            this.setState({main : tempArray});
        }

        if(mainSideboard=="sideboard")
        {
            var tempArray = this.state.deck.sideboard.concat();
            var index = tempArray.findIndex((card)=>{
                return cardName == card.name;
            })
            tempArray[index].quantity = parseInt(value);
            this.setState({sideboard : tempArray});
        }

    }

    subscribeToNewCards(cardsNames){

        cardsNames.forEach((card)=>{
            var index = this.state.newCards.findIndex((cardName)=>{
                return card == cardName;
            })

            if(index == -1){
                this.state.newCards.push(cardsNames);
            }
        })

        Meteor.subscribe("cardsFromArray", this.state.newCards, {
            onReady: ()=>{
                this.forceUpdate();
            }
        });
    }

    submitDeck(){
        var submitDeck = Object.assign({}, this.state.deck, this.props.event);
        Meteor.call("addALGSDecksData", submitDeck, (err, data)=>{
            this.setState({submitMessage : data})
        });
    }

    render(){
        var textOrList;
        if(this.state.textOrList == "text"){
            textOrList = <div>
                            <TextDeck   setDeck={this.setDeck.bind(this)}
                                        deck={this.state.deck}
                            />
                        </div>
        }else{
            textOrList = <DeckListContainer
                deck={this.state.deck}
                event={this.state.event}
                addCardToDeck={this.addCardToDeck.bind(this)}
                changeCardDeck={this.changeCardDeck.bind(this)}
                updateQuantity={this.updateQuantity.bind(this)}
                submitDeck={this.submitDeck.bind(this)}
                removeCardDeck={this.removeCardDeck.bind(this)}
                submitMessage={this.state.submitMessage}
            />
        }

        return (
            <div className="form-group">
                <div onChange={this.onChangeTextOrList.bind(this)}>
                    <label className="form-check-inline">
                        <input className="form-check-input" type="radio" name="listOrText" id="inlineRadio2" value="list" defaultChecked/> List
                    </label>
                    <label className="form-check-inline">
                        <input className="form-check-input" type="radio" name="listOrText" id="inlineRadio1" value="text" /> Text
                    </label>
                </div>
                {textOrList}
            </div>
        )
    }
}

