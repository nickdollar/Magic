import React from 'react' ;


export default class DecksDataStates extends React.Component{
    constructor(props){
        super();
        this.state = {Formats_id : props.Formats_id};
     }

    defaultRadio(opt){
        if(opt == this.state.Formats_id){
            return true
        }
        return false;
    }

    Formats_idChange(e){
        this.setState({Formats_id : e});
    }


    render(){
        if(this.props.collectionsLoading){
            return <div>Loading...</div>
        }
        return (
            <div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>State</th>
                            <th>Quantity</th>
                        </tr>
                    </thead>
                    {this.props.states.map((state)=>{
                        return  <tbody key={state}>
                                    <tr>
                                        <td>
                                            {state}
                                        </td>
                                        <td>
                                            {this.props.Formats_id ? global[this.props.collection].find({state : state, Formats_id : this.props.Formats_id}).count() :
                                                global[this.props.collection].find({state : state}).count()
                                            }
                                        </td>
                                    </tr>
                                </tbody>
                    })}
                </table>
            </div>
        )
    }
}
