import React from 'react' ;
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';


export default class Sideboard extends React.Component {
    constructor(){
        super();
        this.state = {sideboard : []};
    }

    getSideboard(){
        Meteor.call("getSideboardMethods", {DecksArchetypes_id : this.props.DecksArchetypes_id}, (err, response)=>{
            if(response){
                this.setState({sideboard : response})
            }
        })
    }

    componentDidMount(){
        this.getSideboard();
        cardPopoverNames(".js-imagePopOverSideboard", true);
    }

    percentFix(cell, row){
        return roundTo(cell, 2);
    }

    Cards_id(cell, row){
        return <span className="js-imagePopOverSideboard" data-names={`["${cell}"]`} data-layout="normal">{cell}</span>;
    }

    handleTableComplete(){
        cardPopoverNames(".js-imagePopOverSideboard", true);
    }

    render(){
        const tableOptions = {
            options : {
                sizePerPage : 5,
                sizePerPageList: [ 5, {text : "All", value : this.state.sideboard.length} ],
                afterTableComplete: this.handleTableComplete
            },
            data : this.state.sideboard,
            pagination : true,
        }
        return(
            <div className="SideboardComponent">
                <h3>Sideboard Cards</h3>
                <BootstrapTable {...tableOptions}>
                    <TableHeaderColumn isKey={true} dataField="Cards_id" dataFormat={ this.Cards_id }>Card Name</TableHeaderColumn>
                    <TableHeaderColumn dataField="qty">Quantity</TableHeaderColumn>
                    <TableHeaderColumn dataField="avg" dataFormat={ this.percentFix }>Average</TableHeaderColumn>
                </BootstrapTable>
            </div>
        );
    }
}