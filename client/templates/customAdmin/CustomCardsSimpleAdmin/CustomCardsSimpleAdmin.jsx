import React from 'react' ;

export default class CardsSimple extends React.Component {
    constructor(){
        super();

    }

    render(){
        return(
            <div className="CardsSimpleComponent">
                <button onClick={()=>Meteor.call("UpdateCardsSimpleMethod")}>UpdateCardsSimpleMethod</button>
                <button onClick={()=>Meteor.call("UpdateCardsSimplePricesMethod")}>UpdateCardsSimplePricesMethod</button>

            </div>
        );
    }
}