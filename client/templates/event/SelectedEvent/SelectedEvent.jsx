import React from 'react' ;
import PlayerListContainer from './PlayerList/PlayerListContainer.jsx' ;
import DeckContainer from '/client/dumbReact/Deck/DeckContainer.jsx' ;
import SelectedEventHeaderContainer from './SelectedEventHeader/SelectedEventHeaderContainer.jsx';

export default class LGSAddNewStore extends React.Component {
    constructor(){
        super();

    }

    render(){
        return(
            <div>
                <SelectedEventHeaderContainer DecksData_id={FlowRouter.getParam("DecksData_id")}
                                              Events_id={FlowRouter.getParam("Events_id")}
                />
                <div className="col-xs-3">
                    <div className="row">
                        <PlayerListContainer Events_id={FlowRouter.getParam("Events_id")}
                        />
                    </div>
                </div>
                <div className="col-xs-9">
                    <div className="row">
                        <DeckContainer DecksData_id={FlowRouter.getParam("DecksData_id")}
                                       Events_id={FlowRouter.getParam("Events_id")}
                        />
                    </div>
                </div>

            </div>
        );
    }
}
