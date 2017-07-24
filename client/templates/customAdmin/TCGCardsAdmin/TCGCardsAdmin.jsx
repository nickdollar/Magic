import React from 'react' ;

export default class TCGCards extends React.Component {
    constructor(){
        super();

    }

    render(){
        return(
            <div className="TCGCardsComponent">
                <div>
                    <button className="btn btn-default" onClick={()=>Meteor.call("CreateLatestCardsMethod")}>CreateLatestCardsMethod</button>
                    <button className="btn btn-default" onClick={()=>Meteor.call("CreateDatabaseFromCSVMethod")}>CreateDatabaseFromCSVMethod</button>
                    <button className="btn btn-default" onClick={()=>Meteor.call("CreateLatestTCGCardsMethod")}>CreateLatestTCGCardsMethod</button>
                </div>
            </div>
        );
    }
}