import React from 'react' ;
import Moment from "moment";

export default class NewMetaTableOptions extends React.Component {
    constructor() {
        super();

        var date = new Date();


        this.state = {
            startDate : new Date(new Date().setDate(new Date().getDate() - 60)),
            endDate : new Date(),
            startPosition : 1,
            endPosition : 64,
            mainSide : [{value : "main", text : "Main", selected : true}, {value : "side", text : "Side", selected : false}],
            venues: [
                {
                    venue: "MTGO", text : "MTGO", types: [
                        {type: "daily", text: "Daily", selected : true},
                        {type: "league", text: "League", selected : true}
                    ]
                },
                {
                    venue: "WotC",  text : "WotC", types: [
                        {type: "GP", text: "Grand Prix", selected : true},
                    ]
                },
                {
                    venue: "SCG", text : "SCG", types: [
                        {type: "SCGSuperIQ", text: "Super IQ", selected : true},
                        {type: "SCGInviQualifier", text: "Invi Qualifier", selected : true},
                        {type: "SCGInvitational", text: "Invitational", selected : true},
                        {type: "SCGClassic", text: "Classic", selected : true},
                        {type: "SCGOpen", text: "Open", selected : true},
                        {type: "Players'Championship", text: "Players' Champ", selected : true},
                        {type: "GrandPrix", text: "Grand Prix", selected : true},
                        {type: "LegacyChamps", text: "Legacy Champs", selected : true},
                        {type: "WorldMagicCup", text: "World Magic Cup", selected : true}
                    ]
                },
            ]
        }
    }

    openOption(){
        $(this.refs.content).slideToggle(0, ()=>{

        })
    }

    mainSide(mainSide){
        var tempArray = this.state.mainSide.concat();
        var index = tempArray.findIndex((arrayItem)=>{
           return mainSide  == arrayItem.value
        });
        if(tempArray[index].selected){
            tempArray[index].selected = false;
        }else {
            tempArray[index].selected = true;
        }
        this.setState({mainSide : tempArray});
    }

    mainSideSelectedHandle(mainSide){
        var tempArray = this.state.mainSide.concat();
        var index = tempArray.findIndex((arrayItem)=>{
            return mainSide  == arrayItem.value
        });


    }

    typeSelectedHandle(venue, type, event){
        var tempVenues = this.state.venues.concat();

        var index = tempVenues.findIndex((venueQuery)=>{
          return venueQuery.venue == venue;
        });

        var index2 = tempVenues[index].types.findIndex((typeQuery)=>{
            return typeQuery.type == type;
        });

        if(tempVenues[index].types[index2].selected){
            tempVenues[index].types[index2].selected = false
        }else{
            tempVenues[index].types[index2].selected = true
        }

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
        request.types = [];
        this.state.venues.forEach((venue)=>{
            venue.types.forEach((type)=>{
                if(type.selected){
                    request.types.push(type.type);
                }

            })
        })

        request.mainSide = [];
        this.state.mainSide.forEach((mainSide)=>{
            if(mainSide.selected){
                request.mainSide.push(mainSide.value);
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
                    {this.state.venues.map((venue)=>{
                        return <div key={venue.venue} className="custom-column">
                            <div>{venue.text}</div>
                            <ul className="list-unstyled optionsList">
                                {venue.types.map((type)=>{
                                    return  <li key={type.type}>
                                        <input type="checkbox" onChange={(event)=> this.typeSelectedHandle(venue.venue, type.type, event)} checked={type.selected}/>{type.text}
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
                        {this.state.mainSide.map((mainSide)=>{
                            return  <div key={mainSide.value} className="checkbox">
                                        <label>
                                            <input onChange={()=>this.mainSide(mainSide.value)} type="checkbox" checked={mainSide.selected} value={mainSide.value} />
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