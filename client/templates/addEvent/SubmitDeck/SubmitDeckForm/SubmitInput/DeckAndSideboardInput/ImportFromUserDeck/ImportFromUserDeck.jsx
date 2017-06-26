import React from 'react' ;
import AutoSuggest from '/client/dumbReact/AutoSuggest/AutoSuggest';


export default class ImportFromUserDeck extends React.Component {
    constructor(){
        super();
        this.state = {UsersDecks_id : "", UsersDecks : []}

    }

    getUserDeckWithInfo(){
        Meteor.call("getUserDeckWithInfoMethod", {UsersDecks_id : this.refs["input"].value}, (err, response)=>{
            this.props.setDeck({deck : response});
        })
    }

    getUsersDecks(){
        Meteor.call("getUserDecksMethod", {Formats_id : this.props.event.Formats_id}, (err, response)=>{
            this.setState({UsersDecks : response})
        })
    }

    componentDidMount(){
        this.getUsersDecks();
        $(this.refs["input"]).select2({
            placeholder: 'Select an option'
        }).on("change", (e)=>{

        });

    }

    render(){
        var sortedUsersDecksNames = this.state.UsersDecks.sort((a, b)=>{
            var name1 = a.name.toLowerCase();
            var name2 = b.name.toLowerCase();
            if(name1 < name2) {return -1};
            if(name1 < name2) {return -1};
            return 0;
        })

        return(
            <div className="ImportFromUserDeckComponent">
                <label htmlFor="example-search-input" className="col-xs-2 col-form-label">Import From Collection</label>
                <div className="col-xs-10">
                    <div style={{width : "567px", display : "inline-block"}}>
                        <select ref="input" style={{width: 100 +"%"}} className="select2-container form-control decksArchetypes">
                            <option></option>
                            {sortedUsersDecksNames.map((deckArchetype)=>{
                                return <option key={deckArchetype._id} value={deckArchetype._id}>{deckArchetype.name}</option>
                            })}
                        </select>
                        {/*<AutoSuggest*/}
                            {/*getSuggestionsMethod="getUserDecksMethod"*/}
                            {/*getSuggestionMethodVariables={{Formats_id : this.props.event.Formats_id}}*/}
                            {/*AutoCompleteCallBack={this.AutoCompleteCallBack.bind(this)}*/}
                            {/*text="name"*/}
                            {/*value="_id"*/}
                        {/*/>*/}
                    </div>
                    <div style={{display : "inline-block"}}>
                        <button onClick={this.getUserDeckWithInfo.bind(this)} className="btn">Request</button>
                    </div>
                </div>
            </div>
        );
    }
}