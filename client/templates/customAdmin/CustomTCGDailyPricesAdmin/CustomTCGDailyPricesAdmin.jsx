import React from 'react' ;

export default class CustomDailyPrices extends React.Component {
    constructor(){
        super();
    }

    render(){
        return(
            <div className="CustomDailyPricesComponent">
                <button onClick={()=>{Meteor.call("CreateTCGDailyPricesMethod")}}>CreateTCGDailyPricesMethod</button>
            </div>
        );
    }
}