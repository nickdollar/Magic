import React from 'react' ;
import NewsMetaOptions from "./MetaNewsOptions/MetaNewsOptions.jsx";
import NewsMetaValues from "./MetaNewsValues/MetaNewsValues.jsx";

export default class NewsMetaValue extends React.Component {
    constructor() {
        super();
        this.state = {tableData : [], data : {}, totalDecks : 0,
            options : [
                {value : "newestArchetypes", text : "Archetypes", selected : true},
                {value : "newestCards", text : "Cards", selected : true}
            ]
        }
    }

    registerOptions(){
        Meteor.call("getMetaLastAddition", {Formats_id : this.props.Formats_id}, (err, response)=>{
            this.updateValues({data :response})
        });
    }

    componentWillReceiveProps(nextProps){
        if(this.props.Formats_id != nextProps.Formats_id && this.state.options){
            this.registerOptions();
        }
    }

    componentDidMount(){
        this.registerOptions();
    }

    optionChanged(option){
        var temp = this.state.options.concat();
        var index = temp.findIndex((opt)=>{
            return opt.value == option
        });

        if(temp[index].selected){
            temp[index].selected = false;
        }else{
            temp[index].selected = true;
        }

        this.updateValues();
    }

    updateValues({data}){
        if(!data){
            return;
        }
        var dataArray = [];
        this.state.options.forEach((option)=>{
            if(option.selected){
                dataArray = dataArray.concat(data[option.value].concat());
            }
        });

        this.setState({tableData : dataArray});
    }

    render(){

        return(
            <div className="NewsMetaComponent">
                <div className="metaTitle"><h4>Newest 20 Cards/Archetypes to Meta</h4></div>
                <NewsMetaOptions registerOptions={this.registerOptions.bind(this)}/>
                {this.state.options.map((option)=>{
                    return  <label key={option.value} className="checkbox-inline">
                        <input type="checkbox" onChange={()=>this.optionChanged(option.value).bind(this)} value={option.value} checked={option.selected}/> {option.text}
                    </label>
                })}
                <NewsMetaValues tableData={this.state.tableData}/>
            </div>
        );
    }
}