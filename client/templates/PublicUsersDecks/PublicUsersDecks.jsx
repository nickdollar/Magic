import React from 'react' ;
import 'react-select/dist/react-select.css';
import DeckProps from "/client/dumbReact/DeckProps/DeckProps.jsx";
import PublicUsersDecksResults from "./PublicUsersDecksRecords/PublicUsersDecksRecords.jsx";

export default class UsersDecks extends React.Component {
    constructor() {
        super();
        this.state = {UsersDeck : {}}
    }

    getDeckData(){
        Meteor.call("getAUsersDecksWithCardsInformationMethod", {UsersDecks_id : FlowRouter.getParam("UsersDecks_id")}, (err, response)=>{
            if(response){
                for(var i = 0 ; i < response.main.length ; i++){
                    Object.assign(response.main[i], response.cardsInfo.find(cardInfo => cardInfo._id == response.main[i].Cards_id))
                }
                for(var i = 0 ; i < response.sideboard.length ; i++){
                    Object.assign(response.sideboard[i], response.cardsInfo.find(cardInfo => cardInfo._id == response.sideboard[i].Cards_id))
                }

                this.setState({UsersDeck : response})
            }
        })
    }


    componentDidMount(){
        this.getDeckData();
    }

    render(){
        if(isObjectEmpty(this.state.UsersDeck)){
            return <div></div>
        }
        return(
            <div className="PublicUsersDecksComponent">
                <button className="btn btn-default" onClick={this.getDeckData.bind(this)}>Refresh Deck</button>
                <div className="usersDeckName">
                    <h2>{this.state.UsersDeck.name}</h2>
                </div>
                <DeckProps
                    DeckData={this.state.UsersDeck}
                />
                <PublicUsersDecksResults UsersDeck={this.state.UsersDeck}/>
            </div>
        );
    }
}
