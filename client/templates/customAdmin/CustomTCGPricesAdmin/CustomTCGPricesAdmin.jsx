import React from 'react' ;

export default class CustomTCGPricesAdmin extends React.Component {
    constructor(){
        super();

    }

    render(){
        return(
            <div className="CustomTCGPricesAdminComponent">
                <button onClick={()=>Meteor.call("getAllPrices")}>getAllPrices</button>
            </div>
        );
    }
}