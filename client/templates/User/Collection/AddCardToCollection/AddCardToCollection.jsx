import React from 'react' ;
import CardNamesCall from "./CardNamesCall/CardNamesCall"

export default class Collection extends React.Component {
    constructor(){
        super();
        this.state = {suggestion : {}, added : false}
    }

    typedCard(suggestion, method){
        this.setState({suggestion : suggestion});
    }

    sendCardToCollection(){
        if(this.state.suggestion.CardsUnique_id){
            var request = {};
            if(!isNaN(parseInt(this.qty.value))){
                if(this.state.suggestion.foil){
                    request.fQty = parseInt(this.qty.value);
                }else{
                    request.nQty = parseInt(this.qty.value);
                }
            }
            request.CardsUnique_id = this.state.suggestion.CardsUnique_id;
            request.name = this.state.suggestion.name;

            Meteor.call("addCardToCollectionMethod", {request : request},(err, reponse)=>{
                this.props.getCollectionCards();
                window.clearTimeout(timeoutHandler);
                this.setState({added : !this.state.added, suggestion : {}});
                timeoutHandler = window.setTimeout(()=>{
                    updateCollectionNumbersFunction();
                }, 15000);
            });

        }
    }

    sendCardToWanted(){
        if(this.state.suggestion.CardsUnique_id){
            var request = {};
            if(!isNaN(parseInt(this.qty.value))){
                if(this.state.suggestion.foil){
                    request.fQty = parseInt(this.qty.value);
                }else{
                    request.nQty = parseInt(this.qty.value);
                }
            }
            request.CardsUnique_id = this.state.suggestion.CardsUnique_id;
            request.name = this.state.suggestion.name;

            Meteor.call("addCardToWantedMethod", {request : request},(err, reponse)=>{
                this.props.getCollectionCards();
                window.clearTimeout(timeoutHandler);
                this.setState({added : !this.state.added, suggestion : {}});
                timeoutHandler = window.setTimeout(()=>{
                    updateCollectionNumbersFunction();
                }, 15000);
            });
        }
    }

    render(){
        return(
            <div className="CollectionComponent">
                <div className="addCartToCollectionWrapper">
                    <div className="QtyWrapper">Qty: <input className="addQtyNumberInput" ref={(input)=>this.qty = input} type="text" defaultValue={4}/></div>
                    <div className="cardNamesCall">
                        <CardNamesCall  typedCard={this.typedCard.bind(this)}
                                        added={this.state.added}
                        />
                    </div>
                    <div className="addToCollectionButton"><button disabled={this.state.suggestion.CardsUnique_id ? false : true} className="btn btn-default" onClick={this.sendCardToCollection.bind(this)}>Add To Collection</button></div>
                    <div className="addToCollectionButton"><button disabled={this.state.suggestion.CardsUnique_id ? false : true} className="btn btn-default" onClick={this.sendCardToWanted.bind(this)}>Add To Wanted List</button></div>
                </div>
            </div>
        );
    }
}