import React from 'react' ;
import StateListContainer from "/client/dumbReact/StatesList/StateListContainer.jsx"
import ListByState from "./ListByState/ListByState.jsx"

export default class LGSEventsAdmin extends React.Component {
    constructor(){
        super();

    }

    render(){

        const state = ["created", "confirmed"];
        return(
            <div className="LGSEventsAdminComponent">
                <StateListContainer collection="LGSEvents"
                                    subscription="LGSEventsStatesList"
                                    notState={[]}
                                    states={state}
                                    format={this.props.format}
                />


                <ListByState state={state} format={this.props.format}/>
            </div>
        );
    }
}