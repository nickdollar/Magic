import React from "react";
import AutoComplete from "./Autocomplete.jsx";

export default class SearchOptions extends React.Component{
    constructor() {
        super();
        this.state = {
            typeOptions: ["aggro", "combo", "control"],
            colors: ["b", "c", "g", "r", "u", "w"],
            containMatch : "contain",
            archetypesDecks : "archetypes"
        }

    }

    typeChange(e){
        var types = this.state.typeOptions.concat();

        var index = types.findIndex((typesObj)=>{
            return typesObj == e.target.value;
        })

        if(index == -1){
            types.push(e.target.value);
        }else{
            types.splice(index, 1);
        }
        
        this.props.updateTypesOptions(types);
        this.setState({typeOptions : types});
    }

    typesChecked(type){
        var types = this.state.typeOptions.slice();

        var index = types.findIndex((typesObj)=>{
            return typesObj == type;
        })



        if(index != -1){
            return "checked";
        }
        return ""

    }

    colorChange(e){
        var colors = this.state.colors.slice();

        var index = colors.findIndex((colorsObj)=>{
            return colorsObj == e.target.value;
        })

        if(index == -1){
            colors.push(e.target.value);
        }else{
            colors.splice(index, 1);
        }

        this.props.updateColors(colors);
        this.setState({colors : colors});
    }

    colorChecked(color){
        var colors = this.state.colors.slice();

        var index = colors.findIndex((typesObj)=>{
            return typesObj == color;
        })

        if(index != -1){
            return "checked";
        }
        return ""

    }

    getColors(color){
        if("b" === color)       {return <span className="mana sb"></span>}
        else if("g" === color)  {return <span className="mana sg"></span>}
        else if("c" === color)  {return <span className="mana scl"></span>}
        else if("r" === color)  {return <span className="mana sr"></span>}
        else if("u" === color)  {return <span className="mana su"></span>}
        else if("w" === color)  {return <span className="mana sw"></span>}
    }

    containMatchChange(e){
        this.props.updateContainMatch(e.target.value);
        this.setState({containMatch : e.target.value});
    }

    containMatchChecked(containMatch){
        if(containMatch == this.state.containMatch){
            return "checked";
        }
        return "";
    }


    containArchetypesDecksChange(e){
        this.props.updateArchetypesDecks(e.target.value);
        this.setState({archetypesDecks : e.target.value});
    }

    containArchetypesDecksChecked(archetypesDecks){
        if(archetypesDecks == this.state.archetypesDecks){
            return "checked";
        }

        return "";
    }

    render() {
        return (
            <div className="searchOptions">
                <div className="optionsGroupName" >
                    <div className="header">
                        Type
                    </div>
                    {["aggro", "combo", "control"].map((option)=>{
                        return  <div key={option} className="checkbox">
                                    <label>
                                        <input type="checkbox" role="checkbox" value={option} onChange={this.typeChange.bind(this)} checked={this.typesChecked(option)}/>
                                        {option.toTitleCase()}
                                    </label>
                                </div>
                    })}
                </div>
                <div className="optionsGroupName">
                    <div className="header">
                        Colors
                    </div>
                    {["b", "c", "g", "r", "u", "w"].map((option)=>{
                        return  <div key={option} className="checkbox">
                                    <label>
                                        <input type="checkbox" role="checkbox" value={option.charAt(0)} onChange={this.colorChange.bind(this)} checked={this.colorChecked(option.charAt(0))}/>
                                        {this.getColors(option)}
                                    </label>
                                </div>
                    })}
                    {["contain", "match"].map((option)=>{
                        return  <div key={option} className="radio">
                                    <label><input type="radio" name="optionsRadio" value={option} onChange={this.containMatchChange.bind(this)} checked={this.containMatchChecked(option)} />{option.toTitleCase()}</label>
                                </div>
                    })}
                    {/*{["archetypes", "decks"].map((option)=>{*/}
                        {/*return  <div key={option} className="radio">*/}
                                    {/*<label><input type="radio" name="archetypesDecks" value={option} onChange={this.containArchetypesDecksChange.bind(this)} checked={this.containArchetypesDecksChecked({option})} />{option.toTitleCase()}</label>*/}
                                {/*</div>*/}
                    {/*})}*/}
                </div>

                <AutoComplete updateCards={this.props.updateCards}/>
            </div>
        )
    }
}

