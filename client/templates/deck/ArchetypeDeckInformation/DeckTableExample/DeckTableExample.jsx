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

    selectedDeckHandle(_id){
        if(this.state.DecksData_id != _id){
            this.setState({DecksData_id : _id});
        }
    }

    render(){

        return(
            <div className="DeckTableExampleComponent">
                <div className="col-xs-3">
                    <div className="row">
                        <DecksNamesDecksDataList   DeckName={this.props.DeckName}
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