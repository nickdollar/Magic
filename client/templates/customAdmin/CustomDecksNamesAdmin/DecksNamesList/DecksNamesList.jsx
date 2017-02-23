import React from 'react' ;
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import FormValidate from "/client/dumbReact/FormValidate/FormValidate";
import TextFormInput from "/client/dumbReact/FormValidate/Inputs/TextFormInput/TextFormInput";
import Radio from "/client/dumbReact/FormValidate/Inputs/Radios/Radio";
import Checkbox from "/client/dumbReact/FormValidate/Inputs/Checkbox/Checkbox";

export default class DecksNamesList extends React.Component {
    constructor(){
        super();
        this.states = {pageChange : 1}
    }

    colorsFormat(colors, row){
        return getHTMLColorsFromColorArray(colors)
    }

    removeDeckName(DecksArchetypes_id){
        event.stopPropagation();
        Meteor.call("removeDecksArchetypes", DecksArchetypes_id);
    }

    onPageChange (){
    }

    expandComponent(row){
        return <div className="ExpandableTableComponent">
                    <FormValidate submitMethod="updateDeckName" extraFields={{_id : row._id}}>
                        <TextFormInput initialValue={row.name}
                                       title="Name"
                                       objectName="name"
                        />
                        <Radio initialValue={row.format}
                               title="Format"
                               objectName="format"
                               opts={[{value : "standard", text : "Standard"},
                                   {value : "modern", text : "Modern"},
                                   {value : "vintage", text : "Vintage"},
                                   {value : "legacy", text : "Legacy"}, ]}
                        />
                        <Checkbox   initialValue={row.colors}
                                    title="Colors"
                                    objectName="colors"
                                    opts={[ {value : "B", text : "B"},
                                        {value : "C", text : "C"},
                                        {value : "G", text : "G"},
                                        {value : "R", text : "R"},
                                        {value : "U", text : "U"},
                                        {value : "W", text : "W"},
                                    ]}
                        />
                    </FormValidate>
                </div>
    }

    isExpandableRow(row){
        return true;
    }

    removeButton(DecksNames_id){
        return <button onClick={()=>this.removeDeckName(DecksNames_id)}>X</button>
    }

    render(){
        const options = {
            options : {
                sizePerPage : 5,
                hideSizePerPage: true,
                defaultSortName: 'name',
                defaultSortOrder: 'asc',
                onPageChange : this.onPageChange.bind(this)
            },
            expandComponent : this.expandComponent.bind(this),
            expandableRow : this.isExpandableRow.bind(this),
            pagination : true,
            data : this.props.DecksNames,
        }

        return(
            <div className="DecksNamesListComponent">
                <h3>Decks Names List</h3>
                <BootstrapTable ref="table" {...options}>
                    <TableHeaderColumn isKey dataField={"_id"} dataSort>_id</TableHeaderColumn>
                    <TableHeaderColumn dataField={"name"} dataSort>Name</TableHeaderColumn>
                    <TableHeaderColumn dataField={"format"}>format</TableHeaderColumn>
                    <TableHeaderColumn dataField={"colors"} dataFormat={this.colorsFormat}>Colors</TableHeaderColumn>
                    <TableHeaderColumn width="50px" dataField={"_id"} dataFormat={this.removeButton.bind(this)}>X</TableHeaderColumn>
                </BootstrapTable>
            </div>
        );
    }
}