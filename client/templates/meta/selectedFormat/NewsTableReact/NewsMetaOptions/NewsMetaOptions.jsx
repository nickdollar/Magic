import React from 'react' ;
import Moment from "moment";

// SCGSuperIQ|SCGInviQualifier|SCGInvitational|SCGClassic|SCGOpen|SCGPlayers'Championship|GrandPrix|LegacyChamps|WorldMagicCup

export default class NewMetaTableOptions extends React.Component {
    constructor() {
        super();

        var date = new Date();


        this.state = {
            newsFrom : [{value : "card", text : "text"}, {value : "card", text : "text"}, {value : "card", text : "text"}]
        }
    }



    typeSelectedHandle(type){

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

        request.startDate = this.state.startDate;
        request.endDate = this.state.endDate;
        request.positionChange = this.state.positionChange;
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
            <div className="NewMetaTableOptionsComponent">
                <div class="metaHeader">
                    <div class="newsTitle"><h4>Last 20 added to Meta</h4></div>
                </div>
                <div class="custom-column">

                    {this.state.optios}<label class="checkbox-inline">
                        <input type="checkbox" role="typeNewCardCheckbox" value="archetypes" checked /> Archetypes
                    </label>
                    <label class="checkbox-inline">
                        <input type="checkbox"  role="typeNewCardCheckbox" value="decks" checked /> Deck
                    </label>
                    <label class="checkbox-inline">
                        <input type="checkbox" role="typeNewCardCheckbox" value="cards" checked /> Cards
                    </label>
                </div>
                <div>
                    <div class="newsTableTable js-newsTableTable">
                        <table id="newsTableTable" class="table table-sm" cellspacing="0" width="100%"></table>

                    </div>
                </div>
            </div>
        );
    }
}