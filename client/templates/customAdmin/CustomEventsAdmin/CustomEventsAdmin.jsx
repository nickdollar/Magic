import React from 'react' ;
import StateList from "/client/dumbReact/StatesList/StateList.jsx";
import AddEventToCollection from "./AddEventToCollection/AddEventToCollection.jsx";
import LGSEventsChecksContainer from "./LGSEventsChecks/LGSEventsChecksContainer";
import FixStandardToOldStandard from "./FixStandardToOldStandard/FixStandardToOldStandard";

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
                <StateList  Method="getEventsStateQty"
                            subscription="EventsQueryProjection"
                            notState={[]}
                            states={["startProduction", "notFound", "notFoundOld", "exists", "mainHTMLFail", "created", "locked", "published", "HTMLFail", "HTMLMain", "HTMLPartial", "HTML", "decks", "names"]}
                            Formats_id={this.props.Formats_id}
                />
                <FixStandardToOldStandard/>
                <AddEventToCollection Formats_id={this.props.Formats_id}/>
                <LGSEventsChecksContainer Formats_id={this.props.Formats_id}/>
            </div>
        )
    }
}
