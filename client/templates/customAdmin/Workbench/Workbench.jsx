import React from 'react' ;

export default class Workbench extends React.Component {
    constructor(){
        super();

    }

    render(){
        return(
            <div className="WorkbenchComponent">
                <button onClick={()=>Meteor.call("AddAllCardsToCardsMakeCards")}>AddAllCardsToCardsMakeCards</button>
                <button onClick={()=>Meteor.call("createCardsCollectionFromGatherer")}>createCardsCollectionFromGatherer</button>
                <button onClick={()=>Meteor.call("addTypes")}>addTypes</button>
                <button onClick={()=>Meteor.call("testInsert")}>testInsert</button>
            </div>
        );
    }
}