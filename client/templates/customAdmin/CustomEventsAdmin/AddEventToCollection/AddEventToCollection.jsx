import React from 'react' ;

export default class AddEventToCollection extends React.Component{
    constructor(props){
        super();
    }

    callFunction(method, data){
        Meteor.call(method, data);
    }

    render(){
        return (
            <div className="AddEventToCollectionComponent">
                <h3>Add Event To Collection</h3>
                <button onClick={()=>this.callFunction("methodEventLeagueGetNewEvents", {format : this.props.format, days : 5})}
                        type="button" style={{backgroundColor : "#3399ff"}} className="btn btn-block">Get New Dailies and Leagues</button>
                <button onClick={()=>this.callFunction("methodEventLeagueGetInfoOld", {format : this.props.format, days : 5})}
                        type="button" style={{backgroundColor : "#3399ff"}} className="btn btn-primary btn-block">Add 5 Days To Events Dailies and Leagues</button>
                <button onClick={()=>this.callFunction("fixLeagueDailyEvent")} type="button"
                        style={{backgroundColor : "#3399ff"}} className="btn btn-primary btn-block">Fix League Daily Events</button>

                <button onClick={()=>this.callFunction("methodEventMTGOPTQNewGetEvents", {format : this.props.format})} type="button" className="btn btn-primary btn-block">Get New MTGOPTQ</button>
                <button onClick={()=>this.callFunction("methodEventMTGOPTQGetInfoOld", {format : this.props.format, days : 30})} type="button" className="btn btn-primary btn-block">Add 30 Days PTQ</button>
                <button onClick={()=>this.callFunction("fixMTGOPTQEvent")} type="button" className="btn btn-primary btn-block">Fix MTGOPTQ</button>

                <button onClick={()=>this.callFunction("methodGetGPEvents", {format : this.props.format, days : 5})}
                        type="button" style={{backgroundColor : "red"}} className="btn btn-block">Get Grand Prix Events</button>
                <button onClick={()=>this.callFunction("fixGPEvent")} type="button"
                        style={{backgroundColor : "red"}} className="btn btn-primary btn-block">Fix Grand Prix Events</button>

                <button onClick={()=>this.callFunction("getStarCityGamesEvents", {format : this.props.format})}
                        type="button" style={{backgroundColor : "green"}} className="btn btn-block">Get Star City Gagmes Events</button>
                <button onClick={()=>this.callFunction("fixSCGEvent")} type="button"
                        style={{backgroundColor : "green"}} className="btn btn-primary btn-block">Fix Star City Games Events</button>
            </div>
        )
    }
}
