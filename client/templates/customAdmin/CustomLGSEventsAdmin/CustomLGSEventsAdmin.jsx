import React from 'react' ;
import StateList from "/client/dumbReact/StatesList/StateList.jsx"
import ListByState from "./ListByState/ListByState.jsx"

export default class LGSEventsAdmin extends React.Component {
    constructor(){
        super();

    }

    render(){

        const state = ["created", "confirmed"];
        return(
            <div className="LGSEventsAdminComponent">
                <StateList Method="getLGSEventsStateQty"
                           states={state}
                           Formats_id={this.props.Formats_id}
                />


                <ListByState state={state} Formats_id={this.props.Formats_id}/>
            </div>
        );
    }
}