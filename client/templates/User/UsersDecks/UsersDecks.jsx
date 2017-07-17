import React from 'react' ;
import DecksList from "./DecksList/DecksList.jsx";
import AddDeck from './AddDeck/AddDeck';
import DeckEditMethod from './DeckEditMethod/DeckEditMethod';
import DeckRecords from "./DeckRecords/DeckRecords.jsx";
import Select from "react-select";
import 'react-select/dist/react-select.css';
import ModalFirstPage from "/client/dumbReact/Modal/ModalFirstPage.jsx";
import ImportUserDeck from "./ImportUserDeck/ImportUserDeck.jsx";

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
            main : {Cards_id : null, qty : 4},
            sideboard : {Cards_id : null, qty : 4},
            clear : true,
            changes : false,
            removeState : "Remove",
            showImportUserDeckModal : false
        }
    }

    getFormats(){
        return this.state.formats.map(format=>format.value);
    }

    mainSideboardChangeValue(target, mainSideboard){
        this.state[mainSideboard].qty = parseInt(target.value);
    }
    getSelectedDeck(){
        Meteor.call("getUsersDecksWithCardsInformationMethod", {UsersDecks_id : this.state.UsersDeck_id}, (err, response)=>{
            if(response){
                for(var i = 0 ; i < response.main.length ; i++){
                    Object.assign(response.main[i], response.cardsInfo.find(cardInfo => cardInfo._id == response.main[i].Cards_id))
                }

                for(var i = 0 ; i < response.sideboard.length ; i++){
                    Object.assign(response.sideboard[i], response.cardsInfo.find(cardInfo => cardInfo._id == response.sideboard[i].Cards_id))
                }

                this.setState({
                    UsersDeck : response,
                    main : {Cards_id : null, qty : 4},
                    sideboard : {Cards_id : null, qty : 4},
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
        this.state[mainSideboard].Cards_id = suggestion;
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
        if(!selectedCard.Cards_id){return;};
        var UsersDeck = Object.assign({}, this.state.UsersDeck)

        var index = UsersDeck[mainSideboard].findIndex(cardObj=> cardObj.Cards_id.match(new RegExp(`^${this.state[mainSideboard].Cards_id}$`, "i")));
        if(index != -1){return;}

        Meteor.call("getCardsBy_idMethod", {CardsSimple_id : selectedCard.Cards_id}, (err, response)=>{
            response.qty = selectedCard.qty;
            response.Cards_id = response._id;
            UsersDeck[mainSideboard].push(response);
            if(mainSideboard == "main"){
                this.setState({UsersDeck : UsersDeck, main : {Cards_id : null, qty : selectedCard.qty}, clear : !this.state.clear, changes : true});
            }else{
                this.setState({UsersDeck : UsersDeck, sideboard : {Cards_id : null, qty : selectedCard.qty}, clear : !this.state.clear, changes : true});
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
        console.log(this.state.UsersDeck);
        for(var i = 0; i < this.state.UsersDeck.main.length; i ++){
            main.push({Cards_id : this.state.UsersDeck.main[i].Cards_id, qty : this.state.UsersDeck.main[i].qty})
        }

        for(var i = 0; i < this.state.UsersDeck.sideboard.length; i ++){
            sideboard.push({Cards_id : this.state.UsersDeck.sideboard[i].Cards_id, qty : this.state.UsersDeck.sideboard[i].qty})
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

    updateQuantity({name, value}){

    }

    makePublic(checked){

        Meteor.call("makePublicMethod", {UsersDecks_id : this.state.UsersDeck_id, makePublic : checked}, (err, method)=>{});
        var UsersDeck = Object.assign( {}, this.state.UsersDeck, {public : checked});
        this.setState({UsersDeck : UsersDeck});
    }

    importDeck({main, sideboard}){

        var cards = main.map(card=>card.Cards_id);
        cards = cards.concat(sideboard.map(card=>card.Cards_id));

        var uniqueCards = cards.filter(function(item, pos) {
            return cards.indexOf(item) == pos;
        })




        Meteor.call("getCardsInfoFromCards_id", {cards : uniqueCards}, (err, response)=>{
            for(var i = 0 ; i < main.length ; i++){
                Object.assign(main[i], response.find(cardInfo => cardInfo._id.match(new RegExp(`^${main[i].Cards_id}$`, "i"))))
            }

            for(var i = 0 ; i < sideboard.length ; i++){
                Object.assign(sideboard[i], response.find(cardInfo => cardInfo._id.match(new RegExp(`^${sideboard[i].Cards_id}$`, "i"))))
            }

            var UsersDeck = Object.assign({}, this.state.UsersDeck, {main : main, sideboard : sideboard})

            this.setState({
                UsersDeck : UsersDeck,
                main : {Cards_id : null, qty : 4},
                sideboard : {Cards_id : null, qty : 4},
                clear : true,
                changes : true,
            })
        })

    }

    handlerHideDeckModal(){
        this.setState({showImportUserDeckModal : false})
    }

    handlerShowImportUserDeckModal(){
        this.setState({showImportUserDeckModal : true})
    }


    render(){
        var DecksLists = this.filterDecksLists(this.state.DecksLists);
        return(
            <div className="UsersDecksComponent">
                {/*<h3>Yours Decks</h3>*/}
                <AddDeck deckAdded={this.deckAdded.bind(this)}
                         formats={this.state.formats}
                />
                <div className="deckListAndDecksNamesList">
                    <div className="decksCheckBoxes">
                        {this.state.formats.map((format, index)=>{
                            return  <label className="radio-inline" key={format._id}>
                                <input type="checkbox" onChange={()=>this.formatCheck(index)} checked={format.checked} value={format._id}/>{format.name}
                            </label>
                        })}
                    </div>
                    <div>
                        <Select
                            options={DecksLists}
                            onChange={this.getDeckValue.bind(this)}
                            labelKey="name"
                            optionRenderer={this.optionRenderer}
                        />
                    </div>
                        {this.state.UsersDeck_id != "" ? <div className="deckArea">
                                <div className="btnChangeAndRemoveWrapper">
                                    <ModalFirstPage
                                        showModal={this.state.showImportUserDeckModal}
                                        handleHideModal={this.handlerHideDeckModal.bind(this)}
                                    >
                                        <ImportUserDeck UsersDecks_id={this.state.UsersDeck_id}
                                                        importDeck={this.importDeck.bind(this)}
                                        />
                                    </ModalFirstPage>


                                    <div className="btn-group" role="group" aria-label="Basic example">
                                        <button disabled={!this.state.changes} className={`btn ${this.state.changes ? "btn-info" : "btn-default"}`}
                                                onClick={this.submitDeck.bind(this)}>{this.state.changes ? "Submit Changes" : "No Changes"}
                                        </button>
                                        <button onClick={this.handlerShowImportUserDeckModal.bind(this)} className="btn btn-default">{"Import"}</button>
                                        <button onClick={this.removeDeck.bind(this)} className="btn btn-default">{this.state.removeState}</button>
                                    </div>
                                    {/*<div className="btnChange">*/}
                                        {/*<button disabled={!this.state.changes} className={`btn ${this.state.changes ? "btn-info" : null}`}*/}
                                                {/*onClick={this.submitDeck.bind(this)}>{this.state.changes ? "Submit Changes" : "No Changes"}*/}
                                        {/*</button>*/}
                                    {/*</div>*/}

                                    <div className="btnRemove">
                                        <button onClick={this.removeDeck.bind(this)} className="btn">{this.state.removeState}</button>
                                    </div>
                                    <div style={{clear: "both"}}></div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="example-text-input" className="col-2 col-form-label">Name</label>
                                    <div className="col-10">
                                        <input className="form-control" type="text" onChange={(event)=>this.changeName(event.target)} value={this.state.UsersDeck.name} id="example-text-input"/>
                                    </div>
                                </div>
                                <span className="error">{this.state.submitMessage}</span>
                                <div className="publicLinkWrapper">
                                    <span className="publicCheckbox">
                                        <label>
                                            <input type="checkbox" value={true} onClick={(e)=>{this.makePublic(e.target.checked)}} checked={this.state.UsersDeck.public ? true : false}/>{this.state.UsersDeck.public} Make Public
                                        </label>
                                    </span>
                                    <span className="publicLink">
                                        <a href={`/user/usersdecks/${this.state.UsersDeck_id}`}>Link</a>
                                    </span>
                                </div>
                                <DeckEditMethod UsersDeck={this.state.UsersDeck}
                                                removeCardDeck={this.removeCardDeck.bind(this)}
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
                            : null
                        }
                    </div>
                </div>
        );
    }
}
