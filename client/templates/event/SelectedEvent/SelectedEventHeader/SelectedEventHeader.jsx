import React from 'react' ;
import Moment from "moment";

export default class  extends React.Component {
    constructor(){
        super();
    }

    eventInfo(event){
        console.log(event);
        var eventType = EventsTypes.findOne({_id : event.EventsTypes_id});
        if(_.isEmpty(event)){
            return <div className="left"></div>
        }

        if(eventType._id == "LGS"){
            var LGSQuery = LGS.findOne({_id : event.LGS_id});
        }

        return  <div className="left">
                    <div>
                        {
                            eventType._id == "lgs" ? `${LGSQuery.name} (${LGSQuery.location.city ? LGSQuery.location.city : LGSQuery.location.state}) - ${event.format.toTitleCase()}` :
                            <a href={event.url}>{eventType.name} - {getLinkFormat(event.Formats_id)}</a>
                        }
                    </div>

                    <div>{Moment(event.date).format("L")}</div>
                    <div>Published Decks: {event.decksQty}</div>
                </div>
    }

    deckInfo(deck){
        if(_.isEmpty(deck)){
            return <div className="left"></div>
        }
        var deckName = "(Name Pending)";
        var type = "";
        if(deck.DecksNames_id){
            var deckNameQuery = DecksNames.findOne({_id : deck.DecksNames_id});
            if(deckNameQuery){
                deckName = deckNameQuery.name;
                type = DecksArchetypes.findOne({_id : deckNameQuery.DecksArchetypes_id}).type.toTitleCase();
            }
        }
        return  <div className="center" >
                    <div className="headerDeckName">{deckName} <span className="deckNamesColor">{getHTMLColorsFromDecksNamesReact(deck.DecksNames_id)}</span></div>
                    <div className="headerType">
                        <span>{type}</span>
                    </div>
                </div>
    }
    render(){
        return(
            <div className="SelectedEventHeaderContainer">
                {this.eventInfo(this.props.Event)}
                {this.deckInfo(this.props.DecksData)}
            </div>
        );
    }
}

