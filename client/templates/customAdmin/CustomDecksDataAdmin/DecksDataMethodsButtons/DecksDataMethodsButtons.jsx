import React from 'react' ;

export default class DecksNamesMethodsButtons extends React.Component {
    constructor(){
        super();

    }


    methodCall(method, options){
        Meteor.call({method, ...options})
    }

    render(){
        return(
            <div className="DecksNamesMethodsButtonsComponent">
                <button onClick={()=>this.methodCall("fixDecksScraped", ["format"])}></button>
            </div>
        );
    }
}