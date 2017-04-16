import React from 'react' ;

export default class CustomTCGPlayerCardsFullDataAdmin extends React.Component {
    constructor(){
        super();

    }

    render(){
        return(
            <div className="CustomTCGPlayerCardsFullDataAdminComponent">
                <button className="btn" onClick={()=>{Meteor.call("getMorningDailyCardsPricesMethods")}}>getMorningDailyCardsPricesMethods</button>
            </div>
        );
    }
}