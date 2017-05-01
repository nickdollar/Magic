import React from 'react' ;

export default class CardsSimple extends React.Component {
    constructor(){
        super();

    }

    render(){
        return(
            <div className="CardsCollectionSimplifiedComponent">
                <button onClick={()=>Meteor.call("UpdateCardsSimple")}>UpdateCardsSimple</button>
            </div>
        );
    }
}