import React from 'react' ;


export default class DecksDataStates extends React.Component{
    constructor(props){
        super();
        this.state = {format : "modern"};
     }

    defaultRadio(opt){
        if(opt == this.state.format){
            return true
        }
        return false;
    }

    formatChange(e){
        this.setState({format : e});
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
                                            {this.props.format ? global[this.props.collection].find({state : state, format : this.props.format}).count() :
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
