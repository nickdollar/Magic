import React from 'react' ;
import CardNamesCall from "./CardNamesCall/CardNamesCall"

export default class Collection extends React.Component {
    constructor(){
        super();
        this.state = {suggestion : {}}

    }

    typedCard(suggestion, method){
        if(method==="type"){
            this.state.suggestion = {name : suggestion, printing : "custom"};
        }else{
            this.state.suggestion = suggestion;
        }
    }

    sendCardToCollection(){

        var quantity = parseInt(this.quantity.value);
        var foil = this.foil.checked;

        if(this.state.suggestion.name){
            var request = Object.assign({}, this.state.suggestion, {quantity : isNaN(quantity) ? 0 : quantity, foil : foil});
            Meteor.call("addCardToCollectionMethod", request);
        }
    }

    render(){
        return(
            <div className="CollectionComponent">
                <div className="addCartToCollectionWrapper">
                    <div className="QuantityWrapper">Qty: <input className="addQuantityNumberInput" ref={(input)=>this.quantity = input} type="text" defaultValue={4}/></div>
                    <div className="foilCheckbox">Foil: <input className="checkboxStyle" ref={(input)=>this.foil = input} type="checkbox"/></div>
                    <div className="cardNamesCall"><CardNamesCall  typedCard={this.typedCard.bind(this)}/></div>
                    <div className="addToCollectionButton"><button className="btn btn-default" onClick={this.sendCardToCollection.bind(this)}>Add To Collection</button></div>
                </div>
            </div>
        );
    }
}