import React from "react";
import SearchOptions from "./SearchOptions/SearchOptions.jsx";
import ArchetypeList from "./ArchetypeList/ArchetypeList.jsx";



class MetaDeckList extends React.Component{
    constructor() {
        super();
        this.state = {
            types: [{value : "aggro", text : "Aggro", checked : true}, {value : "combo", text : "Combo", checked : true}, {value : "control", text : "Control", checked : true}],
            colors: [{value : "B", css : "sb", checked : true}, {value : "C", css : "scl", checked : true}, {value : "G", css : "sg", checked : true},
                {value : "R", css : "sr", checked : true}, {value : "U", css : "su", checked : true}, {value : "W", css : "sw", checked : true}],
            containMatch : [{value : "contain", text : "Contain", checked : true}, {value : "match", text : "Match", checked : false}],
            cards : [],
            nameFilter : ""
        }
    }

    updateTypes(index){
        var types = this.state.types.concat();

        if(types[index].checked){
            types[index].checked = false
        }else {
            types[index].checked = true
        }
        this.setState({types : types});
    }

    updateColors(index){
        var colors = this.state.colors.concat();

        if(colors[index].checked){
            colors[index].checked = false
        }else {
            colors[index].checked = true
        }
        this.setState({colors : colors});
    }

    updateContainMatch(index){
        var containMatch = this.state.containMatch.concat();
        containMatch.forEach((obj, indexObj)=>{
            if(indexObj == index){
                obj.checked = true
            }else{
                obj.checked = false;
            }
        })
        this.setState({containMatch : containMatch});
    }

    removeFromTheListMain(index){
        var cards = this.state.cards.concat();
        cards.splice(index, 1);
        this.setState({cards : cards})
    }

    nameFilter(e){
        this.setState({nameFilter : e.target.value});
    }

    autoComplete(cardName){
        var card = cardName.name;
        var index = this.state.cards.findIndex((obj)=>{
            return card.name == obj;
        });

        if(index == -1){
            var cards = this.state.cards.concat([card]);
            this.setState({cards : cards})
        }
    }

    componentWillReceiveProps(){

    }

    render() {
        return (
            <div className="row  ">
                <div className="col-xs-3">
                    <SearchOptions updateTypes={this.updateTypes.bind(this)}
                                   updateColors={this.updateColors.bind(this)}
                                   updateContainMatch={this.updateContainMatch.bind(this)}
                                   removeFromTheListMain={this.removeFromTheListMain.bind(this)}
                                   autoComplete={this.autoComplete.bind(this)}
                                   nameFilter={this.nameFilter.bind(this)}
                                   state={this.state}

                    />
                </div>
                <div className="col-xs-9">

                    <ArchetypeList cards={this.state.cards}
                                   Formats_id={this.props.Formats_id}
                                   state={this.state}
                    />
                </div>
            </div>
        )
    }
}

export default MetaDeckList;