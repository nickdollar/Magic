import React from 'react' ;
import DecksList from "./DecksList/DecksList.jsx";
import AddDeck from './AddDeck/AddDeck';
import DeckEditMethod from './DeckEditMethod/DeckEditMethod';
import DeckRecords from "./DeckRecords/DeckRecords.jsx";
import Select from "react-select";
import 'react-select/dist/react-select.css';


export default class UsersDecks extends React.Component {
    constructor() {
        super();

        var formats = Formats.find({active : 1}).map(format =>{
            return Object.assign(format, {checked : true})
        });
        this.state = {
            formats: formats,
            DecksLists : [],
            UsersDeck_id : "",
            UsersDeck : {decks : [], main : [], sideboard : []},
            main : {_id : null, qty : 4},
            sideboard : {_id : null, qty : 4},
            clear : true,
            changes : false,
            removeState : "Remove",
        }
    }

    getFormats(){
        return this.state.formats.map(format=>format.value);
    }

    mainSideboardChangeValue(target, mainSideboard){
        this.state[mainSideboard].qty = parseInt(target.value);
    }

    changeSelectedCard(target){
        var mainSideboard = target.getAttribute("data-mainSideboard");
        var mainSideboardObj = Object.assign({}, this.state[mainSideboard]);
        mainSideboardObj._id = $(target).val();
        mainSideboardObj.name = $(target).text();

        if(mainSideboard == "main"){
            this.setState({main : mainSideboardObj})
        }else{
            this.setState({main : mainSideboardObj})
        }
    }

    getSelectedDeck(){
        Meteor.call("getUsersDecksWithCardsInformationMethod", {UsersDecks_id : this.state.UsersDeck_id}, (err, response)=>{
            if(response){
                for(var i = 0 ; i < response.main.length ; i++){
                    Object.assign(response.main[i], response.cardsInfo.find(cardInfo => cardInfo._id == response.main[i]._id))
                }

                for(var i = 0 ; i < response.sideboard.length ; i++){
                    Object.assign(response.sideboard[i], response.cardsInfo.find(cardInfo => cardInfo._id == response.sideboard[i]._id))
                }

                this.setState({
                    UsersDeck : response,
                    main : {_id : null, qty : 4},
                    sideboard : {_id : null, qty : 4},
                    clear : true,
                    changes : false,
                })
            }
        });
    }

    getUsersDeckList(){
        var params = {format : this.getFormats()}
        Meteor.call("getUsersDecksFromUser", params, (err, response)=>{
            this.setState({DecksLists : response});
        })
    }

    setCardSelected({suggestion, mainSideboard}) {
        this.state[mainSideboard]._id = suggestion;
    }

    formatCheck(index){
        var formats = this.state.formats.concat();
        formats[index].checked = !formats[index].checked
        this.setState({formats : formats})
    }

    componentDidMount(){
        this.getUsersDeckList();
    }

    selectADeckHandle(UsersDeck_id){
        this.state.UsersDeck_id = UsersDeck_id;
        this.getSelectedDeck();
    }
    changeACardQty(target, index, mainSideboard){
        this.state.UsersDeck[mainSideboard][index].qty = parseInt(target.value);
        this.setState({changes : true});
    }

    addCardToDeck(mainSideboard){
        var selectedCard = this.state[mainSideboard];
        if(!selectedCard._id){return;};
        var UsersDeck = this.state.UsersDeck;

        var index = UsersDeck[mainSideboard].findIndex(cardObj=> cardObj._id.match(new RegExp(`^${this.state[mainSideboard]._id}$`, "i")));
        if(index != -1){return;}

        Meteor.call("getCardsBy_idMethod", {CardsSimple_id : selectedCard._id}, (err, response)=>{
            response.qty = selectedCard.qty;

            UsersDeck[mainSideboard].push(response);
            if(mainSideboard == "main"){
                this.setState({UsersDeck : UsersDeck, main : {_id : null, qty : selectedCard.qty}, clear : !this.state.clear, changes : true});
            }else{
                this.setState({UsersDeck : UsersDeck, sideboard : {_id : null, qty : selectedCard.qty}, clear : !this.state.clear, changes : true});
            }
        })
    }

