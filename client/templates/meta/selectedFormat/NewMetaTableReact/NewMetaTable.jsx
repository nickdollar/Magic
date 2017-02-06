import React from 'react' ;
import NewMetaTableOptions from "../NewsTableReact/NewsMetaOptions/MetaTableOptions.jsx";
import ValuesTable from "../NewsTableReact/ValuesTable/ValuesTable.jsx";

export default class NewMetatable extends React.Component {
    constructor() {
        super();
        this.state = {tableData : [], totalDecks : 0}
    }


    registerOptions(options){
        Meteor.call("getMetaAllArchetypes", FlowRouter.getParam("format"), options, (err, data)=>{
            var totalDecks = data.reduce((a, b)=>{
                return  a + b.quantity;
            },0);
            this.setState({tableData : data, totalDecks : totalDecks});
        });
    }

    

    render(){

        return(
            <div className="NewMetaTableComponent">
                <NewMetaTableOptions registerOptions={this.registerOptions.bind(this)}/>
                <ValuesTable tableData={this.state.tableData}
                             totalDecks={this.state.totalDecks}
                />
            </div>
        );
    }
}