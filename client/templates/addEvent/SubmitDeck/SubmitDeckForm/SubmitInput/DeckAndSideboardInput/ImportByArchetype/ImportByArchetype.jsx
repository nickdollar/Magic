import React from 'react' ;


export default class ImportByDeck extends React.Component{
    constructor() {
        super();
    }

    componentDidMount(){

        $(this.refs["input"]).select2({
            placeholder: 'Select an option'
        }).on("change", (e)=>{

        });
    }

    requestDeck(){
        Meteor.call("importFromDecksArchetypesMethod",
            {
                DecksArchetypes_id : this.refs["input"].value,
                percentageMain  : this.refs.percentageMain.value,
                percentageSide  : this.refs.percentageSide.value
            }, (err, response)=>{
            this.props.setDeck({deck : response});
        });
    }

    render(){
        var sortedArchetypes = DecksArchetypes.find({Formats_id : this.props.event.Formats_id, decksQty : {$gte : 1}}).fetch().sort((a, b)=>{
            var name1 = a.name.toLowerCase();
            var name2 = b.name.toLowerCase();
            if(name1 < name2) {return -1};
            if(name1 < name2) {return -1};
            return 0;
        })

        return (
            <div className="ImportByArchetypeComponent">
                <div className="options-list">
                    <div className="options-list__label">Import From Archetype</div>
                    <div className="options-list__inputs">
                         <select ref="input" className="input-options-list">
                            <option></option>
                            {sortedArchetypes.map((deckArchetype)=>{
                                return <option key={deckArchetype._id} value={deckArchetype._id}>{deckArchetype.name}</option>
                            })}
                        </select>
                        <button onClick={this.requestDeck.bind(this)} className="options-list__button">Request</button>
                        <div className="input-name-number-field"><div className="input-name-number-field__name">Main:</div><input className="input-name-number-field__number" ref={"percentageMain"} type="number" min={0} max={100} defaultValue={70}/></div>
                        <div className="input-name-number-field"><div className="input-name-number-field__name">Side:</div><input className="input-name-number-field__number" ref={"percentageSide"} type="number" min={0} max={100} defaultValue={50}/></div>
                    </div>
                </div>
            </div>
        )
    }
}
/*
* <div className="importFromCollectionWrapper">
 <div className="percent">Main: <input ref={"percentageMain"} type="number" min={0} max={100} defaultValue={70}/></div>
 <div className="percent">Side: <input ref={"percentageSide"} type="number" min={0} max={100} defaultValue={50}/></div>
 <div className="deckArchetypesOptions">
 <select ref="input" style={{width: 100 +"%"}} className="select2-container form-control decksArchetypes">
 <option></option>
 {sortedArchetypes.map((deckArchetype)=>{
 return <option key={deckArchetype._id} value={deckArchetype._id}>{deckArchetype.name}</option>
 })}
 </select>
 </div>
 <div className="submitButton">
 <button onClick={this.requestDeck.bind(this)} className="btn">Request</button>
 </div>
 </div>
* */