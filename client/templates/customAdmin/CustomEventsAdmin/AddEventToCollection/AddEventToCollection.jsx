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
                <button onClick={()=>this.callFunction("getLeagueEventsAndDecksMethod", {format : this.props.format, days : 5, dateType : "lastDays"})}
                        type="button" style={{backgroundColor : "#3399ff"}} className="btn btn-primary btn-block">getLeagueEventsAndDecks - lastDays</button>
                <button onClick={()=>this.callFunction("getLeagueEventsAndDecksMethod", {format : this.props.format, days : 5, dateType : "oldDays"})}
                        type="button" style={{backgroundColor : "#3399ff"}} className="btn btn-primary btn-block">getLeagueEventsAndDecks - oldDays</button>
                <button onClick={()=>this.callFunction("getMTGOPTQEventsAndDecksMethod", {format : this.props.format, dateType : "oldDays"})} type="button" className="btn btn-primary btn-block">getMTGOPTQEventsAndDecks - oldDays</button>
                <button onClick={()=>this.callFunction("getMTGOPTQEventsAndDecksMethod", {format : this.props.format, dateType : "lastDays"})} type="button" className="btn btn-primary btn-block">getMTGOPTQEventsAndDecks - lastDays</button>
                <button onClick={()=>this.callFunction("getGpEventsAndDecksMethod", {})}
                        type="button" style={{backgroundColor : "red"}} className="btn btn-block">getGpEventsAndDecks</button>
                <button onClick={()=>this.callFunction("getGPPositionMethod", {format : this.props.format, days : 5})}
                        type="button" style={{backgroundColor : "red"}} className="btn btn-block">getGPPosition</button>
                <button onClick={()=>this.callFunction("getSCGEventsAndDecksMethod", {format : this.props.format})}
                        type="button" style={{backgroundColor : "green"}} className="btn btn-block">getSCGEventsAndDecksMethod</button>
                <button onClick={()=>this.callFunction("getSCGDecksCardsMethod")} type="button"
                        style={{backgroundColor : "green"}} className="btn btn-primary btn-block">getSCGDecksCards</button>
            </div>
        )
    }
}
