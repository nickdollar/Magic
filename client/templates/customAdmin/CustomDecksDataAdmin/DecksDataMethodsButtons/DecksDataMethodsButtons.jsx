import React from 'react' ;

export default class DecksDataMethodsButtons extends React.Component {
    constructor(){
        super();

    }


    methodCall(method, options){
        Meteor.call(method, ...options)
    }

    render(){
        return(
            <div className="DecksNamesMethodsButtonsComponent">
                <h3>Fix Decks Scraped</h3>
                <button onClick={()=>this.methodCall("fixDecksScraped", [this.props.format])}>fixDecksScraped</button>

            </div>
        );
    }
}