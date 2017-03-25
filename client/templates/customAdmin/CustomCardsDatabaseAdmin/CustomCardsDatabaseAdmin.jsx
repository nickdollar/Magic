import React from 'react' ;
import UpdateCardsDatabase from "./UpdateCardsDatabase/UpdateCardsDatabase"

export default class CustomAdmin extends React.Component{
    constructor(props){
        super();
        this.state = {};
    }

    componentDidMount(){

    }

    render(){
        return (
            <div>
                <UpdateCardsDatabase />
                <button onClick={()=>Meteor.call("getDeckSetsFromGoogleCacheMethod")}>getList</button>
                {/*<button onClick={()=>Meteor.call("getCardsOfTheSetCacheMethod")}>Get Cards From Setst</button>*/}
                <button onClick={()=>Meteor.call("convertCSVToJson")}>convert CSV To Json</button>
                <button onClick={()=>Meteor.call("cardsPrices")}>cards Prices</button>
                <button onClick={()=>Meteor.call("findFoilCards")}>findFoilCards</button>
                <button onClick={()=>Meteor.call("getTCGPLayerCardsFullDataMethods")}>getCardsPricesForTheDayMethods</button>
                <button onClick={()=>Meteor.call("setUpFoilNormalMethod")}>setUpFoilNormalMethod</button>

            </div>
        )
    }
}
