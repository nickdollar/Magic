import React from 'react' ;

export default class DeckListPercentage extends React.Component{

    constructor(){
        super();
        this.state = {decksPercentage : null};
    }

    componentDidMount(){
        Meteor.call("methodFindDeckComparison", this.props.DecksData_id, (err, data)=>{
            this.setState({decksPercentage : data})
        })

    }

    submitName(DecksNames_id){
        Meteor.call("methodAddNameToDeck", {_id : this.props.DecksData_id, DecksNames_id : DecksNames_id});
    }

    render(){

        if(this.state.decksPercentage == null){
            return <div>Loading...</div>
        }

        if(this.state.decksPercentage.length == 0){
            return <div>Nothing</div>
        }
        return (
            <div className="DeckListPercentage">
                <ul className="list-group">
                    {this.state.decksPercentage.map((percentage)=>{
                        return <li key={percentage._id ? percentage._id : percentage.DecksNames_id} className="list-group-item justify-content-between">
                            <button onClick={()=>this.submitName(percentage.DecksNames_id)}>Choose This</button> {percentage.name}
                            <span className="badge badge-default badge-pill">{prettifyPercentage(percentage.result)} </span>
                        </li>
                    })}
                </ul>
            </div>
        )
    }
}
