import React from "react";
import AutoComplete from "./AutoComplete.jsx";

class SearchOptions extends React.Component{
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
        var types = this.state.typeOptions.slice();

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
                    <div className="checkbox">
                        <label>
                            <input type="checkbox" role="checkbox" value="aggro" onChange={this.typeChange.bind(this)} checked={this.typesChecked("aggro")}/>
                                Aggro
                        </label>
                    </div>
                    <div className="checkbox">
                        <label>
                            <input type="checkbox" role="checkbox" value="combo" onChange={this.typeChange.bind(this)} checked={this.typesChecked("combo")} />
                                Combo
                        </label>
                    </div>
                    <div className="checkbox">
                        <label>
                            <input type="checkbox" role="checkbox" value="control" onChange={this.typeChange.bind(this)} checked={this.typesChecked("control")} />
                                Control
                        </label>
                    </div>
                </div>
                <div className="optionsGroupName">
                    <div className="header">
                        Colors

                    </div>
                    <div className="checkbox">
                        <label>
                            <input type="checkbox" role="checkbox" value="b" onChange={this.colorChange.bind(this)} checked={this.colorChecked("b")}/>
                                Black
                        </label>
                    </div>
                    <div className="checkbox">
                        <label>
                            <input type="checkbox" role="checkbox" value="c" onChange={this.colorChange.bind(this)} checked={this.colorChecked("c")}/>
                                Colorless
                        </label>
                    </div>
                    <div className="checkbox">
                        <label>
                            <input type="checkbox" role="checkbox" value="g" onChange={this.colorChange.bind(this)} checked={this.colorChecked("g")}/>
                                Green
                        </label>
                    </div>
                    <div className="checkbox">
                        <label>
                            <input type="checkbox" role="checkbox" value="r" onChange={this.colorChange.bind(this)} checked={this.colorChecked("r")}/>
                                Red
                        </label>
                    </div>
                    <div className="checkbox">
                        <label>
                            <input type="checkbox" role="checkbox" value="u" onChange={this.colorChange.bind(this)} checked={this.colorChecked("u")}/>
                                Blue
                        </label>
                    </div>
                    <div className="checkbox">
                        <label>
                            <input type="checkbox" role="checkbox" value="w" onChange={this.colorChange.bind(this)} checked={this.colorChecked("w")}/>
                                White
                        </label>
                    </div>

                    <div className="radio">
                        <label><input type="radio" name="optionsRadio" value="contain" onChange={this.containMatchChange.bind(this)} checked={this.containMatchChecked("contain")} />Contain</label>
                    </div>
                    <div className="radio">
                        <label><input type="radio" name="optionsRadio" value="match"  onChange={this.containMatchChange.bind(this)} checked={this.containMatchChecked("match")} />Match</label>
                    </div>

                    <div className="radio">
                        <label><input type="radio" name="archetypesDecks" value="archetypes" onChange={this.containArchetypesDecksChange.bind(this)} checked={this.containArchetypesDecksChecked("archetypes")} />Archetypes</label>
                    </div>
                    <div className="radio">
                        <label><input type="radio" name="archetypesDecks" value="decks"  onChange={this.containArchetypesDecksChange.bind(this)} checked={this.containArchetypesDecksChecked("decks")} />Decks</label>
                    </div>
                </div>
                <AutoComplete updateCards={this.props.updateCards}/>
            </div>
        )
    }
}

export default SearchOptions;