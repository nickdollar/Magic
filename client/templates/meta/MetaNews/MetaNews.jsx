import React from 'react' ;
import NewsMetaOptions from "./NewsMetaOptions/NewsMetaOptions.jsx";
import NewsMetaValues from "./NewsMetaValues/NewsMetaValues.jsx";

export default class NewsMetaValue extends React.Component {
    constructor() {
        super();
        this.state = {tableData : [], data : {}, totalDecks : 0}
    }


    registerOptions(options){
        var data = [];
        var temp = Object.assign({}, this.state.data);
        options.forEach((option)=>{
            if(temp.newestDecks && option=="deck") data = data.concat(temp.newestDecks.concat());
            if(temp.newestArchetypes && option=="archetype") data = data.concat(temp.newestArchetypes.concat());
            if(temp.newestCards && option=="card") data =  data.concat(temp.newestCards.concat());
        });
        this.setState({tableData : data});
    }


    componentDidMount(){
        Meteor.call("getLastTwenty", FlowRouter.getParam("format"), (err, data)=>{
            var array = [].concat(data.newestDecks, data.newestArchetypes, data.newestCards);
            this.setState({data : data, tableData : array});
        });
    }

    render(){

        return(
            <div className="NewsMetaComponent">
                <NewsMetaOptions registerOptions={this.registerOptions.bind(this)}/>
                <NewsMetaValues tableData={this.state.tableData}
                />
            </div>
        );
    }
}