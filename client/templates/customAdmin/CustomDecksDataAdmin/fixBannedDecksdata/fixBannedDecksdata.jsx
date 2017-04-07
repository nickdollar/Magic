import React from 'react' ;

export default class fixBannedDecksdata extends React.Component {
    constructor(){
        super();
    }

    fixBannedDecksdata(){
        Meteor.call("bannedDeck", this.props.Formats_id);
    }

    render(){

        return(
            <div className="fixBannedDecksdataComponent">
                <h3>Fix Banned DecksData</h3>
                <button onClick={this.fixBannedDecksdata.bind(this)}>Fix Banned DecksData</button>
            </div>
        );
    }
}