import React from 'react' ;
import Moment from "moment";
export default class  extends React.Component {
    constructor(){
        super();

    }


    eventInfo(event){
        return  <div className="left">
                    <div><a href={event.url}>{eventsTypes[event.type]} - {event.format.toTitleCase()}</a></div>
                    <div>{Moment(event.date).format("L")}</div>
                    <div>Winning Decks: {event.decks}</div>
                </div>

    }

    deckInfo(deck){
        var deckName = "Name Pending";
        var type = "";
        if(this.props.DeckSelected.DecksNames_id){
            var deckNameQuery = DecksNames.findOne({_id : this.props.DeckSelected.DecksNames_id});
            if(deckNameQuery){
                deckName = deckNameQuery.name;
                type = DecksArchetypes.findOne({_id : deckNameQuery.DecksArchetypes_id}).type.toTitleCase();
            }


        }
        return  <div className="center" >
                <div className="headerDeckName">{deckName} <span dangerouslySetInnerHTML={{__html : getHTMLColors(deck.colors)}}></span></div>
                <div className="headerType">{type}</div>
            </div>


    }
    render(){

        if(this.props.listLoading){
            return <div>loading...</div>
        }



        return(
            <div className="SelectedEventHeaderContainer">
                {this.eventInfo(this.props.EventSelected)}
                {this.deckInfo(this.props.DeckSelected)}
            </div>
        );
    }
}



var eventsTypes = {
    league : "League",
    daily : "Daily",
}