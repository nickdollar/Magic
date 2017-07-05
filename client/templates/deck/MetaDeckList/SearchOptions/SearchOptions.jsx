import React from "react";
import AutoComplete from "./AutoComplete/Autocomplete.jsx";

export default class SearchOptions extends React.Component{
    constructor() {
        super();
    }

    render() {
        return (
            <div className="block-left block-left--search-options searchOptions">
                <div className="search-options" >
                    <div className="search-options__field-name search-options__field-name--first">
                        Name Filter
                    </div>
                    <input className="search-options__text-input" type="text" onChange={this.props.nameFilter} value={this.props.state.nameFilter}/>
                </div>
                <div className="search-options" >
                    <div className="search-options__field-name">
                        Type
                    </div>
                    {this.props.state.types.map((type, index)=>{
                        return  <div key={type.value} className="search-options__radio-or-checkbox-name-wrapper">
                                    <input type="checkbox" role="checkbox" className="search-options__checkbox" value={type.value} onChange={()=>this.props.updateTypes(index)} checked={type.checked}/>
                                        <span className="search-options__option-name">{type.text}</span>
                            </div>
                    })}
                </div>
                <div className="search-options">
                    <div className="search-options__field-name">
                        Colors
                    </div>
                    {this.props.state.colors.map((color, index)=>{
                        return  <div key={color.value} className="search-options__radio-or-checkbox-name-wrapper">
                                        <input type="checkbox" role="checkbox" className="search-options__checkbox" value={color.value} onChange={()=>this.props.updateColors(index)} checked={color.checked}/>
                                            <span className="search-options__option-name">
                                                <span className={`mana ${color.css}`}></span>
                                            </span>

                                </div>
                    })}
                    {this.props.state.containMatch.map((containMatch, index)=>{
                        return  <div key={containMatch.value} className="search-options__radio-or-checkbox-name-wrapper">
                                    <input type="radio" className="search-options__radio" name="optionsRadio" value={containMatch.value} onChange={()=>this.props.updateContainMatch(index)} checked={containMatch.checked} />
                            <span className="search-options__option-name">{containMatch.text}</span>
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

