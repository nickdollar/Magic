import React from 'react' ;
import 'react-select/dist/react-select.css';
import DeckProps from "/client/dumbReact/DeckProps/DeckProps.jsx";


export default class UsersDecks extends React.Component {
    constructor() {
        super();
        this.state = {DeckData : {}}
    }

    getDeckData(){
        Meteor.call("getAUsersDecksWithCardsInformationMethod", {UsersDecks_id : FlowRouter.getParam("UsersDecks_id")}, (err, response)=>{
            console.log(response);
            if(response){
                for(var i = 0 ; i < response.main.length ; i++){
                    Object.assign(response.main[i], response.cardsInfo.find(cardInfo => cardInfo._id == response.main[i].Cards_id))
                }
                for(var i = 0 ; i < response.sideboard.length ; i++){
                    Object.assign(response.sideboard[i], response.cardsInfo.find(cardInfo => cardInfo._id == response.sideboard[i].Cards_id))
                }

                this.setState({DeckData : response})
            }
        })
    }


    componentDidMount(){
        this.getDeckData();
    }

    render(){
        return(
            <div className="PublicUsersDecksComponent">
                <div className="usersDeckName">
                    <h2>{this.state.DeckData.name}</h2>
                </div>
                <DeckProps
                    DeckData={this.state.DeckData}
                />
            </div>
        );
    }
}
