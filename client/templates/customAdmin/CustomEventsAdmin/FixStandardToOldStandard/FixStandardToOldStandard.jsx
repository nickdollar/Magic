import React from 'react' ;

export default class FixStandardToOldStandard extends React.Component {
    constructor(){
        super();

    }

    fixEventsStandard(){
        Meteor.call("fixEventsStandard");
    }

    render(){
        return(
            <div className="FixStandardToOldStandardComponent">
                <h3>Fix Standard to old Standard</h3>
                <button className="btn" onClick={this.fixEventsStandard.bind(this)}>fixEventsStandard</button>
            </div>
        );
    }
}