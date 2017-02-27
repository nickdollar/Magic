import React from 'react' ;
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

export default class ArchetypeList extends React.Component {
    constructor(props){
        super();

        this.state = {DecksArchetypes : DecksArchetypes.find({format : props.format}).fetch()}
    }

    colorsFormat(_id, row){
        return getHTMLColorsFromArchetypes(_id);
    }

    filterColors(decksArchetypes, colors){
        var goodRows = [];
        decksArchetypes.forEach((deckArchetype)=>{
            var decksNames = DecksNames.find({DecksArchetypes_id : deckArchetype._id}).fetch();
            var colorsArray = [];
            for(var i = 0; i < decksNames.length; ++i){
                if(!decksNames[i].colors){
                    continue;
                }
                colorsArray = _.union(colorsArray, decksNames[i].colors);
            }

            var result;
            if(this.props.state.containMatch[0].checked){
                    result = colors.some(function (v) {
                        return colorsArray.indexOf(v) >= 0;
                    });

            }else{
                result = _.isEqual(colorsArray.sort(), colors.sort());
            }
            if(result == true){

                goodRows.push(deckArchetype);
            }
        })
        return goodRows;
    }

    filterTypes(decksArchetypes, types){
        decksArchetypes = decksArchetypes.filter((deckArchetype)=>{
            return types.findIndex((type)=>{
                return deckArchetype.type == type
             }) >= 0;
        })
        return decksArchetypes;
    }


    filterNames(decksArchetypes){
        var decksArchetypes_ids = decksArchetypes.map((deckArchetype)=>{
            return deckArchetype._id;
        })

        var adecksArchetypes = DecksNames.find({"main.name" : {$in : this.props.state.cards}, DecksArchetypes_id : {$in : decksArchetypes_ids}}).map((deckName)=>{
            return deckName.DecksArchetypes_id;
        });
        adecksArchetypes.unique();
        decksArchetypes = decksArchetypes.filter((obj)=>{
            return adecksArchetypes.findIndex((unique)=>{
                return obj._id == unique
            }) >= 0;
        })
        return decksArchetypes;
    }

    render(){
        var goodRows = this.state.DecksArchetypes;

        var types = this.props.state.types.filter((type)=>{
            if(type.checked){
                return true;
            }
        }).map((type)=>{
            return type.value;
        });

        var colors = this.props.state.colors.filter((color)=>{
            if(color.checked){
                return true;
            }
        }).map((color)=>{
            return color.value;
        });

        if(types != 3){
            goodRows = this.filterTypes(goodRows, types);
        }

        if(this.props.state.containMatch[0].checked == true){
            if(colors != 6 ) {
                goodRows = this.filterColors(goodRows, colors);
            }
        }else{
            goodRows = this.filterColors(goodRows, colors);
        }

        if(this.props.state.cards.length != 0){
            goodRows = this.filterNames(goodRows);
        }

        var tableOptions = {
            options : {

            },
            data : goodRows
        }

        return(
            <div className="ArchetypeListComponent">
                <BootstrapTable {...tableOptions}>
                    <TableHeaderColumn isKey dataField="name">
                        Name
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField="_id" dataFormat={this.colorsFormat}>
                        Colors
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField="type">
                        Type
                    </TableHeaderColumn>

                </BootstrapTable>
            </div>
        );
    }
}