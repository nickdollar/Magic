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
                                    Formats_id={this.props.Formats_id}
                />


                <ListByState state={state} Formats_id={this.props.Formats_id}/>
            </div>
        );
    }
}