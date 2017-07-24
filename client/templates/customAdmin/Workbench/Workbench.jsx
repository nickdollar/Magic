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
                {/*<button onClick={()=>Meteor.call("findAllCardsMethodNonLands", (err, response)=>{*/}
                    {/*console.log(response);*/}
                {/*})}>findAllCardsMethodNonLands</button>*/}
                {/*<button onClick={()=>Meteor.call("findAllCardsMethodWithLands", (err, response)=>{*/}
                    {/*console.log(response);*/}
                {/*})}>findAllCardsMethodWithLands</button>*/}
                {/*<button onClick={()=>Meteor.call("createMetaLastDaysAdditionsMethod")}>createMetaLastDaysAdditionsMethod</button>*/}
                {/*<button onClick={()=>Meteor.call("createMetaLastAdditionMethod")}>createMetaLastAdditionMethod</button>*/}
                {/*<button onClick={()=>Meteor.call("fixArchetypes")}>fixArchetypes</button>*/}
                {/*<button onClick={()=>Meteor.call("giveStarCityCards_idMethod")}>giveStarCityCards_idMethod</button>*/}
                {/*<button onClick={()=>Meteor.call("CreateDatabaseFromCSVMethod")}>CreateDatabaseFromCSVMethod</button>*/}
                {/*<button onClick={()=>Meteor.call("findDecksArchetypesRankingsMethod")}>findDecksArchetypesRankingsMethod</button>*/}
                {/*<button onClick={()=>Meteor.call("fixedArchetypes_namesMethod")}>fixedArchetypes_namesMethod</button>*/}
                {/*<button onClick={()=>Meteor.call("findCardsThatDoesntExistsMethod")}>findCardsThatDoesntExistsMethod</button>*/}
                {/*<button  className="btn btn-default" onClick={()=>Meteor.call("fixPTCTHINGSMethod")}>fixPTCTHINGSMethod</button>*/}
                {/*<button onClick={()=>Meteor.call("RemoveRemovedEventsMethod")}>RemoveRemovedEventsMethod</button>*/}
                <button onClick={()=>Meteor.call("getESTTimeZoneHoursMethod")}>getESTTimeZoneHoursMethod</button>
                <button onClick={()=>Meteor.call("getMyTimeZoneMethod")}>getMyTimeZoneMethod</button>
                <button onClick={()=>Meteor.call("RemoveRemovedEventsMethod")}>RemoveRemovedEventsMethod</button>
                <button onClick={()=>Meteor.call("yoyoyoyoMethod")}>yoyoyoyoMethod</button>

            </div>
        );
    }
}