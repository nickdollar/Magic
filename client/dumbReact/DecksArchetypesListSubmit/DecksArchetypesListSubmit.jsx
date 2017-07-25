import React from 'react' ;
import AutoSuggest from './AutoSuggest/AutoSuggest.jsx' ;

export default class DecksArchetypesListSubmit extends React.Component{
    constructor(props){
        super();
        this.state = {selectedDeckArchetypes : {}, changed : false};
    }

    selectedDeckArchetype({suggestion}){
        this.setState({selectedDeckArchetypes : suggestion, changed : true})
    }

    submitDeckName(){
        Meteor.call("addDecksArchetypesToDecksDataMethod", {DecksArchetypes_id : this.state.selectedDeckArchetypes._id, DecksData_id : this.props.DecksData_id}, ()=>{
            if(this.props.getDecks){
                this.props.getDecks();
            }
        });
    }

    render(){
        var decksArchetypes = DecksArchetypes.find({Formats_id : this.props.Formats_id}).fetch();

        return (
            <div className="DeckNameListSubmitComponent">
                <div className="input-group" style={{width : "100%"}} >
                    <AutoSuggest suggestions={decksArchetypes}
                                 selectedDeckArchetype={this.selectedDeckArchetype.bind(this)}
                    />
                    <span className="input-group-btn">
                        <button disabled={!this.state.changed} className="btn btn-default" type="button" style={{padding : "4px 12px 3px 12px"}} onClick={this.submitDeckName.bind(this)}>Submit</button>
                    </span>
                </div>
            </div>
        )
    }
}