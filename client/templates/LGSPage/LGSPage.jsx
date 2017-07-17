import React from 'react' ;
import LGSPageMeta from './LGSPageMeta/LGSPageMeta.jsx';
import LGSPageCalendar from './LGSPageCalendar/LGSPageCalendar.jsx';
import LGSLatestEvents from './LGSLatestEvents/LGSLatestEvents.jsx';


export default class LGSPage extends React.Component {
    constructor(){
        super();

        this.state = {LGS_id : FlowRouter.getParam("LGS_id")}
    }

    render(){
        return(
            <div className="LGSPageComponent block-body">
                <LGSPageCalendar LGS_id={this.state.LGS_id}/>
                <LGSPageMeta
                    LGS_id={this.state.LGS_id}
                />
                <LGSLatestEvents
                    LGS_id={this.state.LGS_id}
                />
            </div>
        );
    }
}