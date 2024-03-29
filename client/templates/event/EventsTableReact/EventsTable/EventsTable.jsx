import React from 'react' ;
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Moment from 'moment';


export default class EventsTable extends React.Component {
    constructor(){
        super();
    }

    event(data, row){
        var eventType = EventsTypes.findOne({_id : data});
        if(row.type == "lgs"){
            var LGSquery = LGS.findOne({_id : row.LGS_id});
            return <a href={FlowRouter.path("selectedEvent", {format : row.format, Events_id : row._id})}>{row.name} - {`${LGSquery.name} (${LGSquery.location.city ? LGSquery.location.city : LGSquery.location.state})`}</a>
        }else{
            return  <a href={FlowRouter.path("selectedEvent", {format : row.format, Events_id : row._id})}>{eventType.short}</a>
        }
    }

    format(data, row){
        return Formats.findOne({_id : data.Formats_id}).short();
    }

    date(data){
        return Moment(data).format("MM/DD");
    }
    shouldComponentUpdate(nextProps){
        if(nextProps.listLoading){
            return false;
        }
        return true;
    }

    render(){
        const tableOptions = {
            options : {
                sizePerPage : 8,
                hideSizePerPage: true,
                paginationSize: 3,
                defaultSortName: 'date',
                defaultSortOrder: 'desc'
            },
            hideSizePerPage: true,
            data : this.props.Events,
            pagination : true,
            ignoreSinglePage : true
        }

        return(
            <div className="EventsTableComponent">
                <BootstrapTable {...tableOptions} height='256px'>
                    <TableHeaderColumn isKey dataField="_id" hidden dataFormat={this.event}></TableHeaderColumn>
                    <TableHeaderColumn width="220" dataField="EventsTypes_id" dataFormat={this.event}>Events</TableHeaderColumn>
                    <TableHeaderColumn dataField="Formats_id" dataFormat={this.format}>Format</TableHeaderColumn>
                    <TableHeaderColumn dataAlign='center' dataField="decks">Decks</TableHeaderColumn>
                    <TableHeaderColumn dataAlign='center' dataField="date" dataFormat={this.date}>Date</TableHeaderColumn>
                </BootstrapTable>
            </div>
        );
    }
}
