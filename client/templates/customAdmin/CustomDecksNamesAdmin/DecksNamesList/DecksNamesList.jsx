import React from 'react' ;
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import FormValidate from "/client/dumbReact/FormValidate/FormValidate";
import TextFormInput from "/client/dumbReact/FormValidate/Inputs/TextFormInput/TextFormInput";
import Radio from "/client/dumbReact/FormValidate/Inputs/Radios/Radio";
import Checkbox from "/client/dumbReact/FormValidate/Inputs/Checkbox/Checkbox";
import Select2Container from "/client/dumbReact/FormValidate/Inputs/Select2/Select2Container";

export default class DecksNamesList extends React.Component {
    constructor(){
        super();
        this.states = {pageChange : 1}
    }

    colorsFormat(colors, row){
        return getHTMLColorsFromColorArray(colors)
    }

    removeDeckName(event, DecksNames_id){
        event.stopPropagation();
        Meteor.call("removeDeckName", DecksNames_id);
    }

    onPageChange (){
    }

    expandComponent(row){
        return <div className="ExpandableTableComponent">
                    <FormValidate submitMethod="updateDeckName" id={row._id} extraFields={{_id : row._id}}>
                        <TextFormInput initialValue={row.name}
                                       title="Name"
                                       objectName="name"
                        />
                        <Radio initialValue={row.Formats_id}
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
                        <Select2Container
                            title="Deck Archetype"
                            objectName="DecksArchetypes_id"
                            fieldUnique="_id"
                            fieldText="name"
                            subscription="DecksArchetypesFormat"
                            serverQuery={row.Formats_id}
                            collection="DecksArchetypes"
                            clientQuery={{format : row.Formats_id}}
                            initialValue={row.DecksArchetypes_id}
                        />
                    </FormValidate>
                </div>
    }

    isExpandableRow(row){
        return true;
    }

    removeButton(DecksNames_id){
        return <button onClick={(event)=>this.removeDeckName(event, DecksNames_id)}>X</button>
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
                    <TableHeaderColumn dataField={"Formats_id"}>format</TableHeaderColumn>
                    <TableHeaderColumn dataField={"colors"} dataFormat={this.colorsFormat}>Colors</TableHeaderColumn>
                    <TableHeaderColumn width="50px" dataField={"_id"} dataFormat={this.removeButton.bind(this)}>X</TableHeaderColumn>
                </BootstrapTable>
            </div>
        );
    }
}