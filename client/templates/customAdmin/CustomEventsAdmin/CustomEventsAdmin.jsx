import React from 'react' ;
import StateListContainer from "/client/dumbReact/StatesList/StateListContainer.jsx"
import AddEventToCollection from "./AddEventToCollection/AddEventToCollection.jsx"
import LGSEventsChecksContainer from "./LGSEventsChecks/LGSEventsChecksContainer"
export default class CustomAdmin extends React.Component{
    constructor(props){
        super();
        this.state = {};
    }

    componentDidMount(){

    }

    render(){
        return (
            <div>

                <StateListContainer collection="Events"
                                    subscription="EventsQueryProjection"
                                    notState={[]}
                                    states={["startProduction", "notFound", "notFoundOld", "exists", "mainHTMLFail", "prePublish", "published", "HTMLFail", "HTMLMain", "HTMLPartial", "HTML", "decks", "names"]}
                                    format={this.props.format}
                />
                <AddEventToCollection format={this.props.format}/>
                <LGSEventsChecksContainer format={this.props.format}/>
            </div>
        )
    }
}
