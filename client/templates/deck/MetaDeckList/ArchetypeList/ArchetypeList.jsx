import React from 'react' ;
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

export default class ArchetypeList extends React.Component {
    constructor(props){
        super();
        this.state = {DecksArchetypes : DecksArchetypes.find({Formats_id : props.Formats_id}).fetch()}
    }

    colorsFormat(_id, row){
        return getHTMLColorsFromArchetypes(_id);
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.Formats_id != this.props.Formats_id){
             this.setState({DecksArchetypes : DecksArchetypes.find({Formats_id : nextProps.Formats_id}).fetch()});
        }
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

    nameFilter(decksArchetypes, nameFilter){
        var array = [];
        var regex = new RegExp(nameFilter, "i")
        for(var i = 0; i < decksArchetypes.length; i++){
            if(decksArchetypes[i].name.match(regex)){
                array.push(decksArchetypes[i]);
            }
        }
        return array;
    }

    filterTypes(decksArchetypes, types){
        decksArchetypes = decksArchetypes.filter((deckArchetype)=>{
            return types.findIndex((type)=>{
                return deckArchetype.type == type
             }) >= 0;
        })
        return decksArchetypes;
    }

    nameFormat(name, row){
        return <a href={FlowRouter.path('ArchetypeDeckInformation', {format : getLinkFormat(row.Formats_id), DeckArchetype : row.link})}>{name}</a>
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

        if(this.props.nameFilter != ""){
            goodRows = this.nameFilter(goodRows, this.props.state.nameFilter);
        }

        if(this.props.state.cards.length != 0){
            goodRows = this.filterNames(goodRows);
        }

        var tableOptions = {
            options : {
                sizePerPage: 15,
                defaultSortName: 'name',
                defaultSortOrder: 'asc'
            },
            height: "595px",
            pagination : true,
            data : goodRows
        }

        return(

            <div className="ArchetypeListComponent">
                <BootstrapTable {...tableOptions}>
                    <TableHeaderColumn isKey dataField="name" dataFormat={this.nameFormat.bind(this)}>Name</TableHeaderColumn>
                    <TableHeaderColumn dataField="_id" dataFormat={this.colorsFormat}>Colors</TableHeaderColumn>
                    <TableHeaderColumn dataField="type" >Type</TableHeaderColumn>
                </BootstrapTable>
            </div>
        );
    }
}