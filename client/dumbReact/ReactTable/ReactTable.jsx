import React from 'react' ;
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';


export default class ReactTable extends React.Component {
    constructor(){
        super();

    }

    render(){
        if(this.props.listLoading){
            return <div>Loading...</div>
        }

        return(
            <div className="BootstrapTableComponent">
                <BootstrapTable {...this.props.options} data={this.props.rows}>
                    {this.props.columns.map((row)=>{
                        return <TableHeaderColumn key={row.attr.dataField} {...row.attr}>{row.text}</TableHeaderColumn>
                    })}
                </BootstrapTable>
            </div>
        );
    }
}