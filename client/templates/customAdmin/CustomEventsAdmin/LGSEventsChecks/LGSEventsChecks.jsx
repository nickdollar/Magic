import React from 'react' ;
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

export default class LGSEventsChecks extends React.Component {
    constructor(){
        super();

    }

    linkFormat(_id, row){
        return <a href={FlowRouter.path("adminEvent", {Event_id : _id})}> Link </a>
    }

    render(){
        console.log(this.props);
        const options = {
            options : {

            },
            data : this.props.Events
        }
        return(
            <div className="LGSEventsChecksComponent">
                <BootstrapTable {...options}>
                    <TableHeaderColumn isKey dataField="_id">_id</TableHeaderColumn>
                    <TableHeaderColumn dataField="date">Date</TableHeaderColumn>
                    <TableHeaderColumn dataField="state">State</TableHeaderColumn>
                    <TableHeaderColumn dataField="_id" dataFormat={this.linkFormat}>link</TableHeaderColumn>
                </BootstrapTable>
            </div>
        );
    }
}