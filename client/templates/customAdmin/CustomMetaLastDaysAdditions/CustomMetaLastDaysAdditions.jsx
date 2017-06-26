import React from 'react' ;

export default class CustomMetaLastDaysAdditions extends React.Component {
    constructor(){
        super();

    }

    render(){
        return(
            <div className="CustomMetaLastDaysAdditionsComponent">
                <button onClick={()=>Meteor.call("createMetaLastDaysAdditionsMethod")}>createMetaLastDaysAdditionsMethod</button>
            </div>
        );
    }
}