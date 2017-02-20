import React from 'react' ;

export default class UpdateCardsDatabase extends React.Component{
    constructor(props){
        super();
    }

    callFunction(method){
        Meteor.call(method);
    }
    render(){
        return (
            <div>
                <button onClick={()=>this.callFunction("makeCardsDataFromFullData")}
                        type="button" style={{backgroundColor : "#3399ff"}} className="btn btn-block">Add Cards to CardsDatabase</button>
            </div>
        )
    }
}
