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
        this.setState({selectedState : state});
    }

    render(){
        return (
            <div className="DecksWithoutNamesWrapperContainer">
                {["lgs", "scraped", "match", "perfect", "nameRemoved", "manual"].map((state)=>{
                    return  <label key={state} className="radio-inline">
                                <input type="radio" onChange={()=>this.changedState(state)} value={state} name="optradio" checked={this.state.selectedState == state ? true : false}/> {state}
                            </label>
                })}
                <button data-change="-" onClick={this.changePage.bind(this)} className="btn btn-xs">-</button>
                <button data-change="+" onClick={this.changePage.bind(this)} className="btn btn-xs">+</button>
                <DecksWithoutNamesContainer serverQuery={[this.state.selectedState, this.props.format, this.state.perPage, this.state.page]}
                                            clientQuery={[{state : this.state.selectedState, format : this.props.format}, {limit : this.state.perPage, skip : this.state.page}]}
                />
            </div>
        )
    }
}
