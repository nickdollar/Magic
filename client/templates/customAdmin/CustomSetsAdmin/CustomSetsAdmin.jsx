import React from 'react' ;

export default class CustomSetsAdmin extends React.Component {
    constructor(){
        super();

    }

    render(){
        return(
            <div className="CustomSetsAdminComponent">
                <button onClick={()=>{Meteor.call("createSetsMethod")}}>createSetsMethod</button>
                <button onClick={()=>{Meteor.call("giveSetsTCGNamesMethod")}}>giveSetsTCGNames</button>
                <button onClick={()=>{Meteor.call("compareSetsMethod")}}>compareSetsMethod</button>

            </div>
        );
    }
}

