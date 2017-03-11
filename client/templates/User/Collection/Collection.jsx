import React from 'react' ;
import CardNamesCall from "./CardNamesCall/CardNamesCall"

export default class Collection extends React.Component {
    constructor(){
        super();

    }


    getCard(card){
        console.log(card);
    }

    render(){
        return(
            <div className="CollectionComponent">
                <CardNamesCall  returnHandler={this.getCard}/>
            </div>
        );
    }
}