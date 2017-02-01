import React from 'react' ;

export default class PlayerList extends React.Component {
    constructor(){
        super();

    }

    positionVictory(deck){
        var position = "";
        if(deck.position){
            position += prettifyPosition(deck.position)
        }

        if(deck.victory != null){
            position += "("+ deck.victory;

            if(deck.loss){
                position += "-" + deck.loss;

            }else{
                position += "-0";
            }
            if(deck.draw){
                position += "-" + deck.draw;
            }

            position += ")";
        }

        return position;


    }


    render(){
        return(
            <div className="PlayListContainer">
                <ul className="list-group">
                    {this.props.Players.map((deck)=>{
                        var deckName = "Name Pending";
                        if(deck.DecksNames_id){
                            if(DecksNames.findOne({_id : deck.DecksNames_id})){
                                deckName = DecksNames.findOne({_id : deck.DecksNames_id}).name;
                            }
                        }

                        var colors = getHTMLColors(deck.colors);

                        return <li key={deck._id} className="list-group-item">
                            <div><a href={FlowRouter.path("selectedEvent", {format : deck.format, Events_id : deck.Events_id, DecksData_id : deck._id})}> {this.positionVictory(deck)} {deckName}</a> <span dangerouslySetInnerHTML={{__html : colors}}></span></div>
                            <div>{deck.player}</div>
                            </li>
                    })}
                </ul>
            </div>
        );
    }
}