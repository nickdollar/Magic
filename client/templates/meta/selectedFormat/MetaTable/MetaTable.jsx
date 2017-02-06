import React from 'react' ;
import MetaTableOptions from './NewsMetaOptions/NewsMetaOptions.jsx';
import ValuesTable from './ValuesTable/ValuesTable.jsx';



export default class NewsReactTable extends React.Component {
    constructor(){
        super();

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
            <div className="NewsReactTableComponent">
                <MetaTableOptions registerOptions={this.registerOptions.bind(this)}/>
                <ValuesTable tableData={this.state.tableData}
                              totalDecks={this.state.totalDecks}
                />
            </div>
        );
    }
}