import React from 'react' ;
import StateListContainer from "/client/dumbReact/StatesList/StateListContainer.jsx";
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
                <StateListContainer collection="Events"
                                    subscription="EventsQueryProjection"
                                    notState={[]}
                                    states={["startProduction", "notFound", "notFoundOld", "exists", "mainHTMLFail", "created", "locked", "published", "HTMLFail", "HTMLMain", "HTMLPartial", "HTML", "decks", "names"]}
                                    format={this.props.format}
                />
                <FixStandardToOldStandard/>
                <AddEventToCollection format={this.props.format}/>
                <LGSEventsChecksContainer format={this.props.format}/>
            </div>
        )
    }
}
