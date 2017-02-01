import React from "react";
import SearchOptions from "./SearchOptions.jsx";
import ArchetypeList from "./ArchetypeList.jsx";



class MetaDeckList extends React.Component{
    constructor() {
        super();
        this.state = {
            typeOptions : ["aggro", "combo", "control"],
            colors: ["b", "c", "g", "r", "u", "w"],
            containMatch : "contain",
            cards : [],
            archetypesDecks : "archetypes"
        }
    }

    updateTypesOptions(types){
        this.setState({typeOptions : types});
    }

    updateColors(colors){
        this.setState({colors : colors});
    }

    updateContainMatch(containMatch){
        this.setState({containMatch : containMatch});
    }

    updateCards(cards){
        this.setState({cards : cards});
    }

    updateArchetypesDecks(archetypesDecks){
        this.setState({archetypesDecks : archetypesDecks});
    }

    render() {
        return (
            <div className="row  ">
                <div className="col-xs-3">
                    <SearchOptions updateTypesOptions={this.updateTypesOptions.bind(this)}
                                   updateColors={this.updateColors.bind(this)}
                                   updateContainMatch={this.updateContainMatch.bind(this)}
                                   updateCards={this.updateCards.bind(this)}
                                   updateArchetypesDecks={this.updateArchetypesDecks.bind(this)}
                    />
                </div>
                <div className="col-xs-9">
                    {this.state.archetypesDecks == "archetypes" ?
                    <ArchetypeList typeOptions={this.state.typeOptions}
                                   colors={this.state.colors}
                                   containMatch = {this.state.containMatch}
                                   cards = {this.state.cards}
                                   format = {this.props.format}
                    /> :
                        null
                    }
                </div>
            </div>
        )
    }
}

export default MetaDeckList;