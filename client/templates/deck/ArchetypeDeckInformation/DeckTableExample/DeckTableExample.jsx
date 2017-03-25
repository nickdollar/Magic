import React from 'react' ;
import DecksNamesDecksDataList from "./DecksNamesDecksDataList/DecksNamesDecksDataList.jsx";
import DeckAggregate from "/client/dumbReact/DeckAggregate/DeckAggregate.jsx"


export default class DeckTableExample extends React.Component {
    constructor(props){
        super();
        this.state = {
            DecksNames_id : ""
        }
    }

    newDeckName(flowRouterDeckSelected){
        var DecksNames_regex= new RegExp("^" + flowRouterDeckSelected.replace(/[-']/g, ".") + "$", "i");
        var DecksNames_id = DecksNames.findOne({name : {$regex : DecksNames_regex}})._id;
        this.setState({DecksNames_id : DecksNames_id});
    }

    componentWillReceiveProps(nextProps){
        this.newDeckName(nextProps.flowRouterDeckSelected)
    }

    selectedDeckHandle(_id){
        if(this.state.DecksData_id != _id){
            this.setState({DecksData_id : _id});
        }
    }

    componentDidMount(){
        this.newDeckName(this.props.flowRouterDeckSelected);
    }

    render(){
        return(
            <div className="DeckTableExampleComponent">
                <div className="col-xs-3">
                    <div className="row">
                        <DecksNamesDecksDataList   DecksNames_id={this.state.DecksNames_id}
                                                   selectedDeckHandle={this.selectedDeckHandle.bind(this)}
                        />
                    </div>
                </div>
                <div className="col-xs-9">
                    <div className="row">
                            <DeckAggregate DecksData_id={this.state.DecksData_id}/>
                    </div>
                </div>


            </div>
        );
    }
}

// <DeckContainer DecksData_id={this.state.selectedDeck_id}/> : null
