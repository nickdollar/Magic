import React from 'react' ;
import StateListContainer from "/client/dumbReact/StatesList/StateListContainer.jsx";
import ListByStateTable from "./ListByState/ListByState.jsx";

export default class CustomLGSAdmin extends React.Component {
    constructor(){
        super();
    }


    render(){
        const state = ["pending", "confirmed"];

        return(
            <div className="CustomLGSAdminComponent">
                <StateListContainer collection="LGS"
                                    subscription="LGSStatesList"
                                    notState={[]}
                                    states={["pending", "confirmed"]}
                />
                <ListByStateTable state={state} Formats_id={this.props.Formats_id}/>

            </div>
        );
    }
}