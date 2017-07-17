import React from 'react';
import DecksWithoutNames from "../DecksWithoutNames/DecksWithoutNames.jsx";



export default class DecksDataByMethod extends React.Component {
    constructor(){
        super();
        this.state = {DecksList : [], page : 0, limit : 10, selectedArchetype : null}

    }


    handleDecksArchetypes(e){
        this.state.selectedArchetype = e.target.value;
        Meteor.call("getDecksDataByDecksArchetypesMethod", {DecksArchetypes_id : e.target.value}, (err, response)=>{
            console.log(response);
            this.setState({DecksList : response});
        })
    }

    handleUpdatedDeck(){
        Meteor.call("getDecksDataByDecksArchetypesMethod", {DecksArchetypes_id : this.state.selectedArchetype}, (err, response)=>{
            this.setState({DecksList : response});
        })
    }

    changePage(e){
        if(e.target.getAttribute("data-change") == "+"){
            var page = this.state.page;
            page++;
            this.state.page = page;
        }else{
            var page = this.state.page;
            page--;
            if(page < 0){
                page = 0;
            }
            this.state.page = page;
        }
        this.setState({});
    }

    render(){
        var decksSplit = this.state.DecksList.slice(this.state.limit * this.state.page, this.state.limit * (this.state.page+1))
        return(
            <div className="DecksDataByMethodComponent">
               <select onChange={this.handleDecksArchetypes.bind(this)}>
                   <option></option>
                   {DecksArchetypes.find({Formats_id : this.props.Formats_id}).map((archetype)=>{
                       return <option value={archetype._id} key={archetype._id}>{archetype.name}</option>
                   })}
               </select>
                <button data-change="-" onClick={this.changePage.bind(this)} className="btn btn-xs">-</button>
                <button data-change="+" onClick={this.changePage.bind(this)} className="btn btn-xs">+</button>
                <DecksWithoutNames  DecksList={decksSplit}
                                    Formats_id={this.props.Formats_id}
                                    getDecks={this.handleUpdatedDeck.bind(this)}
                />
            </div>
        );
    }
}
