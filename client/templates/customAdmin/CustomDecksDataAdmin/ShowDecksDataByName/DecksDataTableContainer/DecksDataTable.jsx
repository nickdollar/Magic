import React from 'react' ;
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';


export default class DecksDataTable extends React.Component {
    constructor(){
        super();

    }

    select_id(DecksData_id, row){
        return <div onClick={()=>this.props.selectDeck(DecksData_id)}>{DecksData_id}</div>
    }

    render(){

        const options = {
            options : {

            },
            data : this.props.DecksData
        }

        return(
            <div className="DecksDataTableComponent">
                <BootstrapTable {...options}>
                    <TableHeaderColumn dataField="_id" isKey filter={ { type: 'TextFilter', delay: 1000 } } dataFormat={this.select_id.bind(this)}>_id</TableHeaderColumn>
                    <TableHeaderColumn dataField="state" filter={ { type: 'TextFilter', delay: 1000 } } >state</TableHeaderColumn>
                </BootstrapTable>
            </div>
        );
    }
}