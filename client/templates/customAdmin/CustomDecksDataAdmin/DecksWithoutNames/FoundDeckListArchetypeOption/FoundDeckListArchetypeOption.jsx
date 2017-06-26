import React from 'react' ;

export default class FoundDeckListArchetypeOption extends React.Component {
    constructor() {
        super();
        this.state = {foundArchetypes: [], landsBestOptions : {}, nonlandsBestOptions : {}}
    }

    getBestMatch(){
        Meteor.call("getBestMatchMethod", {DecksData_id : this.props.DecksData_id}, (err, response)=>{
            this.setState({foundArchetypes : response});
        })
        Meteor.call("findAllCardsMethodNonLands", {DecksData_id : this.props.DecksData_id}, (err, response)=>{
            this.setState({nonlandsBestOptions : response})
        })
        Meteor.call("findAllCardsMethodWithLands", {DecksData_id : this.props.DecksData_id}, (err, response)=>{
            this.setState({landsBestOptions : response})
        })
    }

    componentDidMount(){
        this.getBestMatch();
    }

    submitArchetypeLandsBestOptions(){
        Meteor.call("addDecksArchetypesToDecksDataMethod", {DecksData_id : this.props.DecksData_id, DecksArchetypes_id : this.state.landsBestOptions.DecksArchetypes_id}, (err, response)=>{
            this.props.getDecks()
        })
    }

    submitArchetypeNonLandsBestOption(){
        Meteor.call("addDecksArchetypesToDecksDataMethod", {DecksData_id : this.props.DecksData_id, DecksArchetypes_id : this.state.nonlandsBestOptions.DecksArchetypes_id}, (err, response)=>{
            this.props.getDecks()
        })
    }

    render(){
        console.log(this);
        return(
            <div className="FoundDeckListArchetypeOptionComponent">
                <div>
                    <button className="btn btn-default" onClick={()=>{this.submitArchetypeLandsBestOptions()}}>
                        With Lands - {!isObjectEmpty(this.state.landsBestOptions) ? `${this.state.landsBestOptions.name} ${this.state.landsBestOptions.foundQty}/${this.state.landsBestOptions.cardsQty} ${parseInt(this.state.landsBestOptions.percentage*100)}` : null}
                    </button>
                </div>
                <div>
                    <button className="btn btn-default" onClick={()=>{this.submitArchetypeNonLandsBestOption()}}>
                        Without Lands - {!isObjectEmpty(this.state.nonlandsBestOptions) ? `${this.state.nonlandsBestOptions.name} -  ${this.state.nonlandsBestOptions.foundQty}/${this.state.nonlandsBestOptions.cardsQty} ${parseInt(this.state.nonlandsBestOptions.percentage * 100)}` : null}
                    </button>
                </div>
            </div>
        );
    }
}