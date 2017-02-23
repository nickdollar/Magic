import React from 'react' ;
import DecksNamesDecksDataList from "./DecksNamesDecksDataList/DecksNamesDecksDataList.jsx";

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
        if(this.state.selectedDeck_id != _id){
            this.setState({selectedDeck_id : _id});
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
                        {this.state.selectedDeck_id != "" ?
                            <DeckContainer DecksData_id={this.state.selectedDeck_id}/> : null
                        }
                    </div>
                </div>


            </div>
        );
    }
}