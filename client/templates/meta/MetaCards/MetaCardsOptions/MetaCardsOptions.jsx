import React from 'react' ;
import Moment from "moment";

export default class NewMetaTableOptions extends React.Component {
    constructor() {
        super();


        var date = new Date();

        var venues = [];
        var eventsTypes = EventsTypes.find().fetch();


        for(var i = 0; i< eventsTypes.length; i++){
            var index = venues.findIndex(venue => eventsTypes[i].venue == venue.venue);
            if(index == -1){
                venues.push({venue : eventsTypes[i].venue, text : eventsTypes[i].venue, EventsTypes_ids : [{EventsTypes_id : eventsTypes[i]._id, text : eventsTypes[i].short, selected : true}]})
            }else{
                venues[index].EventsTypes_ids.push({EventsTypes_id : eventsTypes[i]._id, text : eventsTypes[i].short, selected : true});
            }
        }

        this.state = {
            startDate : new Date(new Date().setDate(new Date().getDate() - 60)),
            endDate : new Date(),
            startPosition : 1,
            endPosition : 64,
            mainSide : [{value : "main", text : "Main", selected : true}, {value : "side", text : "Side", selected : false}],
            venues: venues
        }
    }

    openOption(){
        $(this.refs.content).slideToggle(0, ()=>{

        })
    }

    mainSide(index){
        var tempArray = this.state.mainSide.concat();
        tempArray[index].selected = !tempArray[index].selected;
        this.setState({mainSide : tempArray});
    }

    mainSideSelectedHandle(mainSide){
        var tempArray = this.state.mainSide.concat();
        var index = tempArray.findIndex((arrayItem)=>{
            return mainSide  == arrayItem.value
        });


    }

    typeSelectedHandle(index1, index2){
        var tempVenues = this.state.venues.concat();
        tempVenues[index1].types[index2].selected = !tempVenues[index1].types[index2].selected;
        this.setState({venues : tempVenues});
    }

    dateSelectedHandle(event, type){
        var temp = {}
        temp[type] = Moment(event.target.value).toDate();
        this.setState(temp);

    }

    positionSelectedHandle(event, type){
        var temp = {}
        temp[type] = parseInt(event.target.value);
        this.setState(temp);
    }

    requestQuery(){
        var request = {}
        request.EventsTypes_ids = [];
        this.state.venues.forEach((venue)=>{
            venue.EventsTypes_ids.forEach((type)=>{
                if(type.selected){
                    request.EventsTypes_ids.push(type.EventsTypes_id);
                }
            })
        })

        request.main = false;
        request.sideboard = false;
        this.state.mainSide.forEach((mainSide)=>{
            if(mainSide.selected){
                if(mainSide.value == "main"){
                    request.main = true;
                }

                if(mainSide.value == "sideboard"){
                    request.sideboard = true;
                }
            }
        })

        request.startDate = this.state.startDate;
        request.endDate = this.state.endDate;
        request.startPosition = this.state.startPosition;
        request.endPosition = this.state.endPosition;

        return request;
    }

    updateOptions(){
        this.props.registerOptions(this.requestQuery());
    }



    componentDidMount(){
        this.props.registerOptions(this.requestQuery());
    }

    render(){
        return(
            <div className="MetaCardsOptionsComponent">
                <div className="metaHeader">
                    <div className="optionsHeader">
                        <div className="buttonsContainer">
                            <div className="optionButton">
                                <button onClick={this.openOption.bind(this)}
                                        className="btn btn-default btn-xs options"
                                        style={{display: "inline"}}>Options<span className="caret"></span></button>

                            </div>
                        </div>
                    </div>
                    <div className="metaTitle"><h4>Cards Breakdown</h4></div>
                </div>
                <div className="content" ref="content">
                    {this.state.venues.map((venue, index1)=>{
                        return <div key={venue.venue} className="custom-column">
                            <div>{venue.text}</div>
                            <ul className="list-unstyled optionsList">
                                {venue.EventsTypes_ids.map((type, index2)=>{
                                    return  <li key={type.EventsTypes_id}>
                                        <input type="checkbox" onChange={(event)=> this.typeSelectedHandle(index1, index2)} checked={type.selected}/>{type.text}
                                    </li>
                                })}
                            </ul>
                        </div>
                    })}
                    <div className="custom-column">
                        <div className="optionListName">Deck Date</div>
                        <div className="inputDiv">
                            <label>
                                <input type="date" onChange={(event)=>this.dateSelectedHandle(event, "startDate")} value={Moment(this.state.startDate).format("YYYY-MM-DD")}/> Start
                            </label>
                        </div>
                        <div className="inputDiv">
                            <label>
                                <input type="date"  onChange={(event)=>this.dateSelectedHandle(event, "endDate")}  value={Moment(this.state.endDate).format("YYYY-MM-DD")}/> End
                            </label>
                        </div>
                        <div className="optionListName">Positions</div>
                        <div className="inputDiv">
                            <label>
                                <input type="number" min="1" onChange={(event)=>this.positionSelectedHandle(event, "startPosition")} value={this.state.startPosition}/> Start
                            </label>
                        </div>
                        <div className="inputDiv">
                            <label>
                                <input type="number" min="2" onChange={(event)=>this.positionSelectedHandle(event, "endPosition")} value={this.state.endPosition}/> end
                            </label>
                        </div>
                    </div>
                    <div className="custom-column">
                        <div className="optionListName">Main or Side</div>
                        {this.state.mainSide.map((mainSide, index)=>{
                            return  <div key={mainSide.value} className="checkbox">
                                        <label>
                                            <input onChange={()=>this.mainSide(index)} type="checkbox" checked={mainSide.selected} value={mainSide.value} />
                                            {mainSide.text}
                                        </label>
                                    </div>
                        })}
                        <div>
                            <button className="btn btn-xs" onClick={this.updateOptions.bind(this)} >Request Changes</button>
                        </div>
                    </div>
                </div>

            </div>


        );
    }
}