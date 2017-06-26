import React from 'react' ;

export default class Workbench extends React.Component {
    constructor(){
        super();

    }

    render(){
        return(
            <div className="WorkbenchComponent">
                {/*<button onClick={()=>Meteor.call("makeCardsUnique")}>makeCardsUnique</button>*/}
                {/*<button onClick={()=>Meteor.call("addSetsToCards")}>addSetsToCards</button>*/}
                <button onClick={()=>Meteor.call("findAllCardsMethodNonLands", (err, response)=>{
                    console.log(response);
                })}>findAllCardsMethodNonLands</button>
                <button onClick={()=>Meteor.call("findAllCardsMethodWithLands", (err, response)=>{
                    console.log(response);
                })}>findAllCardsMethodWithLands</button>
                {/*<button onClick={()=>Meteor.call("createMetaLastDaysAdditionsMethod")}>createMetaLastDaysAdditionsMethod</button>*/}
                {/*<button onClick={()=>Meteor.call("createMetaLastAdditionMethod")}>createMetaLastAdditionMethod</button>*/}
                <button onClick={()=>Meteor.call("fixArchetypes")}>fixArchetypes</button>
                <button onClick={()=>Meteor.call("giveStarCityCards_idMethod")}>giveStarCityCards_idMethod</button>

            </div>
        );
    }
}