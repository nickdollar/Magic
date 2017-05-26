import React from 'react' ;

export default class CustomCardsAdmin extends React.Component {
    constructor(){
        super();
    }

    render(){
        return(
            <div className="CustomCardsAdminComponent">
                <button onClick={()=>Meteor.call("giveLatestPriceForEach")}>giveLatestPriceForEach</button>
                <button onClick={()=>Meteor.call("organizeAllCardsDatabaseMethod")}>organizeAllCardsDatabaseMethod</button>

            </div>
        );
    }
}