import React from 'react' ;
import Moment from "moment";

export default class  extends React.Component {
    constructor(){
        super();
        this.state = {firstLoaded : false};

    }

    eventInfo(event){
        return  <div className="left">
                    <div><a href={event.url}>{eventsTypes[event.type] ? eventsTypes[event.type] : event.type} - {event.format.toTitleCase()}</a></div>
                    <div>{Moment(event.date).format("L")}</div>
                    <div>Winning Decks: {event.decks}</div>
                </div>
    }

    componentWillReceiveProps(nextProps){
        if(!nextProps.listLoading && this.state.firstLoaded == false){
            this.setState({firstLoaded : true})
        }
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
                <div className="headerDeckName">{deckName} </div>
                <div className="headerType"><span dangerouslySetInnerHTML={{__html : getHTMLColors(deck.colors, 18)}}></span>{type}</div>
            </div>


    }
    render(){

        if(!this.state.firstLoaded){
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

