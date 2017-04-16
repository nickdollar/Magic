import React from 'react' ;

export default class CustomTCGPlayerCardsDailyPricesAdmin extends React.Component {
    constructor(){
        super();

    }

    render(){
        return(
            <div className="CustomTCGPlayerCardsDailyPricesAdminComponent">
                <button className="btn" onClick={()=>Meteor.call("TCGPlayerCardsDailyPricesMethods")}>TCGPlayerCardsDailyPricesMethods</button>
            </div>
        );
    }
}