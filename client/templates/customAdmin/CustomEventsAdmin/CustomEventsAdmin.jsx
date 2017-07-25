import React from 'react' ;
import StateList from "/client/dumbReact/StatesList/StateList.jsx";
import AddEventToCollection from "./AddEventToCollection/AddEventToCollection.jsx";
import LGSEventsChecksContainer from "./LGSEventsChecks/LGSEventsChecksContainer";
import FixStandardToOldStandard from "./FixStandardToOldStandard/FixStandardToOldStandard";
import ConfirmEvents from "./ConfirmEvents/ConfirmEvents";

export default class CustomAdmin extends React.Component{
    constructor(props){
        super();
        this.state = {};
    }

    componentDidMount(){

    }

    render(){
        return (
            <div className="CustomEventsAdminComponent">
                <StateList  Method="getEventsStateQtyMethods"
                            Formats_id={this.props.Formats_id}
                />
                <FixStandardToOldStandard/>
                <AddEventToCollection Formats_id={this.props.Formats_id}/>
                <LGSEventsChecksContainer Formats_id={this.props.Formats_id}/>
                <ConfirmEvents/>
                <button onClick={()=>{Meteor.call("fixDecksStateNamesMethods")}}>fixDecksStateNamesMethods</button>
            </div>
        )
    }
}
