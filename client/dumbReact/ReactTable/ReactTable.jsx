import React from 'react' ;
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';


export default class ReactTable extends React.Component {
    constructor(){
        super();

    }

    render(){
        return(
            <div className="BootstrapTableComponent">
                <div className="ListByStateTableComponent" >
                    <BootstrapTable {...this.props.options}>
                        {this.props.TableHeaderColumn.map((row)=>{
                            return <column key={row.attr.dataField} {...row.attr}>{row.text}</column>
                        })}
                    </BootstrapTable>
                </div>
            </div>
        );
    }
}