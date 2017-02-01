import React from 'react' ;

export default class UpdateCardsDatabase extends React.Component{
    constructor(props){
        super();
    }

    callFunction(method, data){
        Meteor.call(method, data);
    }
    render(){
        return (
            <div>
                <button onClick={()=>this.callFunction("methodsCardsData", {format : "standard", days : 5})}
                        type="button" style={{backgroundColor : "#3399ff"}} className="btn btn-block">Add Cards to CardsDatabase</button>
            </div>
        )
    }
}
