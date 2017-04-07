import React from 'react' ;

export default class DecksNamesFixes extends React.Component {
    constructor(){
        super();

    }

    render(){
        return(
            <div className="DecksNamesFixesComponent">
                <button onClick={Meteor.call("formatToFormats_id")}>formatToFormats_id</button>
            </div>
        );
    }
}