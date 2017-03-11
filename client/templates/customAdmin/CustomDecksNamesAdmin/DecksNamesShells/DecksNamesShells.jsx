import React from 'react' ;

export default class DecksNamesShells extends React.Component {
    constructor(){
        super();

    }

    createDecksNamesShellsByFormat(){
        Meteor.call("createDecksNamesShellsByFormat", this.props.format);
    }

    findDecksByDecksNamesShells(){
        Meteor.call("findDecksByDecksNamesShellsAll", this.props.format);
    }

    render(){
        return(
            <div className="DecksNamesShellsComponent">
                <h3>Decks Names Shells</h3>
                <button onClick={this.createDecksNamesShellsByFormat.bind(this)}>Create Deck Names Shell</button>
                <button onClick={this.findDecksByDecksNamesShells.bind(this)}>Check the Decks Names Shells</button>
            </div>
        );
    }
}