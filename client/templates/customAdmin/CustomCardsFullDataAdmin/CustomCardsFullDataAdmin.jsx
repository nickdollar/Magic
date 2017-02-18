import React from 'react' ;

export default class CustomCardsFullDataAdmin extends React.Component {
    constructor(){
        super();

    }
    createFullCardsData(){
        Meteor.call("createCardsFullData");
    }

    render(){
        return(
            <div className="CustomCardsFullDataAdminComponent">
                <button onClick={this.createFullCardsData}>Create Card Full Data</button>
            </div>
        );
    }
}