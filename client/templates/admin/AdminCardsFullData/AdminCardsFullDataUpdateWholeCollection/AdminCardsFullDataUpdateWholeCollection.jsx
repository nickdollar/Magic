import React from 'react' ;

export default class AdminCardsFullDataUpdateWholeCollection extends React.Component {

    myClick (){
        Meteor.call("createCardsFullData");
    }

    render() {
        return (
            <button onClick={this.myClick} className="button sm">Update Whole Collection</button>
        )
    }
}
