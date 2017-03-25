import React from 'react' ;

export default class CardsCollectionSimplified extends React.Component {
    constructor(){
        super();

    }

    render(){
        return(
            <div className="CardsCollectionSimplifiedComponent">
                <button onClick={()=>Meteor.call("createCompliedCardCollection")}>createCompliedCardCollection</button>
                <button onClick={()=>Meteor.call("fixTcgPlayerCardsFullData")}>fixTcgPlayerCardsFullData</button>
                <button onClick={()=>Meteor.call("getDecksDataWithCardsInformation")}>getDecksDataWithCardsInformation</button>
                <button onClick={()=>Meteor.call("fixCardsNames")}>Fix Names</button>
            </div>
        );
    }
}