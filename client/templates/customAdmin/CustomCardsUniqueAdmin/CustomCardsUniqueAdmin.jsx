import React from 'react' ;

export default class CustomCardsUniquesAdmin extends React.Component {
    constructor(){
        super();
    }

    render(){
        return(
            <div className="CustomCardsUniquesAdminComponent">
                <div>
                    <button className="btn btn-default" onClick={()=>Meteor.call("makeCardsUniqueMethod")}>makeCardsUniqueMethod</button>
                </div>
                <div>
                    <button className="btn btn-default" onClick={()=>Meteor.call("cardsUniquesPricesMethod")}>cardsUniquesPricesMethod</button>
                </div>
            </div>
        );
    }
}