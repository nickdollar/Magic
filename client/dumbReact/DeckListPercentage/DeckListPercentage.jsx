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



    render(){

        if(this.state.decksPercentage == null){
            return <div>Loading...</div>
        }

        if(this.state.decksPercentage.length == 0){
            return <div>Nothing</div>
        }
        return (
            <div>
                <ul className="list-group">
                    {this.state.decksPercentage.map((percentage)=>{
                        return <li key={percentage._id ? percentage._id : percentage.DecksNames_id} className="list-group-item justify-content-between">
                                {percentage.name}
                            <span className="badge badge-default badge-pill">{prettifyPercentage(percentage.result)}</span>
                        </li>
                    })}
                </ul>
            </div>
        )
    }
}
