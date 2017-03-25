import React from 'react' ;

export default class LGSLocation extends React.Component {
    constructor(){
        super();
        this.state = {
            distance : cookies.get("distance"),
            positionOption : cookies.get("positionOption"),
            ZIP : cookies.get("ZIP"),
            state : cookies.get("state"),
            location : null,
            subscription : []
        }
    }

    navigator(){
        format : Session.get("selectedMenuFormat"),

            navigator.geolocation.getCurrentPosition((location)=> {
                Session.set("position", [location.coords.longitude ,location.coords.latitude]);
                this.setState({location : [location.coords.longitude ,location.coords.latitude] })
            },
            (error)=>{
                console.log(error)
                this.setState({positionOption : "state"});
            },
            {
                enableHighAccuracy: true,
                timeout : 15000
            }

        );
    }

    getPositionOption(){
        if(this.state.positionOption == "GPS"){
            return <span>M: <input onChange={this.changeDistance.bind(this)} value={parseInt(this.state.distance)} className="distanceNumber" min="0" type="number"/></span>
        }else if(this.state.positionOption == "state"){
            const states = ['', 'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO',
                'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU',
                'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY',
                'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN',
                'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
                'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK',
                'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD',
                'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA',
                'WV', 'WI', 'WY', 'AE', 'AA', 'AP']

            return <select onChange={this.stateChange.bind(this)} value={this.state.state}> {states.map((state)=>{
                return <option key={state} value={state}> {state}</option>
            })}
            </select>
        }else if(this.state.positionOption == "ZIP"){
            return <span><input maxLength="5" onChange={this.changeZip.bind(this)} defaultValue={this.state.ZIP} className="zipNumber" type="text"/>M:<input onChange={this.changeDistance.bind(this)} value={this.state.distance} className="distanceNumber" min="0" type="number"/></span>
        }
    }

    subscribe(){


        this.state.subscription.push(Meteor.subscribe("LGSByLocationDistance", this.state.location, this.state.distance, this.state.positionOption, this.state.state, this.state.ZIP, {
            onReady : ()=>{
                if(this.state.subscription.length == 2){
                    this.state.subscription[0].stop();
                    this.state.subscription.shift();
                }
            }
        }));


    }

    changeDistance(e){
        if(e.target.value.length == 0){
            cookies.set("distance", "0");
            this.setState({distance : ""});
        }
        else if(!isNaN(parseInt(e.target.value))){
            cookies.set("distance", e.target.value);
            this.setState({distance : e.target.value});
        }else{
            cookies.set("distance", 0);
            this.setState({distance : 0});
        }
    }

    changedOption(e){
        cookies.set("positionOption", e.target.value);
        Session.set("positionOption", e.target.value);

        this.setState({positionOption : e.target.value});
    }

    stateChange(e){
        cookies.set("state", e.target.value);
        Session.set("state", e.target.value);
        this.setState({state : e.target.value});

    }

    getError(){
        if(this.state.positionOption == "GPS"){
            if(!this.state.location){
                return "GPS Disabled";
            }
        }else if(this.state.positionOption == "state"){
            if(!this.state.state){
                return "Choose State";
            }
        }else if(this.state.positionOption == "ZIP") {
            if(this.state.ZIP == ""){
                return "Bad ZIP";
            }
        }
    }

    changeZip(e, type){

        var ZIP;
        if(type){
            ZIP = e;
        }else {
            ZIP = e.target.value;
        }
          if(!ZIP){
            return;
          }
        if(ZIP.length == 5){
            Meteor.call("checkIfZipExists", ZIP, (err, ZIPQuery)=>{
                var cookies = new Cookies();
                if(ZIPQuery){
                    Session.set("ZIP", ZIP);
                    Session.set("ZIPPosition", [ZIPQuery.LNG, ZIPQuery.LAT]);
                    cookies.set("ZIP", ZIP);
                    this.setState({"ZIP" : ZIP});

                }else{
                    cookies.set("ZIP", "")
                    Session.set("ZIPPosition", []);
                    this.setState({"ZIP" : ""});
                }
            })
        }
    }

    componentDidMount(){
        this.subscribe();
        this.navigator();
        this.changeZip(this.state.ZIP, true);
    }

    shouldComponentUpdate(nextProps, nextState){
        if(nextState.distance != this.state.distance){
            return true;
        }

        if(nextState.positionOption != this.state.positionOption){
            return true;
        }

        if(nextState.ZIP != this.state.ZIP){
            return true;
        }

        if(nextState.state != this.state.state){
            return true;
        }

        if(nextState.location != this.state.location){
            return true;
        }
        return false;
    }

    render(){
        this.subscribe();
        return(
            <div className="LGSLocationComponent">
                <span className="error">{this.getError()}</span>
                <span className="distance">
                                    <select onChange={this.changedOption.bind(this)} value={this.state.positionOption}>
                                        <option value="GPS">GPS</option>
                                        <option value="state">State</option>
                                        <option value="ZIP">ZIP</option>
                                    </select>
                    {this.getPositionOption()}
                </span>

            </div>
        );
    }
}
