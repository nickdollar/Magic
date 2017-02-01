import React from 'react' ;
import StateListContainer from "/client/dumbReact/StatesList/StateListContainer.jsx"

export default class LGSEventsAdmin extends React.Component {
    constructor(){
        super();

    }

    render(){
        return(
            <div className="LGSEventsAdminComponent">
                <StateListContainer collection="LGSEvents"
                                    subscription="LGSEventsStatesList"
                                    notState={[]}
                                    states={["created", "confirmed"]}
                />
            </div>
        );
    }
}