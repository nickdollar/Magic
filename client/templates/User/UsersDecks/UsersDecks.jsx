import React from 'react' ;
import DecksList from "./DecksList/DecksList.jsx";
import AddDeck from './AddDeck/AddDeck';
import DeckEditMethod from './DeckEditMethod/DeckEditMethod';



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
            UsersDeckData : {main : [], sideboard : []},
            main : {name : null, _id : null, qty : 4},
            sideboard : {name : null,  _id : null, qty : 4},
            clear : true,
            changes : false,
            removeState : "Remove"
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
        Meteor.call("getUsersDecksWithCardsInformation", {UsersDecks_id : this.state.UsersDeck_id}, (err, data)=>{
            if(data){
                for(var i = 0 ; i < data.main.length ; i++){
                    Object.assign(data.main[i], data.cardsInfo.find(cardInfo => cardInfo.name == data.main[i].name))
                }
                for(var i = 0 ; i < data.sideboard.length ; i++){
                    Object.assign(data.sideboard[i], data.cardsInfo.find(cardInfo => cardInfo.name == data.sideboard[i].name))
                }
                this.setState({
                    UsersDeckData : data,
                    main : {name : null, _id : null, qty : 4},
                    sideboard : {name : null,  _id : null, qty : 4},
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
        this.state[mainSideboard].name = suggestion.name;
        this.state[mainSideboard]._id = suggestion._id;
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
        this.state.UsersDeckData[mainSideboard][index].qty = parseInt(target.value);
        this.setState({changes : true});
    }

    addCardToDeck(mainSideboard){
        var selectedCard = this.state[mainSideboard];
        if(!selectedCard.name){
            return;
        };

        var UsersDeckData = this.state.UsersDeckData;

        var index = UsersDeckData[mainSideboard].findIndex(cardObj=> cardObj.name == this.state[mainSideboard].name)
        if(index != -1){
            return;
        }
        Meteor.call("getCardsBy_id", {CardsCollectionSimplified_id : selectedCard._id}, (err, data)=>{
            data.qty = selectedCard.qty;
            UsersDeckData[mainSideboard].push(data);

            if(mainSideboard == "main"){
                this.setState({UsersDeckData : UsersDeckData, main : {name : null, _id : null, qty : 4}, clear : !this.state.clear, changes : true});
            }else{
                this.setState({UsersDeckData : UsersDeckData, sideboard : {name : null, _id : null, qty : 4}, clear : !this.state.clear, changes : true});
            }
        })
    }
    removeCardDeck(index, mainSideboard){
        var UsersDeckData = Object.assign({}, this.state.UsersDeckData);
        UsersDeckData[mainSideboard].splice(index, 1);
        this.setState({UsersDeckData : UsersDeckData, changes : true});
    }


    getDeckInfo(){
        var main = [];
        var sideboard = [];
        var UsersDecks_id = this.state.UsersDeckData._id;
        var name = this.state.UsersDeckData.name;

        for(var i = 0; i < this.state.UsersDeckData.main.length; i ++){
            main.push({name : this.state.UsersDeckData.main[i].name, qty : this.state.UsersDeckData.main[i].qty})
        }

        for(var i = 0; i < this.state.UsersDeckData.sideboard.length; i ++){
            sideboard.push({name : this.state.UsersDeckData.sideboard[i].name, qty : this.state.UsersDeckData.sideboard[i].qty})
        }

        return {main : main, sideboard : sideboard, UsersDecks_id : UsersDecks_id, name : name};
    }

    changeName(target){
        this.state.UsersDeckData.name = target.value;
        this.setState({changes : true});


    }

    submitDeck(){
        var deck = this.getDeckInfo();
        Meteor.call("updateUsersDecks", deck, (err, data)=>{
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
            Meteor.call("RemoveDeck", {UsersDeck_id : this.state.UsersDeck_id}, (err, response)=>{
                this.setState({ removeState : "Remove", UsersDeck_id : ""});
            })
        }
    }

    render(){
        var DecksLists = this.filterDecksLists(this.state.DecksLists);
        return(
            <div className="UsersDecksComponent">
                <h3>Yours Decks</h3>
                <AddDeck deckAdded={this.deckAdded.bind(this)}
                         formats={this.state.formats}
                />
                <div className="deckListAndDecksNamesList">
                    <div className="decksCheckBoxes">
                        {this.state.formats.map((format, index)=>{
                            return  <label className="radio-inline" key={format._id} >
                                <input type="checkbox" onChange={()=>this.formatCheck(index)} checked={format.checked} value={format._id}/>{format.name}
                            </label>
                        })}
                    </div>
                        <div className="col-xs-3">
                            <div className="row">
                                <DecksList  DecksData_id={this.state.DecksData_id}
                                            selectADeckHandle={this.selectADeckHandle.bind(this)}
                                            DecksLists={DecksLists}
                                />
                            </div>
                        </div>
                        <div className="col-xs-9">
                            <div className="row">
                                {this.state.UsersDeck_id != "" ? <div className="deckArea">
                                        <div className="btnChangeAndRemoveWrapper">
                                            <div className="btnChange">
                                                <button disabled={!this.state.changes} className="btn"
                                                        onClick={this.submitDeck.bind(this)}>{this.state.changes ? "Submit Changes" : "No Changes"}</button>
                                            </div>
                                            <div className="btnRemove">
                                                <button onClick={this.removeDeck.bind(this)} className="btn">{this.state.removeState}</button>
                                            </div>
                                            <div style={{clear: "both"}}></div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="example-text-input" className="col-2 col-form-label">Name</label>
                                            <div className="col-10">
                                                <input className="form-control" type="text" onChange={(event)=>this.changeName(event.target)} value={this.state.UsersDeckData.name} id="example-text-input"/>
                                            </div>
                                        </div>
                                        <span className="error">{this.state.submitMessage}</span>
                                        <DeckEditMethod UsersDeckData={this.state.UsersDeckData}
                                                        removeCardDeck={this.removeCardDeck.bind(this)}
                                                        changeSelectedCard={this.changeSelectedCard.bind(this)}
                                                        mainSideboardChangeValue={this.mainSideboardChangeValue.bind(this)}
                                                        changeACardQty={this.changeACardQty.bind(this)}
                                                        addCardToDeck={this.addCardToDeck.bind(this)}
                                                        setCardSelected={this.setCardSelected.bind(this)}
                                                        submitDeck={this.submitDeck.bind(this)}
                                                        clear={this.state.clear}
                                        />
                                    </div>
                                    : null
                                }
                            </div>
                        </div>
                    </div>
                </div>
        );
    }
}
