import React from 'react' ;


export default class DecksDataStates extends React.Component{
    constructor(props){
        super();
        this.state = {states : []};
     }

     getCollectionByState(Formats_id){
        Meteor.call(this.props.Method, {Formats_id : Formats_id}, (err, response)=>{
            this.setState({states : response});
         })
     }

     componentDidMount(){
         this.getCollectionByState(this.props.Formats_id)
     }

     componentWillReceiveProps(nextProps){
         if(this.props.Formats_id != nextProps.Formats_id){
             this.getCollectionByState(nextProps.Formats_id);
         }
     }

    render(){
        return (
            <div className="StateListContainer">
                <h3>Decks Per States</h3>
                <table className="table">
                    <thead>
                        <tr>
                            <th>State</th>
                            <th>Qty</th>
                        </tr>
                    </thead>
                    {this.state.states.map((state)=>{
                        return  <tbody key={state}>
                                    <tr>
                                        <td>
                                            {state._id}
                                        </td>
                                        <td>
                                            {state.qty}
                                        </td>
                                    </tr>
                                </tbody>
                    })}
                </table>
            </div>
        )
    }
}
