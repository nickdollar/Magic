import React from 'react' ;
import Moment from 'moment' ;
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";


export default class DeckList extends React.Component {
    constructor(){
        super();

    }

    dataFormat(cell, row){
        return Moment(cell).format("DD/MM");

    }

    results(cell, row){
        var position = "";
        if(row.position != null){
            position += prettifyPosition(row.position) + " ";
        }


        if(row.victory != null){
            position += row.victory;

            if(row.loss != null){
                position += "-" + row.loss;

                if(row.draw != 0){
                    position += "-" + row.draw;
                }
            }
        }
        return position;
    }

    render(){

        const tableOptions = {
            options : {
                sizePerPage : 5,
                hideSizePerPage: true
            },
            selectRow : {
                    mode : "radio",
                    clickToSelect : true,
                    selected : [this.props.selectedDeck_id],
                    onSelect : this.props.selectedDeckHandle
            },
            data : this.props.DecksData,
            pagination : true
        }

        return(
            <div className="DeckListComponent">
                <div>
                    <BootstrapTable {...tableOptions}>
                        <TableHeaderColumn isKey dataField="_id" hidden>Player</TableHeaderColumn>
                        <TableHeaderColumn dataField="player" dataAlign="center" dataSort={true}>Player</TableHeaderColumn>
                        <TableHeaderColumn dataField="type" dataAlign="center" dataSort={true}>Event</TableHeaderColumn>
                        <TableHeaderColumn dataField="date" dataFormat={ this.dataFormat } dataAlign="center" dataSort={true}>Date</TableHeaderColumn>
                        <TableHeaderColumn dataField="_id" dataFormat={ this.results } dataAlign="center">Result</TableHeaderColumn>
                    </BootstrapTable>
                </div>
            </div>
        );
    }
}