    removeCardDeck(index, mainSideboard){
        var UsersDeck = Object.assign({}, this.state.UsersDeck);
        UsersDeck[mainSideboard].splice(index, 1);
        this.setState({UsersDeck : UsersDeck, changes : true});
    }
    getDeckInfo(){
        var main = [];
        var sideboard = [];
        var UsersDecks_id = this.state.UsersDeck._id;
        var name = this.state.UsersDeck.name;
        for(var i = 0; i < this.state.UsersDeck.main.length; i ++){
            main.push({_id : this.state.UsersDeck.main[i]._id, qty : this.state.UsersDeck.main[i].qty})
        }
        for(var i = 0; i < this.state.UsersDeck.sideboard.length; i ++){
            sideboard.push({_id : this.state.UsersDeck.sideboard[i]._id, qty : this.state.UsersDeck.sideboard[i].qty})
        }
        return {main : main, sideboard : sideboard, UsersDecks_id : UsersDecks_id, name : name};
    }

    changeName(target){
        this.state.UsersDeck.name = target.value;
        this.setState({changes : true});
    }

    submitDeck(){
        var deck = this.getDeckInfo();
        Meteor.call("updateUsersDecksMethod", deck, (err, data)=>{
            var DecksLists = this.state.DecksLists.concat();
            var index = DecksLists.findIndex(deckObj => deckObj._id == deck.UsersDecks_id);
            DecksLists[index].name = deck.name;
            this.setState({changes : false})
        })
    }

    filterDecksLists(DecksLists){
        return DecksLists.filter((deck)=>{
            var foundFormat = this.state.formats.find(format => {
                return format._id == deck.Formats_id
            });
            return foundFormat.checked;
        })
    }
    deckAdded(){
        this.getUsersDeckList();
    }

    removeDeck(){
        if(this.state.removeState == "Remove"){
            this.setState({ removeState : "Confirm"});
        }else if(this.state.removeState == "Confirm"){
            Meteor.call("RemoveDeckMethod", {UsersDeck_id : this.state.UsersDeck_id}, (err, response)=>{
                var DecksLists = this.state.DecksLists.concat();
                DecksLists = DecksLists.filter((deck)=>{
                    if(deck._id != this.state.UsersDeck_id){
                        return true;
                    }
                    return false;
                })
                this.setState({ removeState : "Remove", UsersDeck_id : "", DecksLists : DecksLists});
            })
        }
    }

    getDeckValue(val){
        this.selectADeckHandle(val._id)
    }

    optionRenderer(val, val2){
        return `${val.name} - ${Formats.findOne({_id : val.Formats_id}).name}`;
    }

    updateQuantity({name, value,}){

    }

    render(){
        var DecksLists = this.filterDecksLists(this.state.DecksLists);
        return(
            <div className="PublicUsersDecksComponent">
               <div className="deckListAndDecksNamesList">
                    <DeckEditMethod UsersDeck={this.state.UsersDeck}
                                    removeCardDeck={this.removeCardDeck.bind(this)}
                                    changeSelectedCard={this.changeSelectedCard.bind(this)}
                                    mainSideboardChangeValue={this.mainSideboardChangeValue.bind(this)}
                                    changeACardQty={this.changeACardQty.bind(this)}
                                    addCardToDeck={this.addCardToDeck.bind(this)}
                                    setCardSelected={this.setCardSelected.bind(this)}
                                    submitDeck={this.submitDeck.bind(this)}
                                    clear={this.state.clear}
                    />
                    <DeckRecords UsersDeck={this.state.UsersDeck}
                                 updateQuantity={this.updateQuantity}
                                 getSelectedDeck={this.getSelectedDeck.bind(this)}
                    />
                </div>
            </div>
        );
    }
}
