import React from 'react' ;

class ImportByDeck extends React.Component{


    constructor(){
        super();

    }

    componentDidMount(){

        $(this.refs["input"]).select2({
            placeholder: 'Select an option'
        }).on("change", (e)=>{
            Meteor.call("importFromDeckName", this.refs["input"].value, (err, value)=>{
                this.props.setDeck(value);
            });
        });
    }

    onChange(e){

    }

    render(){
        return (
            <div className="form-group row">
                <label htmlFor="example-search-input" className="col-xs-2 col-form-label">import from deck</label>
                <div className="col-xs-10">
                    <select ref="input" style={{width: 100 +"%"}} className="select2-container form-control">
                        <option></option>
                        {this.props.DecksNames.map((DeckName)=>{
                            return <option key={DeckName._id} value={DeckName._id}>{DeckName.name}</option>
                        })}
                    </select>
                </div>
            </div>
        )
    }
}

export default ImportByDeck;