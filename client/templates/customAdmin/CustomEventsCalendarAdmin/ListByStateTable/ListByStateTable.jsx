import React from 'react' ;
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

export default class ListByStateTable extends React.Component {
    constructor(){
        super();
        this.state = {selectedRows : []}

    }

    sortTD(_id){
        return _id.substring(0, 4);
    }


    componentWillReceiveProps(){
        this.forceUpdate()
    }

    formatsArray(formats){
        var format = "";
        formats.forEach((aaaa)=>{
            format += aaaa.substring(0, 1);
        });
        return format;
    }

    selectedEvent(row, isSelected){

        var tempArray = this.state.selectedRows.concat();

        if(isSelected){
            tempArray.push(row._id);
        }else{
            var index = tempArray.findIndex((_id)=>{
                return row._id == _id
            });
            tempArray.splice(index, 1);
        }
        this.setState({selectedRows : tempArray});
    }

    onSelectAll(isSelected, rows){
        var tempArray = []
        if(isSelected==false){
            this.setState({selectedRows : tempArray});
        }else{
            var tempArray = rows.map((row)=>{
                return row._id
            })
            this.setState({selectedRows : tempArray});
        }
    }

    confirmLGSEvents(){
        Meteor.call("stateConfirmCalendarEvents", this.state.selectedRows);
    }



    render(){
        if(this.props.listLoading){
            return <div>Loading...</div>
        }

        const tableOptions = {
            options : {
                sizePerPage : 5,
                hideSizePerPage: true
            },
            selectRow : {
                selected : this.state.selectedRows,
                mode : "checkbox",
                clickToSelect : true,
                onSelect : this.selectedEvent.bind(this),
                onSelectAll : this.onSelectAll.bind(this)
            },
            data : this.props.EventsCalendar,
            pagination : true
        }

        var rows = [
            {attr : {key : "_id",       dataField : "_id",      isKey : true, dataFormat: this.sortTD}, text : "_id"},
            {attr : {key : "title",      dataField : "title",   dataFormat: this.sortTD},       text : "Title"},
            {attr : {key : "formats",    dataField : "formats", dataFormat: this.formatsArray}, text : "format"},
            {attr : {key : "start",     dataField : "start"},   text : "start"},
            {attr : {key : "state",     dataField : "state"},   text : "state"},
        ]

        return(
            <div className="ListByStateTableComponent" >
                <BootstrapTable {...tableOptions}>
                    {rows.map((row)=>{
                        return <TableHeaderColumn key={row.attr.dataField} {...row.attr}>{row.text}</TableHeaderColumn>
                    })}
                </BootstrapTable>
                <button className="btn" onClick={this.confirmLGSEvents.bind(this)}>confirm</button>
            </div>
        );
    }
}