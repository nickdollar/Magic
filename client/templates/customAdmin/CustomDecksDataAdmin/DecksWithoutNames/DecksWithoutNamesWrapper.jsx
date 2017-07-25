import React from 'react' ;
import DecksWithoutNames from './DecksWithoutNames.jsx' ;


export default class DecksWithoutNamesWrapper extends React.Component{
    constructor(props){
        super();
        this.state = {page : 0, limit : 10, selectedState : "scraped", DecksList : []};
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
        this.getDecks();
    }

    changedState(state){
        this.state.page = 0;
        this.state.selectedState = state;
        this.getDecks();
    }

    componentDidMount(){
        this.getDecks();
    }

    getDecks(){
        Meteor.call("getDecksDataByStateMethod", {state : this.state.selectedState, Formats_id : this.props.Formats_id, page : this.state.page, limit : this.state.limit}, (err, response)=>{
            this.setState({DecksList : response})
        });
    }

    render(){
        return (
            <div className="DecksWithoutNamesWrapperContainer">
                <h3>Deck List By State</h3>
                {["lgs", "scraped", "manual", "perfect", "nameRemoved", "shell"].map((state)=>{
                    return  <label key={state} className="radio-inline">
                                <input type="radio" onChange={()=>this.changedState(state)} value={state} name="optradio" checked={this.state.selectedState == state ? true : false}/> {state}
                            </label>
                })}
                <button data-change="-" onClick={this.changePage.bind(this)} className="btn btn-xs">-</button>
                <button data-change="+" onClick={this.changePage.bind(this)} className="btn btn-xs">+</button>
                <DecksWithoutNames  DecksList={this.state.DecksList}
                                    Formats_id={this.props.Formats_id}
                                    getDecks={this.getDecks.bind(this)}
                />
            </div>
        )
    }
}
