import React from 'react' ;
import DecksWithoutNamesContainer from './DecksWithoutNamesContainer.jsx' ;


export default class DecksWithoutNamesWrapper extends React.Component{
    constructor(props){
        super();
        this.state = {page : 0, perPage : 10, selectedState : "lgs"};
    }

    componentDidMount(){

    }

    changePage(e){
        if(e.target.getAttribute("data-change") == "+"){
            var page = this.state.page;
            page++;
            this.setState({page : page});
        }else{
            var page = this.state.page;
            page--;
            if(page < 0){
                page = 0;
            }
            this.setState({page : page})
        }
    }

    changedState(state){
        this.setState({page : 0, selectedState : state});
    }

    render(){
        return (
            <div className="DecksWithoutNamesWrapperContainer">
                <h3>Deck List By State</h3>
                {["lgs", "scraped", "match", "perfect", "nameRemoved", "manual", "shell"].map((state)=>{
                    return  <label key={state} className="radio-inline">
                                <input type="radio" onChange={()=>this.changedState(state)} value={state} name="optradio" checked={this.state.selectedState == state ? true : false}/> {state}
                            </label>
                })}
                <button data-change="-" onClick={this.changePage.bind(this)} className="btn btn-xs">-</button>
                <button data-change="+" onClick={this.changePage.bind(this)} className="btn btn-xs">+</button>
                <DecksWithoutNamesContainer serverQuery={[this.state.selectedState, this.props.Formats_id, this.state.perPage, this.state.page]}
                                            clientQuery={[{state : this.state.selectedState, Formats_id : this.props.Formats_id}, {limit : this.state.perPage, skip : this.state.page}]}
                />
            </div>
        )
    }
}
