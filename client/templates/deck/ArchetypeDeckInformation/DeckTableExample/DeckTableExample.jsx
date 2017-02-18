import React from 'react' ;
import DeckListContainer from "./DeckList/DeckListContainer.jsx";
import DeckContainer from "/client/dumbReact/Deck/DeckContainer.jsx";

export default class DeckTableExample extends React.Component {
    constructor(){
        super();
        this.state = {
            selectedDeck_id : ""
        }

    }

    componentWillReceiveProps(nextProps){
        if(nextProps.listLoading==false){
            if(this.state.selectedDeck_id == "") {
                if(nextProps.DecksDataNewest != null){
                    this.setState({selectedDeck_id : nextProps.DecksDataNewest._id});
                }
            }
        }
    }

    selectedDeckHandle(row, isSelected, e){
        this.setState({selectedDeck_id : row._id});
    }

    render(){
        if(this.props.listLoading){
            return <div>Loading...</div>
        }

        var small = ["league", "daily", "lgs"];
        var big = ["SCGClassic", "SCGInviQualifier", ];
        return(
            <div className="DeckTableExampleComponent">
                <div className="tablesWrapper">
                    <div className="halfLength">
                        <DeckListContainer flowRouterDeckSelected={this.props.flowRouterDeckSelected}
                                           selectedDeckHandle={this.selectedDeckHandle.bind(this)}
                                           selectedDeck_id={this.state.selectedDeck_id}
                                           eventsType={small}
                        />
                    </div>
                    <div className="halfLength">
                        <DeckListContainer flowRouterDeckSelected={this.props.flowRouterDeckSelected}
                                           selectedDeckHandle={this.selectedDeckHandle.bind(this)}
                                           selectedDeck_id={this.state.selectedDeck_id}
                                           eventsType={big}
                        />
                    </div>
                </div>
                {this.state.selectedDeck_id != "" ?
                    <DeckContainer DecksData_id={this.state.selectedDeck_id}/> : null
                }
            </div>
        );
    }
}