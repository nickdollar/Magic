import React from 'react' ;
import NewsMetaTableOptions from "../MetaTable/MetaTableOptions/MetaTableOptions.jsx";
import NewsTableOptions from "./NewsTableOptions/NewsTableOptions.jsx";

export default class NewMetatable extends React.Component {
    constructor() {
        super();
        this.state = {tableData : [], totalDecks : 0}
    }


    registerOptions(options){
        // Meteor.call("getMetaAllArchetypes", FlowRouter.getParam("format"), options, (err, data)=>{
        //     var totalDecks = data.reduce((a, b)=>{
        //         return  a + b.quantity;
        //     },0);
        //     this.setState({tableData : data, totalDecks : totalDecks});
        // });
    }

    

    render(){

        return(
            <div className="NewMetaTableComponent">
                <NewsMetaTableOptions registerOptions={this.registerOptions.bind(this)}/>
                <NewsTableOptions tableData={this.state.tableData}
                             totalDecks={this.state.totalDecks}
                />
            </div>
        );
    }
}