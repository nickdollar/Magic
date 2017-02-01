import React from 'react' ;

export default class CustomDecksDataAdmin extends React.Component{
    constructor(props){
        super();
    }

    componentDidMount(){

    }

    updateDatabase(){
        Meteor.call("methodsCardsData");
    }

    render(){
        console.log(this.props.format);
        return (
            <div>
                <button onClick={this.updateDatabase.bind(this)}></button>
            </div>
        )
    }
}
