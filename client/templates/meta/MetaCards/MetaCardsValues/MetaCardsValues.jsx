import React from 'react' ;
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

export default class MetaCardsValues extends React.Component {
    constructor(){
        super();

    }

    percentageColumn(cell, row){
        if(this.props.totalDecks==0){
            return 0;
        }
        return prettifyPercentage(cell/this.props.totalDecks, 1) + "%";
    }

    avgColumn(cell, row){
        if(this.props.totalDecks==0){
            return 0;
        }
        return (cell/row.count).toFixed(1);
    }

    // percentageSortFunction(a, b, order) {   // order is desc or asc
    //     if (order === 'desc') {
    //         return a.price - b.price;
    //     } else {
    //         return b.price - a.price;
    //     }
    // }

    render(){
        const options =
            {
                options : {
                    pagination : true,
                    sizePerPage : 8,
                    paginationSize : 2,
                    defaultSortName : "count",
                    defaultSortOrder : "desc"
                },
                data : this.props.tableData,
                pagination : true
        }

        return(
            <div className="MetaCardsValuesComponent">
                <BootstrapTable {...options}>
                    <TableHeaderColumn dataField="_id" isKey>Card</TableHeaderColumn>
                    <TableHeaderColumn width="50" dataField="total" dataFormat={this.avgColumn.bind(this)}>Avg.</TableHeaderColumn>
                    <TableHeaderColumn width="60" dataField="count" dataFormat={this.percentageColumn.bind(this)}>%</TableHeaderColumn>
                </BootstrapTable>

            </div>
        );
    }
}