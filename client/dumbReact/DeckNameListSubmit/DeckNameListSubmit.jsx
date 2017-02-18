import React from 'react' ;
export default class DeckNameListSubmit extends React.Component{


    constructor(props){
        super();
        this.state = {};
    }

    componentDidMount(){
        $(this.refs["input"]).select2({
            placeholder: 'Select an option',
            width : "100%"
        })  .on("change", (e)=>{
            this.setState({inputValue : e.target.value})
        })

    }
    componentDidUpdate(){

        if(this.props.listLoaded) {
            if(DecksData.findOne({_id : this.props.DecksData_id}).DecksNames_id){
                if(DecksNames.findOne({_id : DecksData.findOne({_id : this.props.DecksData_id}).DecksNames_id})){
                    if(!$(this.refs["input"]).val()){
                        $(this.refs["input"]).select2().val(DecksNames.findOne({_id : DecksData.findOne({_id : this.props.DecksData_id}).DecksNames_id})._id).trigger('change');
                    }

                };
            }

        }
    }


    // shouldComponentUpdate(){
    //
    // }

    submitDeckName(){
        Meteor.call("addDeckName_idToDeckData", this.props.DecksData_id, this.refs.input.value);
    }

    render(){
        if(!this.props.DecksNames){
            return (<div>Loading...</div>)
        }
        return (
                <div className="input-group" style={{width : "100%"}} >
                    <select ref="input" className="select2-container form-control" style={{width : "100%"}} >
                        <option></option>
                        {this.props.DecksNames.map((deckName)=>{
                            return <option key={deckName._id} value={deckName._id}>{deckName.name}</option>
                        })}
                    </select>
                    <span className="input-group-btn">
                        <button disabled={!this.state.inputValue} className="btn btn-default" type="button" style={{padding : "4px 12px 3px 12px"}} onClick={this.submitDeckName.bind(this)}>Submit</button>
                    </span>
                </div>
        )
    }
}