import React from 'react' ;
import MetaCardTableOptions from "./MetaTableOptions/MetaCardTableOptions.jsx"
import MetaCardValuesTable from "./MetaCardsValuesTable/MetaCardValuesTable.jsx"


export default class MetaCardTable extends React.Component {
    constructor(){
        super();
        this.state = {tableData : [], totalDecks : 0};

    }

    registerOptions(options){
        Meteor.call("getMetaCards", FlowRouter.getParam("format"), options, (err, data)=>{
            this.setState({tableData : data.cards, totalDecks : data.totalDecks});
        });
    }

    render(){
        return(
            <div className="MetaCardTableComponent">
                <MetaCardTableOptions registerOptions={this.registerOptions.bind(this)} />
                <MetaCardValuesTable tableData={this.state.tableData}
                                      totalDecks={this.state.totalDecks}
                />

            </div>
        );
    }
}