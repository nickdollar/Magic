import React from 'react' ;
import Moment from "moment";

// SCGSuperIQ|SCGInviQualifier|SCGInvitational|SCGClassic|SCGOpen|SCGPlayers'Championship|GrandPrix|LegacyChamps|WorldMagicCup

export default class NewMetaTableOptions extends React.Component {
    constructor() {
        super();
        this.state = {
            options : [
                {value : "deck", text : "Decks", selected : true},
                {value : "archetype", text : "Archetypes", selected : true},
                {value : "card", text : "Cards", selected : true}
            ]

        }
    }

    dateSelectedHandle(event, type){
        var temp = {};
        temp[type] = Moment(event.target.value).toDate();
        this.setState(temp);
    }

    positionSelectedHandle(event, type){
        var temp = {}
        temp[type] = parseInt(event.target.value);
        this.setState(temp);
    }

    requestQuery(){
        var options = [];
        this.state.options.forEach((option)=>{
            if(option.selected){
                options.push(option.value);
            }
        })

        this.props.registerOptions(options);
    }

    updateOptions(){
        this.props.registerOptions(this.requestQuery());
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
        this.requestQuery()

        this.setState({options : temp});
    }

    componentDidMount(){
        this.requestQuery();
    }

    render(){
        return(
            <div className="NewsTableOptionsComponent">
                <div className="custom-column">
                    {this.state.options.map((option)=>{
                        return  <label key={option.value} className="checkbox-inline">
                                    <input type="checkbox" onChange={()=>this.optionChanged(option.value)} value={option.value} checked={option.selected}/> {option.text}
                                </label>
                    })}
                </div>
            </div>
        );
    }
}