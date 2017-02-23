import React from 'react' ;
import Moment from "moment";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";

export default class DecksNamesDecksDataList extends React.Component {
    constructor(){
        super();
    }

    results(row){
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

    sortFunc(a,b, order){
        return b.date - a.date;
    }

    deckInfo(cell, row){
        return  <div className={cell == this.props.DecksData_id ? "selected" : ""}>
                    <div onClick={()=>this.props.selectedDeckHandle(row)}>
                        {this.results(row)} - {row.player}
                    </div>
                    <div>
                        <a href={FlowRouter.path("selectedEvent", {format : FlowRouter.getParam("format"), Events_id : row.Events_id, DecksData_id : row._id})}> {eventsTypes[row.type]} {Moment(row.date).format("MM/DD")}</a>
                    </div>
                </div>
    }

    render(){
        const tableOptions = {
            options : {
                sizePerPage : 8,
                hideSizePerPage: true,
                defaultSortName: '_id',
                defaultSortOrder : "asc"
            },
            data : this.props.DecksData,
            pagination : true,
            headerStyle : {display: "none"}
        }

        return(
            <div className="DecksNamesDecksDataListComponent">
                <BootstrapTable {...tableOptions}>
                    <TableHeaderColumn isKey dataField="_id" dataSort sortFunc={this.sortFunc} dataFormat={this.deckInfo.bind(this)}>Player</TableHeaderColumn>
                </BootstrapTable>
            </div>
        );
    }
}