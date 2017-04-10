import React from "react";
import AutoComplete from "./AutoComplete/Autocomplete.jsx";

export default class SearchOptions extends React.Component{
    constructor() {
        super();
    }

    render() {
        return (
            <div className="searchOptions">
                <div className="optionsGroupName" >
                    <div className="header">
                        Name Filter
                    </div>
                    <input type="text" onChange={this.props.nameFilter} value={this.props.state.nameFilter}/>
                </div>
                <div className="optionsGroupName" >
                    <div className="header">
                        Type
                    </div>
                    {this.props.state.types.map((type, index)=>{
                        return  <div key={type.value} className="checkbox">
                                    <label>
                                        <input type="checkbox" role="checkbox" value={type.value} onChange={()=>this.props.updateTypes(index)} checked={type.checked}/>
                                        {type.text}
                                    </label>
                                </div>
                    })}
                </div>
                <div className="optionsGroupName">
                    <div className="header">
                        Colors
                    </div>
                    {this.props.state.colors.map((color, index)=>{
                        return  <div key={color.value} className="checkbox">
                                    <label>
                                        <input type="checkbox" role="checkbox" value={color.value} onChange={()=>this.props.updateColors(index)} checked={color.checked}/>
                                            <span className={`mana ${color.css}`}></span>
                                    </label>
                                </div>
                    })}
                    {this.props.state.containMatch.map((containMatch, index)=>{
                        return  <div key={containMatch.value} className="radio">
                                    <label><input type="radio" name="optionsRadio" value={containMatch.value} onChange={()=>this.props.updateContainMatch(index)} checked={containMatch.checked} />{containMatch.text}</label>
                                </div>
                    })}
                </div>
                <AutoComplete removeFromTheListMain={this.props.removeFromTheListMain}
                              autoComplete={this.props.autoComplete}
                              state={this.props.state}

                />
            </div>
        )
    }
}

