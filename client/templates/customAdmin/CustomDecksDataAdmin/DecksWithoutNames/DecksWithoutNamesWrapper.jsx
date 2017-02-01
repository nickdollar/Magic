import React from 'react' ;
import DecksWithoutNamesContainer from './DecksWithoutNamesContainer.jsx' ;

export default class DecksWithoutNamesWrapper extends React.Component{
    constructor(props){
        super();
        this.state = {page : 0, perPage : 10};
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



    render(){
        console.log(this.props.format)
        return (
            <div>
                <button data-change="-" onClick={this.changePage.bind(this)} className="btn btn-xs">-</button>
                <button data-change="+" onClick={this.changePage.bind(this)} className="btn btn-xs">+</button>
                <DecksWithoutNamesContainer query={{state : {$nin : ["auto", "match", "manual"]}, format :this.props.format}}
                                            projection={{limit : this.state.perPage, skip : this.state.page * this.state.perPage, fields : {main: 0, sideboard : 0}}}/>

            </div>
        )
    }
}
