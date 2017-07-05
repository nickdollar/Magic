import React from 'react' ;
import AutoSuggest from '/client/dumbReact/AutoSuggest/AutoSuggest';


export default class ImportFromUserDeck extends React.Component {
    constructor(){
        super();
        this.state = {UsersDecks_id : "", UsersDecks : []}

    }

    getUserDeckWithInfo(){
        console.log(":AAAAAAAAA");
        Meteor.call("getUserDeckWithInfoMethod", {UsersDecks_id : this.refs["input"].value}, (err, response)=>{
            console.log(response);
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
                <div className="options-list">
                    <div className="options-list__label">Import From Collection</div>
                    <select ref="input" className="input-options-list">
                        <option></option>
                        {sortedUsersDecksNames.map((deckArchetype)=>{
                            return <option key={deckArchetype._id} value={deckArchetype._id}>{deckArchetype.name}</option>
                        })}
                    </select>
                    <button onClick={this.getUserDeckWithInfo.bind(this)} className="options-list__button">Request</button>
                </div>
            </div>
        );
    }
}