import React from 'react' ;
import StateList from "/client/dumbReact/StatesList/StateList.jsx";
import ListByStateTable from "./ListByState/ListByState.jsx";

export default class CustomLGSAdmin extends React.Component {
    constructor(){
        super();
    }


    render(){
        const state = ["pending", "confirmed"];

        return(
            <div className="CustomLGSAdminComponent">
                <StateList Method="getLGSStateQty"
                           states={["pending", "confirmed"]}
                />
                <ListByStateTable state={state} Formats_id={this.props.Formats_id}/>

            </div>
        );
    }
}