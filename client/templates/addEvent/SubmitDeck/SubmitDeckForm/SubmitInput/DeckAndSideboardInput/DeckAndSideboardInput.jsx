import React from 'react' ;
import DeckList from "./DeckList/DeckList.jsx";
import TextDeck from "./TextDeck/TextDeck.jsx";
import ImportByDeckContainer from './ImportByArchetype/ImportByArchetype.jsx' ;
import ImportFromUserDecks from './ImportFromUserDeck/ImportFromUserDeck.jsx';



export default class DeckAndSideboardInput extends React.Component{
    constructor(props){
        super();
        this.state = {
            DecksData_id : "",
            textOrList : "list",
            UsersDeckData : props.UsersDeckData,
            event : props.event,
            submitMessage : "",
            main : {_id : null, qty : 4},
            sideboard : {_id : null, qty : 4},
            qty : {main : 0, sideboard : 0},
            changes : false
        }
    }

    setDeck({deck : deck}){
        this.setDeckFromText(deck);
    }

    componentWillReceiveProps(nextProps){
        if(nextProps != this.state.UsersDeckData){
            this.setDeckFromText(Object.assign({}, nextProps.UsersDeckData));
        }
    }

    onChangeTextOrList(e){
        this.setState({textOrList : e.target.value});
    }

    setDeckFromText(UsersDeckData){

        var UsersDeckData = Object.assign({}, UsersDeckData);
        var arrayOptions = ["main", "sideboard"];
        for(var i = 0; i < arrayOptions.length; i++){
            UsersDeckData[arrayOptions[i]] = UsersDeckData[arrayOptions[i]].filter((item, pos)=>{
                var index = UsersDeckData[arrayOptions[i]].findIndex((card)=>{
                    return item._id == card._id;
                });
                return index == pos;
            });
        }

        var mainSideTemp = [].concat(UsersDeckData.main, UsersDeckData.sideboard);

        var cardsArray = mainSideTemp.map((card)=>{
           return card.name;
        })

        cardsArray = cardsArray.filter((item, pos)=>{
            return cardsArray.indexOf(item) == pos;
        });
        Meteor.call("getCardsFromArrayMethod", {cardsArray : cardsArray}, (err, response)=>{
            var qty = {main : 0, sideboard : 0};
            for(var i = 0; i < arrayOptions.length; i++){
                for(var j = 0; j < UsersDeckData[arrayOptions[i]].length; j++){
                    var foundObj = response.find((card)=>{
                        var cardRegex = new RegExp(`^${UsersDeckData[arrayOptions[i]][j].name}$`, 'i');
                        return card._id.match(cardRegex);
                    });
                    if(foundObj){
                        qty[arrayOptions[i]] += UsersDeckData[arrayOptions[i]][j].qty;
                        Object.assign(UsersDeckData[arrayOptions[i]][j], foundObj);
                    }
                }
            }
            this.setState({UsersDeckData : UsersDeckData, qty : qty})
        })
    }


    componentWillReceiveProps(nextProps){
        if(nextProps != this.state.UsersDeckData){
            var deckTemp = Object.assign({}, nextProps.UsersDeckData)
            this.setState({UsersDeckData : deckTemp});
        }
    }

    submitDeck(){
        var submitDeck = Object.assign({}, this.state.UsersDeckData, this.props.event, {DecksData_id : this.state.DecksData_id});
        var options = ["main", "sideboard"];
        for(var i = 0; i < options.length; i++){
            submitDeck[options[i]] = submitDeck[options[i]].map((card)=>{
                return {name : card._id, qty : card.qty}
            })
        }

        Meteor.call("addALGSDecksData", {submitDeck : submitDeck}, (err, data)=>{
            this.setState({submitMessage : data.message, DecksData_id : data.DecksData_id, changes : false})
        });
    }

    removeCardDeck(index, mainSideboard){
        var UsersDeckData = Object.assign({}, this.state.UsersDeckData);

        if(UsersDeckData[mainSideboard][index]._id){
            this.state.qty[mainSideboard] -= UsersDeckData[mainSideboard][index].qty;
        }
        UsersDeckData[mainSideboard].splice(index, 1);
        this.setState({UsersDeckData : UsersDeckData, changes : true});
    }

    mainSideboardChangeValue(target, mainSideboard){
        var qty = parseInt(target.value);
        if(isNaN(qty)){
            qty = 0;
        }
        this.state[mainSideboard].qty = qty;
    }

    changeACardQty(target, index, mainSideboard){
        if(this.state.UsersDeckData[mainSideboard][index]._id){
            var qty = parseInt(target.value);
            if(isNaN(qty)){qty = 0;}
            this.state.qty[mainSideboard] -= this.state.UsersDeckData[mainSideboard][index].qty;
            this.state.UsersDeckData[mainSideboard][index].qty = qty;
            this.state.qty[mainSideboard] += qty;
            this.setState({changes : true});
        }
    }

    addCardToDeck(mainSideboard){
        var selectedCard = this.state[mainSideboard];
        if(!selectedCard._id){
            return;
        };

        var UsersDeckData = this.state.UsersDeckData;

        var index = UsersDeckData[mainSideboard].findIndex(cardObj=> cardObj._id == this.state[mainSideboard]._id)
        if(index != -1){
            return;
        }

        Meteor.call("getCardsBy_idMethod", {CardsSimple_id : selectedCard._id}, (err, response)=>{
            response.qty = selectedCard.qty;
            UsersDeckData[mainSideboard].push(response);
            if(response._id){
                this.state.qty[mainSideboard] += selectedCard.qty;
            }
            var msObject = {};
            msObject[mainSideboard] = {_id : null, qty : 4};
            this.setState(Object.assign({UsersDeckData : UsersDeckData, clear : !this.state.clear, changes : true}, msObject));
        })
    }

    setCardSelected({suggestion, mainSideboard}) {
        this.state[mainSideboard]._id = suggestion._id;
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

    render(){
        var textOrList;
        if(this.state.textOrList == "text"){
            textOrList = <div>
                            <TextDeck   setDeckFromText={this.setDeckFromText.bind(this)}
                                        UsersDeckData={this.state.UsersDeckData}
                            />
                        </div>
        }else{
            textOrList = <div>
                        <div>
                            <span><button className="btn" disabled={this.submitDeckState()} onClick={this.submitDeck.bind(this)}>{this.deckState()}</button></span>
                            <span>{this.state.submitMessage}</span>
                        </div>

                            <DeckList    UsersDeckData={this.state.UsersDeckData}
                                         qty={this.state.qty}
                                         submitted={this.state.submitted}
                                         removeCardDeck={this.removeCardDeck.bind(this)}
                                         mainSideboardChangeValue={this.mainSideboardChangeValue.bind(this)}
                                         changeACardQty={this.changeACardQty.bind(this)}
                                         addCardToDeck={this.addCardToDeck.bind(this)}
                                         setCardSelected={this.setCardSelected.bind(this)}
                            />
            </div>
        }

        return (
            <div className="DeckAndSideboardInputComponent">
                <ImportByDeckContainer setDeck={this.setDeck.bind(this)}
                                       event={this.props.event}
                />
                <ImportFromUserDecks setDeck={this.setDeck.bind(this)}
                                     event={this.props.event}
                />
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
            </div>
        )
    }
}

