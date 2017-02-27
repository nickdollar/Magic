import React from "react";
import DumbSelect2 from "/client/dumbReact/DumbSelect2/DumbSelect2.jsx";

export default class AutoComplete extends React.Component{
    constructor() {
        super();
    }
    
    componentDidUpdate(){
        cardPopover(".js-imagePopover", true);
    }

    render() {
        return (
            <div className="optionsGroupName">
                <div className="optionsHeader">Deck Contain</div>
                <DumbSelect2 call="getAutoComplete"
                             returnHandler={this.props.dumbSelect2}
                />
                <ul className="list-group list-group-sm">
                    {this.props.state.cards.map((obj, index)=>{
                        return <li key={obj} className="list-group-item"><span className="js-imagePopover" data-name={obj}>{obj}</span><span onClick={()=>this.props.removeFromTheListMain(index)} data-name={obj} style={{float : "right"}}>X</span></li>
                    })}
                </ul>
            </div>
        )
    }
}