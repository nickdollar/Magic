import React from 'react' ;

export default class DecksRankings extends React.Component {
    constructor(){
        super();

        this.state = {DecksRankings : []}

    }

    getDecksRankings(){
        Meteor.call("findDecksArchetypesRankingsMethod", {DecksData_id : this.props.DecksData_id}, (err, response)=>{
            this.setState({DecksRankings : response})
        })
    }

    componentDidMount(){
        this.getDecksRankings();
    }

    changeThisArchetype({DecksArchetypes_id}){
        Meteor.call("addDecksArchetypesToDecksDataMethod", {DecksData_id : this.props.DecksData_id, DecksArchetypes_id : DecksArchetypes_id}, (err, response)=>{
            this.getDecksRankings();
            this.props.getDecks();
        })
    }


    render(){
        console.log(this.state);

        return(
            <div className="DecksRankingsComponent">
                <table className="table">
                    <thead>
                        <tr>
                            <th>This</th>
                            <th>Name</th>
                            <th>Qty</th>
                            <th>Ranking</th>
                            <th>max</th>
                            <th>missing</th>
                            <th>double</th>
                            <th>Cards</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.DecksRankings.map((ranking)=>{
                            return <tr key={ranking.DecksArchetypes_id}>
                                <td><button onClick={()=>{this.changeThisArchetype({DecksArchetypes_id : ranking.DecksArchetypes_id})}} className="btn-default btn">X</button></td>
                                        <td>{ranking.archetypeName}</td>
                                        <td>{ranking.decksQty}</td>
                                <td>{Math.round(ranking.total)}</td>

                                <td>{ranking.max}</td>
                                <td>{Math.round(ranking.missing)}</td>
                                <td>{Math.round(ranking.double)}</td>
                                <td>
                                    <ul>
                                        {ranking.cards.map((card)=>{
                                            return <li key={card.Cards_id}>{`${card.Cards_id} - ${card.value}`}</li>
                                        })}
                                    </ul>
                                </td>
                            </tr>
                        })}

                    </tbody>
                </table>
            </div>
        );
    }
}