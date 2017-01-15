import React from 'react' ;


export default class EventsStates extends React.Component{
    constructor(props){
        super();
     }

    render(){
        if(this.props.collectionsLoading){
            return <div>Loading...</div>
        }

        var states = ["startProduction", "notFound", "notFoundOld", "exists", "mainHTMLFail", "HTMLFail", "HTMLMain",
            "HTMLPartial", "HTML", "decks", "names"]

        return (
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
                                        {Events.find({state : state}).count()}
                                    </td>
                                </tr>
                            </tbody>
                })}
            </table>
        )
    }
}
