import React from 'react' ;
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
            this.setState({data : response})
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

        this.updateValues({options : options});
    }

    filterOptions(){

        var cardsAndArchetypes = [];
        this.state.options.forEach((option)=>{
            if(option.selected){
                cardsAndArchetypes.concat(this.state.data[option.value])
            }
        })
        return cardsAndArchetypes;
    }

    render(){

        var arrayOfThings = this.filterOptions();
        return(
            <div className="NewsMetaComponent new-cards-archetypes-component">

                <div className="meta-header__title">Newest 20 Cards/Archetypes to Meta</div>
                <ul className="new-cards-archetypes-list">
                    {this.state.options.map((option)=>{
                        return  <li key={option.value} className="new-cards-archetypes-checkboxes__option"> <input type="checkbox" onChange={()=>this.optionChanged(option.value).bind(this)} checked={option.selected}/> {option.text} </li>
                    })}
                </ul>
                <NewsMetaValues tableData={arrayOfThings}/>
            </div>
        );
    }
}