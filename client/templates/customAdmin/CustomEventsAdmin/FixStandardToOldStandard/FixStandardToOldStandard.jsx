import React from 'react' ;

export default class FixStandardToOldStandard extends React.Component {
    constructor(){
        super();

    }

    handlerFixEventsStandard(){
        Meteor.call("fixEventsStandardMethod");
    }

    render(){
        return(
            <div className="FixStandardToOldStandardComponent">
                <h3>Fix Standard to old Standard</h3>
                <button className="btn" onClick={this.handlerFixEventsStandard.bind(this)}>fixEventsStandardMethod</button>
                <button className="btn" onClick={()=>{Meteor.call("fixEventsTransitionStandardMethod", (err, response)=>{
                    console.log(response);
                })}}>fixEventsTransitionStandardMethod</button>
            </div>
        );
    }
}