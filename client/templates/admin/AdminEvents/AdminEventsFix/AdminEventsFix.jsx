import React from 'react' ;

export default class AdminCardsFullDataUpdateWholeCollection extends React.Component {

    myClick (){
        Meteor.call("fixEventsStandard");
    }

    render() {
        return (
            <button onClick={this.myClick} className="button sm">Find Current Standard</button>
        )
    }
}