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
        console.log(this.props.collectionsLoading)
        if(this.props.collectionsLoading){
            return <div>Loading...</div>
        }
        console.log("AAAAAAAAAAAAAAAA")

        var states = ["lgs", "scrape", "auto", "autoNotPerfect", "manual"]
        var formats = ["standard", "modern", "legacy", "vintage"];

        return (
            <div>
                <div ref="input">
                    {formats.map((opt)=>{
                        return <label key={opt} className="radio-inline"><input onChange={this.formatChange.bind(this, opt)}
                                                                                checked={this.defaultRadio(opt)} type="radio"
                                                                                value={opt}/>{opt}</label>
                    })}
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>State</th>
                            <th>Quantity</th>
                        </tr>
                    </thead>
                    {states.map((state)=>{
                        return  <tbody key={state}>
                                    <tr>
                                        <td>
                                            {state}
                                        </td>
                                        <td>
                                            {Events.find({state : state, format : this.state.format}).count()}
                                        </td>
                                    </tr>
                                </tbody>
                    })}
                </table>
            </div>
        )
    }
}
