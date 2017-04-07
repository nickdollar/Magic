import React from 'react' ;

export default class DecksDataMethodsButtons extends React.Component {
    constructor(){
        super();

    }


    render(){
        return(
            <div className="DecksNamesMethodsButtonsComponent">
                <h3>Fix Decks Scraped</h3>
                <button onClick={()=>Meteor.call("giveNamesToAllDecksScrapedMethod", {Formats_id : this.props.Formats_id})}>giveNamesToAllDecksScraped</button>
            </div>
        );
    }

}