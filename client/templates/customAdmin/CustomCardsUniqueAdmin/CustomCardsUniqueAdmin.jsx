import React from 'react' ;

export default class CustomCardsUniquesAdmin extends React.Component {
    constructor(){
        super();
    }

    render(){
        return(
            <div className="CustomCardsUniquesAdminComponent">
                <button onClick={()=>Meteor.call("makeCardsUnique")}>makeCardsUnique</button>
                <button onClick={()=>Meteor.call("cardsUniquesPricesMethod")}>cardsUniquesPricesMethod</button>
                <button onClick={()=>Meteor.call("organizeAllCardsDatabase")}>organizeAllCardsDatabase</button>

            </div>
        );
    }
}