import React from 'react' ;

export default class AddEventToCollection extends React.Component{
    constructor(props){
        super();
        this.state = {showObjects : false,
            showFixComponent : false};
    }

    callFunction(method, data){
        Meteor.call(method, data);
    }
k
    render(){
        return (
            <div>
                <button onClick={()=>this.callFunction("methodEventLeagueGetNewEvents", {format : "standard", days : 5})}
                        type="button" style={{backgroundColor : "#3399ff"}} className="btn btn-block">Get New Dailies and Leagues</button>
                <button onClick={()=>this.callFunction("methodEventLeagueGetInfoOld", {format : "standard", days : 5})}
                        type="button" style={{backgroundColor : "#3399ff"}} className="btn btn-primary btn-block">Add 5 Days To Events Dailies and Leagues</button>
                <button onClick={()=>this.callFunction("fixLeagueDailyEvent")} type="button"
                        style={{backgroundColor : "#3399ff"}} className="btn btn-primary btn-block">Fix League Daily Events</button>

                <button onClick={()=>this.callFunction("methodEventMTGOPTQGetInfoOld", {format : "standard", days : 30})} type="button" className="btn btn-primary btn-block">Get New MTGOPTG</button>
                <button onClick={()=>this.callFunction("methodEventLeagueGetInfoOld", {format : "standard", days : 30})} type="button" className="btn btn-primary btn-block">Add 5 Days To Events Dailies and Leagues</button>
                <button onClick={()=>this.callFunction("fixMTGOPTQEvent")} type="button" className="btn btn-primary btn-block">Fix MTGOPTQ</button>

                <button onClick={()=>this.callFunction("methodGetGPEvents", {format : "standard", days : 5})}
                        type="button" style={{backgroundColor : "red"}} className="btn btn-block">Get Grand Prix Events</button>
                <button onClick={()=>this.callFunction("fixGPEvent")} type="button"
                        style={{backgroundColor : "red"}} className="btn btn-primary btn-block">Fix Grand Prix Events</button>

                <button onClick={()=>this.callFunction("getStarCityGamesEvents", {format : "standard"})}
                        type="button" style={{backgroundColor : "green"}} className="btn btn-block">Get Star City Gagmes Events</button>
                <button onClick={()=>this.callFunction("fixSCGEvent")} type="button"
                        style={{backgroundColor : "green"}} className="btn btn-primary btn-block">Fix Star City Games Events</button>
            </div>
        )
    }
}
