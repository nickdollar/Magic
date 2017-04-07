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
        Meteor.call("stateConfirmLGSEvents", this.state.selectedRows);
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
            data : this.props.LGSEvents,
            pagination : true
        }

        var rows = [
            {attr : {key : "_id",       dataField : "_id",      isKey : true, dataFormat: this.sortTD}, text : "_id"},
            {attr : {key : "name",      dataField : "name",     dataFormat: this.sortTD},   text : "name"},
            {attr : {key : "LGS_id",    dataField : "LGS_id",   dataFormat: this.sortTD},   text : "LGS_id"},
            {attr : {key : "price",     dataField : "price"},                               text : "price"},
            {attr : {key : "Formats_id",dataField : "Formats_id"},                          text : "Formats_id"},
            {attr : {key : "rounds",    dataField : "rounds",                           },  text : "rounds"},
            {attr : {key : "day",       dataField : "day"},     text : "day"},
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