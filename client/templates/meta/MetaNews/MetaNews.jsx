import React from 'react' ;
import NewsMetaOptions from "./MetaNewsOptions/MetaNewsOptions.jsx";
import NewsMetaValues from "./MetaNewsValues/MetaNewsValues.jsx";

export default class NewsMetaValue extends React.Component {
    constructor() {
        super();
        this.state = {tableData : [], data : {}, totalDecks : 0}
    }


    registerOptions(options){
        this.state.options = options;
        Meteor.call("getLastTwenty", this.props.Formats_id, (err, data)=>{
            this.state.data = data;
            this.updateValues(options)
        });

    }

    componentWillReceiveProps(nextProps){
        if(this.props.Formats_id != nextProps.Formats_id && this.state.options){
            Meteor.call("getLastTwenty", nextProps.Formats_id, (err, data)=>{
                this.state.data = data;
                this.updateValues(this.state.options);
            });
        }
    }




    updateValues(options){
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