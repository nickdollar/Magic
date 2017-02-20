import React from 'react' ;

export default class CustomDecksDataAdmin extends React.Component{
    constructor(props){
        super();
    }

    componentDidMount(){

    }

    updateDatabase(){
        Meteor.call("makeCardsDataFromFullData");
    }

    render(){
        return (
            <div>
                <button onClick={this.updateDatabase.bind(this)}>makeCardsDataFromFullData</button>
            </div>
        )
    }
}
